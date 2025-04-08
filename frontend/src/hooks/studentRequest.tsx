import React, { createContext, useContext, ReactNode } from 'react';
import { useStudentStore } from '../stores/student';
import {createQuestion, generateQuestion } from '../utils/request';
import { CreateQuestionResponse } from '../utils/request';

interface StudentRequestContextType {
  /**
   * 提交学生问题并获取分类
   * @param content 问题内容
   * @returns 问题分类结果
   */
  submitQuestion: (content: string) => Promise<{ category: string; confidence: number }>;
  
  /**
   * 请求AI生成问题
   * @param topic 问题主题（可选）
   * @returns 生成的问题内容
   */
  requestGeneratedQuestion: (topic?: string) => Promise<string>;
  
  /**
   * 加载当前学生的所有问题
   * @returns 是否加载成功
   */
  loadStudentQuestions: () => boolean;
}

// 创建上下文
const StudentRequestContext = createContext<StudentRequestContextType | undefined>(undefined);

// Provider组件
export const StudentRequestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentStudent, addQuestion, getStudentQuestions } = useStudentStore();
  
  // 提交问题
  const submitQuestion = async (content: string): Promise<CreateQuestionResponse> => {
    if (!currentStudent) {
      return {
        id: 0,
        content: '',
        category: '',
        student_id: 0,
        student_name: ''
      };
    }
    
    
    
    // 发送请求获取分类
    const result = await createQuestion(content, currentStudent.studentId);
    return result;
  };
  
  // 请求AI生成问题
  const requestGeneratedQuestion = async (topic?: string): Promise<string> => {
    if (!currentStudent) {
      return '请先选择学生';
    }
    
    const generatedContent = await generateQuestion(topic, currentStudent.studentId);
    return generatedContent;
  };
  
  // 加载当前学生的问题
  const loadStudentQuestions = (): boolean => {
    if (!currentStudent) {
      return false;
    }
    
    // 从store中获取问题（实际上这个函数可能不需要，因为store已经有getStudentQuestions方法）
    getStudentQuestions(currentStudent.id);
    return true;
  };
  
  const value = {
    submitQuestion,
    requestGeneratedQuestion,
    loadStudentQuestions
  };
  
  return (
    <StudentRequestContext.Provider value={value}>
      {children}
    </StudentRequestContext.Provider>
  );
};

// 自定义Hook，用于在组件中使用
export const useStudentRequest = (): StudentRequestContextType => {
  const context = useContext(StudentRequestContext);
  if (context === undefined) {
    throw new Error('useStudentRequest必须在StudentRequestProvider内部使用');
  }
  return context;
};

import React, { createContext, useContext, ReactNode } from 'react';
import { 
  getAllStudents, 
  getAllQuestions, 
  getClassifiedQuestions, 
  manualClassifyQuestion, 
  batchClassifyQuestions,
  classifyQuestion
} from '../utils/request';
import { Question, Student } from '../types';
import { useStudentStore } from '../stores/student';
import { App } from 'antd';
interface TeacherRequestContextType {
  /**
   * 获取所有学生列表
   * @returns 学生列表
   */
  fetchAllStudents: () => Promise<Student[]>;
  
  /**
   * 获取所有学生的问题
   * @returns 所有学生的问题列表
   */
  fetchAllQuestions: () => Promise<Question[]>;
  
  /**
   * 获取已分类的所有问题
   * @returns 带有分类的问题列表
   */
  fetchClassifiedQuestions: () => Promise<(Question & { category: string })[]>;
  
  /**
   * 手动对问题进行分类
   * @param questionId 问题ID
   * @param category 分类名称
   * @returns 操作结果
   */
  classifyQuestionManually: (questionId: string, category: string) => Promise<boolean>;
  
  /**
   * 批量分类问题
   * @param questions 问题列表
   * @returns 带有分类的问题列表
   */
  classifyQuestionsBatch: (questions: Question[]) => Promise<(Question & { category: string })[]>;
  
  /**
   * 对单个问题进行分类（与学生端相同）
   * @param content 问题内容
   * @param studentId 学生学号
   * @returns 问题分类结果
   */
  classifySingleQuestion: (content: string, studentId: string) => Promise<{ category: string; confidence: number }>;
}

// 创建上下文
const TeacherRequestContext = createContext<TeacherRequestContextType | undefined>(undefined);

// Provider组件
export const TeacherRequestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 获取学生存储
  const studentStore = useStudentStore();
  const { message } = App.useApp();

  // 获取所有学生
  const fetchAllStudents = async (): Promise<Student[]> => {
    return await getAllStudents();
  };
  
  // 获取所有问题
  const fetchAllQuestions = async (): Promise<Question[]> => {
    return await getAllQuestions();
  };
  
  // 获取已分类的问题
  const fetchClassifiedQuestions = async (): Promise<(Question & { category: string })[]> => {
    return await getClassifiedQuestions();
  };
  
  // 手动分类问题
  const classifyQuestionManually = async (questionId: string, category: string): Promise<boolean> => {
    const result = await manualClassifyQuestion(questionId, category);
    
    // 如果分类成功，更新学生存储中的问题分类
    if (result && studentStore.updateQuestionCategory) {
      studentStore.updateQuestionCategory(questionId, category);
    }
    
    return result;
  };
  
  // 批量分类问题
  const classifyQuestionsBatch = async (questions: Question[]): Promise<(Question & { category: string })[]> => {
    const classifiedQuestions = await batchClassifyQuestions(questions);
    
    // 更新学生存储中的问题分类
    if (classifiedQuestions.length > 0 && studentStore.updateQuestionsCategories) {
      studentStore.updateQuestionsCategories(classifiedQuestions);
    }
    
    return classifiedQuestions;
  };
  
  // 单个问题分类（与学生端相同的接口）
  const classifySingleQuestion = async (content: string, studentId: string): Promise<{ category: string; confidence: number }> => {
    const result = await classifyQuestion(content);
    if(result.category!='未分类'){
      message.success(`问题分类成功:${result.category}`);
      // 更新学生存储中对应问题的分类
      if (studentStore.updateQuestionCategoryByContent) {
        studentStore.updateQuestionCategoryByContent(content, studentId, result.category);
      }
    }
    else{
      message.error(`问题分类失败`);
    }
    
    
    return result;
  };
  
  const value = {
    fetchAllStudents,
    fetchAllQuestions,
    fetchClassifiedQuestions,
    classifyQuestionManually,
    classifyQuestionsBatch,
    classifySingleQuestion
  };
  
  return (
    <TeacherRequestContext.Provider value={value}>
      {children}
    </TeacherRequestContext.Provider>
  );
};

// 自定义Hook，用于在组件中使用
export const useTeacherRequest = (): TeacherRequestContextType => {
  const context = useContext(TeacherRequestContext);
  if (context === undefined) {
    throw new Error('useTeacherRequest必须在TeacherRequestProvider内部使用');
  }
  return context;
};

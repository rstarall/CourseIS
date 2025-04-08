import axios from 'axios';
import { Question, Student } from '../types';

// 基础API配置
const api = axios.create({
  baseURL: 'http://localhost:8090',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 接口类型定义
interface ClassifyQuestionResponse {
  category: string;
  confidence: number;
}

interface GenerateQuestionResponse {
  content: string;
}

export interface CreateQuestionResponse {
  id: number;
  content: string;
  category: string | null;
  student_id: number;
  student_name: string;
}

  /**
   * 发送问题并获取分类
   * @param question 问题内容
   * @returns 问题分类结果
   */
  export const classifyQuestion = async (question: string): Promise<ClassifyQuestionResponse> => {
    try {
      console.log("发送问题并获取分类",question);
      const response = await api.post('/api/teachers/classify-content',
         {content:question},
         {
           headers: {
             'Content-Type': 'application/json'
           }
         }
        );
      return response.data;
    } catch (error) {
      console.error('问题分类请求失败:', error);
      return { category: '未分类', confidence: 0 };
    }
  };

/**
 * 创建问题
 * @param content 问题内容
 * @param studentId 学生学号
 * @returns 创建的问题信息
 */
export const createQuestion = async (content: string, studentId: string): Promise<CreateQuestionResponse> => {
  try {
    const response = await api.post('/api/questions', { 
      content, 
      student_id: studentId 
    });
    return response.data;
  } catch (error) {
    console.error('创建问题请求失败:', error);
    throw error;
  }
};

/**
 * 请求AI生成问题
 * @param topic 问题主题（可选）
 * @param studentId 学生学号
 * @returns 生成的问题内容
 */
export const generateQuestion = async (topic?: string, studentId?: string): Promise<string> => {
  try {
    const response = await api.post<GenerateQuestionResponse>('/generate', { 
      topic, 
      studentId 
    });
    return response.data.content;
  } catch (error) {
    console.error('问题生成请求失败:', error);
    return '无法生成问题，请稍后再试';
  }
};

/**
 * 批量分类问题
 * @param questions 问题列表
 * @returns 带有分类的问题列表
 */
export const batchClassifyQuestions = async (questions: Question[]): Promise<(Question & { category: string })[]> => {
  try {
    const response = await api.post('/batch-classify', { questions });
    return response.data;
  } catch (error) {
    console.error('批量问题分类请求失败:', error);
    // 返回原问题但添加默认分类
    return questions.map(q => ({ ...q, category: '未分类' }));
  }
};

/*教师端接口*/

/**
 * 获取所有学生列表
 * @returns 学生列表
 */
export const getAllStudents = async (): Promise<Student[]> => {
  try {
    const response = await api.get('/teacher/students');
    return response.data;
  } catch (error) {
    console.error('获取学生列表失败:', error);
    return [];
  }
};

/**
 * 获取所有学生的问题
 * @returns 所有学生的问题列表
 */
export const getAllQuestions = async (): Promise<Question[]> => {
  try {
    const response = await api.get('/teacher/questions');
    return response.data;
  } catch (error) {
    console.error('获取所有问题失败:', error);
    return [];
  }
};

/**
 * 获取已分类的所有问题
 * @returns 带有分类的问题列表
 */
export const getClassifiedQuestions = async (): Promise<(Question & { category: string })[]> => {
  try {
    const response = await api.get('/teacher/classified-questions');
    return response.data;
  } catch (error) {
    console.error('获取分类问题失败:', error);
    return [];
  }
};

/**
 * 手动对问题进行分类
 * @param questionId 问题ID
 * @param category 分类名称
 * @returns 操作结果
 */
export const manualClassifyQuestion = async (questionId: string, category: string): Promise<boolean> => {
  try {
    await api.post('/teacher/manual-classify', { questionId, category });
    return true;
  } catch (error) {
    console.error('手动分类问题失败:', error);
    return false;
  }
};

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Student, Question } from '../types';
import { generateStudents } from '../utils/mockData';

interface StudentState {
  // 当前登录的学生
  currentStudent: Student | null;
  // 所有学生列表
  students: Student[];
  // 所有问题列表，按学生ID索引
  questions: Record<string, Question[]>;
  // 生成20个学生并添加到列表
  generateAndLoadStudents: () => Student[];
  // 设置当前学生
  setCurrentStudent: (student: Student) => void;
  // 根据学号切换学生
  switchStudentByStudentId: (studentId: string) => void;
  // 添加新问题
  addQuestion: (content: string) => Question;
  // 获取特定学生的所有问题
  getStudentQuestions: (studentId: string) => Question[];
  // 获取所有学生的所有问题
  getAllStudentQuestions: () => Question[];
  // 更新问题分类
  updateQuestionCategory: (questionId: string, category: string) => void;
  // 批量更新问题分类
  updateQuestionsCategories: (questions: (Question & { category: string })[]) => void;
  // 根据内容更新问题分类
  updateQuestionCategoryByContent: (content: string, studentId: string, category: string) => void;
}

export const useStudentStore = create<StudentState>()(
  persist(
    (set, get) => ({
      currentStudent: null,
      students: [],
      questions: {},

      generateAndLoadStudents: () => {
        const students = generateStudents(20);
        set({ students });
        return students;
      },

      setCurrentStudent: (student: Student) => {
        set({ currentStudent: student });
      },

      switchStudentByStudentId: (studentId: string) => {
        const { students } = get();
        const student = students.find(s => s.studentId === studentId);
        if (student) {
          set({ currentStudent: student });
        } else {
          console.warn(`未找到学号为 ${studentId} 的学生`);
        }
      },

      addQuestion: (content: string): Question => {
        const { currentStudent, questions } = get();
        if (!currentStudent) {
          throw new Error('No current student selected');
        }
        
        const newQuestion: Question = {
          id: `q_${Date.now()}`,
          content,
          studentName: currentStudent.name,
          studentId: currentStudent.studentId,
          timestamp: Date.now()
        };
        
        const studentQuestions = questions[currentStudent.id] || [];
        
        set({
          questions: {
            ...questions,
            [currentStudent.studentId]: [...studentQuestions, newQuestion]
          }
        });
        return newQuestion;
      },

      getStudentQuestions: (studentId: string) => {
        const { questions } = get();
        return questions[studentId] || [];
      },

      getAllStudentQuestions: () => {
        const { questions } = get();
        return Object.values(questions).flat();
      },

      updateQuestionCategory: (questionId: string, category: string) => {
        const { questions } = get();
        const updatedQuestions: Record<string, Question[]> = {};
        
        // 遍历所有学生的问题
        Object.entries(questions).forEach(([studentId, studentQuestions]) => {
          // 查找并更新问题
          const updatedStudentQuestions = studentQuestions.map(q => 
            q.id === questionId ? { ...q, category } : q
          );
          
          updatedQuestions[studentId] = updatedStudentQuestions;
        });
        
        set({ questions: updatedQuestions });
      },
      
      updateQuestionsCategories: (classifiedQuestions: (Question & { category: string })[]) => {
        const { questions } = get();
        const updatedQuestions: Record<string, Question[]> = { ...questions };
        
        // 按学生ID分组问题
        classifiedQuestions.forEach(question => {
          const studentId = question.studentId;
          if (!updatedQuestions[studentId]) {
            updatedQuestions[studentId] = [];
          }
          
          // 查找并更新问题
          const index = updatedQuestions[studentId].findIndex(q => q.id === question.id);
          if (index !== -1) {
            updatedQuestions[studentId][index] = { ...question };
          } else {
            updatedQuestions[studentId].push(question);
          }
        });
        
        set({ questions: updatedQuestions });
      },
      
      updateQuestionCategoryByContent: (content: string, studentId: string, category: string) => {
        const { questions } = get();
        const studentQuestions = questions[studentId] || [];
        console.log("学生ID",studentId);
        console.log("学生问题",questions);
        console.log("更新问题分类",studentQuestions);
        // 标准化内容字符串，去除多余空格并转为小写以提高匹配率
        const normalizeContent = (text: string) => {
          return text.trim().replace(/\s+/g, ' ').toLowerCase();
        };
        
        const normalizedContent = normalizeContent(content);
        
        // 查找并更新问题，使用标准化后的内容进行比较
        const updatedStudentQuestions = studentQuestions.map(q => 
          normalizeContent(q.content) === normalizedContent ? { ...q, category } : q
        );
        
        console.log("更新问题分类", updatedStudentQuestions);
        set({
          questions: {
            ...questions,
            [studentId]: updatedStudentQuestions
          }
        });
      }
    }),
    {
      name: 'student-storage', // 存储的唯一名称
      partialize: (state) => ({
        // 只持久化这些状态，不持久化方法
        currentStudent: state.currentStudent,
        students: state.students,
        questions: state.questions,
      }),
    }
  )
);

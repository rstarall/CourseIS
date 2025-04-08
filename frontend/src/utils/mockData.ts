import { Student, Question } from '../types';

// 生成随机学生数据
export const generateStudents = (count: number): Student[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: `s${index + 1}`,
    name: `学生${index + 1}`,
    studentId: `2024${String(index + 1).padStart(4, '0')}`
  }));
};

// 示例问题模板
const questionTemplates = [
  "能否详细解释一下{topic}的概念？",
  "{topic}在实际应用中如何使用？",
  "{topic}与{relatedTopic}有什么关系？",
  "为什么{topic}这么重要？",
  "如何解决{topic}相关的问题？"
];

const topics = [
  "力学", "热学", "电磁学", "光学", "量子力学",
  "牛顿定律", "动能定理", "势能", "机械能守恒",
  "向心力", "万有引力", "电场", "磁场"
];

// 生成随机问题
export const generateQuestions = (students: Student[]): Question[] => {
  return students.map(student => ({
    id: `q${student.id}`,
    content: generateRandomQuestion(),
    studentName: student.name,
    studentId: student.studentId,
    timestamp: Date.now() - Math.floor(Math.random() * 1000000)
  }));
};

function generateRandomQuestion(): string {
  const template = questionTemplates[Math.floor(Math.random() * questionTemplates.length)];
  const topic = topics[Math.floor(Math.random() * topics.length)];
  const relatedTopic = topics[Math.floor(Math.random() * topics.length)];
  return template.replace('{topic}', topic).replace('{relatedTopic}', relatedTopic);
} 
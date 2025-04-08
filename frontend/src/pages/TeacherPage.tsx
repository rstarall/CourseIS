import React, { useEffect, useState } from 'react';
import { Card, message, Tabs } from 'antd';
import QuestionList from '../components/Teacher/QuestionList';
import { Question } from '../types';
import { generateStudents, generateQuestions } from '../utils/mockData';

const TeacherPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    // 模拟获取问题数据
    const students = generateStudents(25);
    const mockQuestions = generateQuestions(students);
    setQuestions(mockQuestions);
  }, []);

  const handleClassify = () => {
    // 模拟AI分类过程
    const categories = [
      '知识点定义类',
      '知识点应用类',
      '知识点关联类',
      '概念理解类',
      '实验操作类',
      '计算推导类'
    ];

    const classifiedQuestions = questions.map(q => ({
      ...q,
      category: categories[Math.floor(Math.random() * categories.length)]
    }));

    setQuestions(classifiedQuestions);
    message.success('问题分类完成！');
  };

  return (
    <div style={{ padding: 24 }}>
      <Card title="教师管理系统">
        <Tabs
          items={[
            {
              key: 'list',
              label: '问题列表',
              children: <QuestionList questions={questions} onClassify={handleClassify} />
            }
          ]}
        />
      </Card>
    </div>
  );
};

export default TeacherPage; 
import React, { useEffect, useState } from 'react';
import { List, Card, Button, Space, Tag, message } from 'antd';
import { Question } from '../../types';
import { useStudentStore } from '../../stores/student';
import { useTeacherRequest } from '../../hooks/teacherRequest';



const QuestionList: React.FC= () => {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const {questions,getAllStudentQuestions } = useStudentStore();
  const { classifySingleQuestion } = useTeacherRequest();
  
  useEffect(() => {
    // 从学生存储中获取所有问题
    const fetchedQuestions = getAllStudentQuestions();
    setAllQuestions(fetchedQuestions);
  }, [getAllStudentQuestions]);

  //监控更新
  useEffect(() => {
    setAllQuestions(Object.values(questions).flat());
  }, [questions]);
  
  const handleClassify = async () => {
    try {
      setLoading(true);
      
      // 逐个分类问题
      const questionsToClassify = allQuestions.length > 0 ? allQuestions : [];
      for (const question of questionsToClassify) {
        if (question.category=='未分类') {
          console.log("分类问题",question);
          console.log("学生ID",question.studentId);
          await classifySingleQuestion(question.content, question.studentId);
        }
      }
      
      message.success('问题分类完成');
    } catch (error) {
      message.error('问题分类失败');
      console.error('分类问题失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleClassify} loading={loading}>
          AI分类
        </Button>
      </Space>
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={allQuestions.length > 0 ? allQuestions : []}
        renderItem={(question) => (
          <List.Item>
            <Card>
              <h4>{question.content}</h4>
              <p>
                提问者：{question.studentName} (学号：{question.studentId})
              </p>
              <div>
                <Tag color="blue">{question.category || '未分类'}</Tag>
                <span style={{ marginLeft: 8, color: '#999' }}>
                  {new Date(question.timestamp).toLocaleString()}
                </span>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default QuestionList; 
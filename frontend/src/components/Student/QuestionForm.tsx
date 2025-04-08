"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  XProvider, 
  Bubble, 
  Sender,
  Prompts
} from '@ant-design/x';
import { Avatar, Typography, Dropdown, Menu, Modal, List, message as messageStatic, Tag, App } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Student, Question } from '../../types';
import { useStudentStore } from '../../stores/student';
import { useStudentRequest } from '../../hooks/studentRequest';

const QuestionForm: React.FC = () => {
  const [value, setValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const {questions,currentStudent, setCurrentStudent,updateQuestionCategory, addQuestion, getStudentQuestions, switchStudentByStudentId, students, generateAndLoadStudents } = useStudentStore();
  const { submitQuestion } = useStudentRequest();
  const { message } = App.useApp();
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [student, setStudent] = useState<Student | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [questionCategory, setQuestionCategory] = useState<string>('');

  useEffect(() => {
    if (students.length === 0) {
      const studentsAll=generateAndLoadStudents();
      setCurrentStudent(studentsAll[0]);
      setStudent(studentsAll[0])
    }
  }, []);
  
  //更新当前学生信息
  useEffect(() => {
    if (students.length > 0) {
        if(currentStudent){
            setStudent(currentStudent);
        }
        else{
            setStudent(students[0]);
        }
    }
  }, [students, currentStudent]);

  useEffect(() => {
    if (student) {
      const studentQuestions = getStudentQuestions(student.studentId);
      setCurrentQuestions(studentQuestions);
    }
  }, [student, getStudentQuestions]);

  // 监控问题列表的更新
  useEffect(() => {
    if (currentStudent && questions) {
      if(questions[currentStudent.studentId]){
        setCurrentQuestions(questions[currentStudent.studentId]);
      }
    }
  }, [currentStudent,questions]);

  const handleSubmit = async (content: string) => {
    if (!content.trim() || !student) return;
    
    try {
      const newQuestion = addQuestion(content);
      // 使用 submitQuestion 发送问题分类请求
      const result = await submitQuestion(content);
      setQuestionCategory(result.category);
      
      updateQuestionCategory(newQuestion.id,result.category);
      
      message.success(`问题已提交`);
    } catch (error) {
      message.error('提交问题失败');
      console.error('提交问题失败:', error);
    }
    
    setValue('');
  };

  const renderBubbleItem = (question: Question) => {
    return {
      key: question.id,
      content: question.content,
      messageRender: (content: string) => (
        <div className="bg-blue-50 rounded-lg mb-2 flex flex-col"
          style={{
            backgroundColor: '#e5f4ff',
            borderRadius: '10px',
            padding: '10px',
            marginBottom: '10px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div className="flex items-center justify-between mb-2 p-2 h-2"
            style={{
              backgroundColor: '#e5f4ff',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Tag color="blue" bordered>
              {question.category || '未分类'}
            </Tag>
            <small className="text-gray-500">
              {new Date(question.timestamp).toLocaleString()}
            </small>
          </div>
          <div className="p-2"
            style={{
              backgroundColor: '#e5f4ff',
              borderRadius: '10px',
              marginTop: '5px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {content}
          </div>
        </div>
      ),
      placement: 'end' as const,
      variant: 'filled' as const,
      shape: 'round' as const,
    };
  };

  const showStudentModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleStudentSelect = (studentId: string) => {
    switchStudentByStudentId(studentId);
    setIsModalVisible(false);
  };

  const handlePromptClick = (info: { data: any }) => {
    setValue(info.data.label);
  };

  const promptItems = [
    {
      key: '1',
      label: '能否详细解释一下力学的概念？',
    },
    {
      key: '2',
      label: '电磁学在实际应用中如何使用？',
    },
    {
      key: '3',
      label: '量子力学与相对论有什么关系？',
    },
    {
      key: '4',
      label: '为什么牛顿定律这么重要？',
    },
    {
      key: '5',
      label: '如何解决动能定理相关的问题？',
    },
  ];

  const menu = (
    <Menu
      items={[
        {
          key: '1',
          icon: <UserOutlined />,
          label: '切换学生',
          onClick: showStudentModal
        },
        {
          key: '2',
          icon: <LogoutOutlined />,
          label: '退出登录',
          onClick: () => console.log('退出登录')
        },
      ]}
    />
  );

  return (
    <XProvider>
      <div ref={containerRef} className='bg-white relative overflow-auto'>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '0 0 10px 0',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <div>
            <h3>欢迎，{student?.name}！</h3>
            <p>学号：{student?.studentId}</p>
          </div>
          <Dropdown overlay={menu} placement="bottomRight">
            <Avatar 
              style={{ cursor: 'pointer', backgroundColor: '#1890ff' }} 
              icon={<UserOutlined />} 
              size="large"
            />
          </Dropdown>
        </div>
        
        <div className='bg-white' style={{ 
          flex: 1, 
          overflow: 'auto', 
          padding: '20px',
          minHeight: '300px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {currentQuestions.map(q => (
            <div key={q.id}>
              {renderBubbleItem(q).messageRender(q.content)}
            </div>
          ))}
        </div>
        
        <div style={{ padding: '10px 20px 0', borderTop: '1px solid #eee' }}>
          <Prompts
            title="你可能想问："
            items={promptItems}
            onItemClick={handlePromptClick}
            wrap
            aria-rowcount={1}
            className='mb-4 pb-4'
            style={{padding: '10px'}}
            styles={
                {
                    item: {
                        flex: 'none',
                        width: 'calc(30% - 6px)',
                        backgroundImage: `linear-gradient(137deg, #e5f4ff 0%, #efe7ff 100%)`,
                        border: 0,
                    },
                    subItem: {
                        background: 'rgba(255,255,255,0.45)',
                        border: '1px solid #FFF',
                    },
                }
            }
          />
          <Sender
            value={value}
            onChange={setValue}
            onSubmit={handleSubmit}
            placeholder="请输入您的问题..."
            submitType="enter"
          />
        </div>

        <Modal
          title="选择学生"
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <List
            dataSource={students}
            renderItem={(item) => (
              <List.Item 
                key={item.id}
                onClick={() => handleStudentSelect(item.studentId)}
                style={{ cursor: 'pointer' }}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={item.name}
                  description={`学号: ${item.studentId}`}
                />
              </List.Item>
            )}
          />
        </Modal>
      </div>
    </XProvider>
  );
};

export default QuestionForm;
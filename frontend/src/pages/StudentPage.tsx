import React from 'react';
import { Card } from 'antd';
import QuestionForm from '../components/Student/QuestionForm';


const StudentPage: React.FC = () => {


  return (
    <div style={{ padding: 24 }}>
      <Card title="学生提问系统">
        <QuestionForm />
      </Card>
    </div>
  );
};

export default StudentPage; 
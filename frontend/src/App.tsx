import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Layout, Tabs } from 'antd';
import { UserOutlined, BookOutlined } from '@ant-design/icons';
import StudentPage from './pages/StudentPage';
import TeacherPage from './pages/TeacherPage';

const { Content, Header } = Layout;

const AppContent: React.FC = () => {
  const [activeKey, setActiveKey] = useState('student');
  const navigate = useNavigate();

  const items = [
    {
      key: 'student',
      label: (
        <span>
          <UserOutlined />
          学生端
        </span>
      ),
    },
    {
      key: 'teacher',
      label: (
        <span>
          <BookOutlined />
          教师端
        </span>
      ),
    },
  ];

  const handleTabChange = (key: string) => {
    setActiveKey(key);
    navigate(`/${key === 'student' ? 'student' : 'teacher'}`);
  };

  return (
    <Layout style={{ 
      minHeight: '100vh', 
      minWidth: '100vw', 
      height: '100%', 
      width: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Header style={{ 
        padding: 0, 
        background: '#fff', 
        position: 'sticky', 
        top: 0, 
        zIndex: 1,
        width: '100%'
      }}>
        <Tabs
          activeKey={activeKey}
          onChange={handleTabChange}
          items={items}
          style={{ 
            marginBottom: 0,
            width: '100%'
          }}
          centered
        />
      </Header>
      <Content style={{ 
        padding: '10px', 
        flex: 1, 
        overflow: 'auto',
        width: '100%',
        height: 'calc(100vh - 64px)' // 减去Header的高度
      }}>
        <Routes>
          <Route path="/student" element={<StudentPage />} />
          <Route path="/teacher" element={<TeacherPage />} />
          <Route path="/" element={<StudentPage />} />
        </Routes>
      </Content>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;

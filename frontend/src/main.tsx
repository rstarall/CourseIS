import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider, App as AntdApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import './index.css'
import App from './App.tsx'
import { StudentRequestProvider } from './hooks/studentRequest.tsx'
import { TeacherRequestProvider } from './hooks/teacherRequest.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider locale={zhCN}>
      <AntdApp>
        <StudentRequestProvider>
          <TeacherRequestProvider>
            <App />
          </TeacherRequestProvider>
        </StudentRequestProvider>
      </AntdApp>
    </ConfigProvider>
  </StrictMode>,
)

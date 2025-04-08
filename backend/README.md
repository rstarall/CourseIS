# 课堂互动系统

基于LangChain和FastAPI的智能课堂互动系统，支持学生提问和教师管理功能。

## 功能特点

- 学生端：
  - 提交问题
  - 查看问题状态
  
- 教师端：
  - 查看所有学生问题
  - AI自动分类问题
  - 批量处理问题

## 技术栈

- FastAPI
- LangChain
- TinyDB/PostgreSQL
- SQLAlchemy
- OpenAI GPT-3.5

## 安装说明

1. 克隆项目
```bash
git clone [项目地址]
cd classroom-interaction
```

2. 安装依赖
```bash
pip install -r requirements.txt
```

3. 配置环境变量
复制`.env.example`文件为`.env`，并填写相应的配置信息：
- 数据库配置（支持TinyDB和PostgreSQL）
- OpenAI API密钥

4. 初始化数据库
```bash
# 如果使用PostgreSQL
createdb classroom
```

5. 运行项目
```bash
uvicorn main:app --reload
```

## API文档

启动服务后访问：http://localhost:8000/docs

### 主要接口

#### 学生相关
- POST /api/students/ - 创建学生
- GET /api/students/ - 获取所有学生
- POST /api/students/batch - 批量创建学生

#### 问题相关
- POST /api/questions/ - 提交问题
- GET /api/questions/ - 获取所有问题
- POST /api/questions/classify - 批量分类问题

#### 教师相关
- GET /api/teachers/questions - 获取所有问题
- GET /api/teachers/questions/classified - 获取已分类问题
- POST /api/teachers/questions/{question_id}/classify - 分类单个问题

## 项目结构

```
classroom-interaction/
├── app/
│   ├── agents/
│   │   └── question_agent.py
│   │   
│   ├── core/
│   │   └── config.py
│   │   
│   ├── db/
│   │   ├── adapters/
│   │   │   ├── base.py
│   │   │   ├── factory.py
│   │   │   └── tinydb_adapter.py
│   │   ├── base_class.py
│   │   ├── session.py
│   │   └── service.py
│   │   
│   ├── models/
│   │   └── models.py
│   │   
│   └── routers/
│       ├── students.py
│       ├── teachers.py
│       └── questions.py
│   
├── main.py
├── requirements.txt
└── .env
```

## 数据库适配器

系统支持多种数据库适配器：

1. TinyDB适配器
   - 轻量级文档数据库
   - 适合小型应用和原型开发
   - 无需额外配置

2. PostgreSQL适配器（待实现）
   - 关系型数据库
   - 适合生产环境
   - 需要额外配置

## 使用说明

1. 首先创建学生账号
2. 学生可以提交问题
3. 教师可以查看所有问题
4. 使用AI自动分类功能对问题进行分类
5. 查看分类结果

## 注意事项

- 默认使用TinyDB作为数据库
- 需要有效的OpenAI API密钥
- 建议使用Python 3.8+ 
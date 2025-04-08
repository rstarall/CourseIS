from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import students, teachers, questions
from app.core.config import settings
from app.db.service import db_service

@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    # 启动时连接数据库
    await db_service.connect()
    yield
    # 关闭时断开数据库连接
    await db_service.disconnect()

app = FastAPI(
    title="课堂互动系统",
    description="基于LangChain的智能课堂互动系统",
    version="1.0.0",
    lifespan=lifespan
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(students.router, prefix="/api/students", tags=["students"])
app.include_router(teachers.router, prefix="/api/teachers", tags=["teachers"])
app.include_router(questions.router, prefix="/api/questions", tags=["questions"])

@app.get("/")
async def root():
    return {"message": "欢迎使用课堂互动系统"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8090)

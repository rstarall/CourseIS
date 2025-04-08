from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.db.service import db_service
from app.agents.question_agent import QuestionClassifier
from pydantic import BaseModel
import uuid
router = APIRouter()
classifier = QuestionClassifier()

class QuestionCreate(BaseModel):
    content: str
    student_id: str

class QuestionResponse(BaseModel):
    id: int | str
    content: str | None
    category: str | None
    student_id: int | str
    student_name: str | None

@router.post("/", response_model=QuestionResponse)
async def create_question(question: QuestionCreate):
    # # 查找学生
    # students = await db_service.query("students", {"student_id": {"eq": question.student_id}})
    # if not students:
    #     raise HTTPException(status_code=404, detail="Student not found")
    
    # student = students[0]
    
    # 创建问题
    question_dict = {
        "content": question.content,
        "student_id": question.student_id,
        "category": None
    }
    # created_question = await db_service.create("questions", question_dict)
    
    return QuestionResponse(
        id=str(uuid.uuid4()),
        content=question_dict["content"],
        category="未分类",
        student_id=question_dict["student_id"],
        student_name="test"
    )

@router.get("/", response_model=List[QuestionResponse])
async def get_questions():
    questions = await db_service.read_all("questions")
    result = []
    
    for question in questions:
        # 查找学生信息
        students = await db_service.query("students", {"id": {"eq": question["student_id"]}})
        if students:
            student = students[0]
            result.append(QuestionResponse(
                id=question["id"],
                content=question["content"],
                category=question["category"],
                student_id=question["student_id"],
                student_name=student["name"]
            ))
    
    return result

@router.post("/classify")
async def classify_questions():
    # 获取所有未分类的问题
    questions = await db_service.query("questions", {"category": None})
    
    # 批量分类
    questions_text = [q["content"] for q in questions]
    classifications = await classifier.batch_classify(questions_text)
    
    # 更新数据库
    for question, classification in zip(questions, classifications):
        await db_service.update("questions", question["id"], {"category": classification["category"]})
    
    return {"message": "Questions classified successfully"} 
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.db.service import db_service
from app.agents.question_agent import QuestionClassifier
from pydantic import BaseModel

router = APIRouter()
classifier = QuestionClassifier()

class QuestionWithStudent(BaseModel):
    id: int
    content: str
    category: str | None
    student_id: str
    student_name: str

class QuestionContent(BaseModel):
    content: str

class ClassificationResponse(BaseModel):
    category: str
    confidence: float
    content: str

@router.get("/questions", response_model=List[QuestionWithStudent])
async def get_all_questions():
    questions = await db_service.read_all("questions")
    result = []
    
    for question in questions:
        # 查找学生信息
        students = await db_service.query("students", {"id": {"eq": question["student_id"]}})
        if students:
            student = students[0]
            result.append(QuestionWithStudent(
                id=question["id"],
                content=question["content"],
                category=question["category"],
                student_id=student["student_id"],
                student_name=student["name"]
            ))
    
    return result

@router.get("/questions/classified", response_model=List[QuestionWithStudent])
async def get_classified_questions():
    questions = await db_service.query("questions", {"category": {"ne": None}})
    result = []
    
    for question in questions:
        # 查找学生信息
        students = await db_service.query("students", {"id": {"eq": question["student_id"]}})
        if students:
            student = students[0]
            result.append(QuestionWithStudent(
                id=question["id"],
                content=question["content"],
                category=question["category"],
                student_id=student["student_id"],
                student_name=student["name"]
            ))
    
    return result

@router.post("/questions/{question_id}/classify")
async def classify_single_question(question_id: int):
    # 获取问题
    question = await db_service.read("questions", question_id)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    # 分类问题
    classification = await classifier.classify_question(question["content"])
    await db_service.update("questions", question_id, {"category": classification["category"]})
    
    return {
        "message": "Question classified successfully",
        "category": classification["category"],
        "confidence": classification["confidence"]
    } 

@router.post("/classify-content", response_model=ClassificationResponse)
async def classify_question_content(question: QuestionContent):
    """
    直接对提供的问题内容进行分类，无需存储到数据库
    
    Args:
        question: 包含问题内容的模型，有content字段
        
    Returns:
        分类结果，包含类别和置信度
    """
    # 从请求体中获取问题内容
    content = question.content
    if not content:
        raise HTTPException(status_code=422, detail="问题内容不能为空")
    
    # 直接分类问题内容
    classification = await classifier.classify_question(content)
    print(classification)
    return ClassificationResponse(
        category=classification["category"],
        confidence=classification["confidence"],
        content=content
    )

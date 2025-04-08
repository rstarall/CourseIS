from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.db.service import db_service
from pydantic import BaseModel

router = APIRouter()

class StudentCreate(BaseModel):
    student_id: str
    name: str

class StudentResponse(BaseModel):
    id: int
    student_id: str
    name: str

@router.post("/", response_model=StudentResponse)
async def create_student(student: StudentCreate):
    # 检查学生是否已存在
    existing_students = await db_service.query("students", {"student_id": {"eq": student.student_id}})
    if existing_students:
        raise HTTPException(status_code=400, detail="Student ID already exists")
    
    # 创建新学生
    student_dict = await db_service.model_to_dict(student)
    created_student = await db_service.create("students", student_dict)
    
    return StudentResponse(**created_student)

@router.get("/", response_model=List[StudentResponse])
async def get_students():
    students = await db_service.read_all("students")
    return [StudentResponse(**student) for student in students]

@router.post("/batch")
async def create_students(students: List[StudentCreate]):
    created_students = []
    for student in students:
        # 检查学生是否已存在
        existing_students = await db_service.query("students", {"student_id": {"eq": student.student_id}})
        if not existing_students:
            student_dict = await db_service.model_to_dict(student)
            created_student = await db_service.create("students", student_dict)
            created_students.append(created_student)
    
    return {"message": f"Created {len(created_students)} students successfully"} 
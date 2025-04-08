from tinydb import TinyDB
from .base import DatabaseAdapter
from app.core.config import settings
import os

class TinyDBAdapter(DatabaseAdapter):
    def __init__(self):
        self.db_path = settings.TINYDB_PATH
        self.db = None

    async def connect(self):
        # 确保数据目录存在
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        self.db = TinyDB(self.db_path)

    async def disconnect(self):
        if self.db:
            self.db.close()

    async def get_student(self, student_id: str):
        if not self.db:
            raise RuntimeError("Database not connected")
        Student = self.db.table('students')
        return Student.get(doc_id=int(student_id))

    async def create_student(self, student_data: dict):
        if not self.db:
            raise RuntimeError("Database not connected")
        Student = self.db.table('students')
        return Student.insert(student_data)

    async def update_student(self, student_id: str, student_data: dict):
        if not self.db:
            raise RuntimeError("Database not connected")
        Student = self.db.table('students')
        Student.update(student_data, doc_ids=[int(student_id)])

    async def delete_student(self, student_id: str):
        if not self.db:
            raise RuntimeError("Database not connected")
        Student = self.db.table('students')
        Student.remove(doc_ids=[int(student_id)])
from abc import ABC, abstractmethod

class DatabaseAdapter(ABC):
    @abstractmethod
    async def connect(self):
        pass

    @abstractmethod
    async def disconnect(self):
        pass

    @abstractmethod
    async def get_student(self, student_id: str):
        pass

    @abstractmethod
    async def create_student(self, student_data: dict):
        pass

    @abstractmethod
    async def update_student(self, student_id: str, student_data: dict):
        pass

    @abstractmethod
    async def delete_student(self, student_id: str):
        pass
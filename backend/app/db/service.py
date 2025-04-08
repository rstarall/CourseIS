from typing import List, Dict, Any, Optional, Type, TypeVar
from app.db.adapters.factory import DatabaseAdapterFactory, DatabaseType
from app.core.config import settings
from pydantic import BaseModel

T = TypeVar('T', bound=BaseModel)

class DatabaseService:
    """数据库服务层"""
    
    def __init__(self):
        self.adapter = DatabaseAdapterFactory.create_adapter(settings.DATABASE_TYPE)
        
    async def connect(self):
        """连接到数据库"""
        await self.adapter.connect()
        
    async def disconnect(self):
        """断开数据库连接"""
        await self.adapter.disconnect()
        
    async def create(self, collection: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """创建记录"""
        return await self.adapter.create(collection, data)
        
    async def read(self, collection: str, id: Any) -> Optional[Dict[str, Any]]:
        """读取单条记录"""
        return await self.adapter.read(collection, id)
        
    async def read_all(self, collection: str) -> List[Dict[str, Any]]:
        """读取所有记录"""
        return await self.adapter.read_all(collection)
        
    async def update(self, collection: str, id: Any, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """更新记录"""
        return await self.adapter.update(collection, id, data)
        
    async def delete(self, collection: str, id: Any) -> bool:
        """删除记录"""
        return await self.adapter.delete(collection, id)
        
    async def query(self, collection: str, query_dict: Dict[str, Any]) -> List[Dict[str, Any]]:
        """查询记录"""
        return await self.adapter.query(collection, query_dict)
        
    async def model_to_dict(self, model: T) -> Dict[str, Any]:
        """将Pydantic模型转换为字典"""
        return model.model_dump()
        
    async def dict_to_model(self, data: Dict[str, Any], model_class: Type[T]) -> T:
        """将字典转换为Pydantic模型"""
        return model_class(**data)

# 创建全局数据库服务实例
db_service = DatabaseService() 
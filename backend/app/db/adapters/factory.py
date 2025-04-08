from app.core.config import DatabaseType
from .tinydb_adapter import TinyDBAdapter
from .base import DatabaseAdapter

class DatabaseAdapterFactory:
    @staticmethod
    def create_adapter(db_type: DatabaseType) -> DatabaseAdapter:
        if db_type == DatabaseType.TINYDB:
            return TinyDBAdapter()
        elif db_type == DatabaseType.POSTGRES:
            # PostgreSQL适配器将在后续实现
            raise NotImplementedError("PostgreSQL adapter not implemented yet")
        else:
            raise ValueError(f"Unsupported database type: {db_type}")
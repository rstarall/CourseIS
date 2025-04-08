from pydantic_settings import BaseSettings
from typing import Optional
from enum import Enum

# 定义数据库类型枚举，避免循环导入
class DatabaseType(str, Enum):
    """数据库类型枚举"""
    TINYDB = "tinydb"
    POSTGRES = "postgres"

class LLMProvider(str, Enum):
    """LLM提供商枚举"""
    OPENAI = "openai"
    SILICONFLOW = "siliconflow"

class Settings(BaseSettings):
    PROJECT_NAME: str = "课堂互动系统"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # 数据库配置
    DATABASE_TYPE: DatabaseType = DatabaseType.TINYDB
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "classroom"
    SQLALCHEMY_DATABASE_URI: Optional[str] = None
    
    # TinyDB配置
    TINYDB_PATH: str = "data/db.json"
    
    # LLM配置
    LLM_PROVIDER: LLMProvider = LLMProvider.SILICONFLOW
    API_BASE: str = "https://api.siliconflow.cn/v1"
    API_KEY: str = ""
    BASE_MODEL: str = "deepseek-ai/DeepSeek-V2.5"
    OPENAI_API_KEY: str = ""  # 保留OpenAI配置用于备选
    
    class Config:
        env_file = ".env"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if self.DATABASE_TYPE == DatabaseType.POSTGRES:
            self.SQLALCHEMY_DATABASE_URI = (
                f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
                f"@{self.POSTGRES_SERVER}/{self.POSTGRES_DB}"
            )

settings = Settings()
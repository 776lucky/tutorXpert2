from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# 加载 .env 文件
load_dotenv()

# 默认连接字符串（本地 SQLite）
DATABASE_URL = os.getenv("DATABASE_URL", "")

# SQLite 特有参数配置
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
else:
    connect_args = {}  # ✅ PostgreSQL/Render 不要加 sslmode 这里，加在 URL 即可

# 创建数据库引擎
engine = create_engine(DATABASE_URL, connect_args=connect_args)

# 创建会话工厂
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 声明基类
Base = declarative_base()

# FastAPI 中的依赖注入用法
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

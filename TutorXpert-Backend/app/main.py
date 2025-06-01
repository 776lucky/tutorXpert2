from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routes import student, profile, tutor, task, message, auth   # ✅ 添加 profile 路由导入

# ⛳ 确保模型被正确注册
from app import models

app = FastAPI(
    title="GlowUpTutors API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://tutorxpert-frontend.onrender.com",  # ✅ 渲染环境前端地址
        "http://localhost:5173"                      # ✅ 本地调试地址
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)

# ✅ 注册路由
app.include_router(student.router)
app.include_router(profile.router)    
app.include_router(tutor.router)
app.include_router(task.router)
app.include_router(message.router)
app.include_router(auth.router)


@app.get("/")
def root():
    from app.database import engine
    return {
        "message": "GlowUpTutors backend is running.",
        "db_url": str(engine.url)
    }
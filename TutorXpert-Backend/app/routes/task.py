from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app import models, schemas
from app.database import get_db
from fastapi import status


router = APIRouter(tags=["tasks"])
print("✅ task.py loaded")

# ✅ 地图边界筛选任务列表
@router.get("/tasks/search", response_model=List[schemas.TaskOut])
def search_tasks_by_bounds(
    north: float = Query(...),
    south: float = Query(...),
    east: float = Query(...),
    west: float = Query(...),
    subject: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Task).filter(
        models.Task.lat <= north,
        models.Task.lat >= south,
        models.Task.lng <= east,
        models.Task.lng >= west,
    )

    if subject:
        query = query.filter(models.Task.subject.ilike(f"%{subject}%"))

    return query.all()

# ✅ 根据 task_id 返回任务详情
@router.get("/tasks/{task_id}", response_model=schemas.TaskOut)
def get_task_by_id(task_id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.post("/tasks", response_model=schemas.TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    new_task = models.Task(**task.dict())
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app import models, schemas
from app.database import get_db

router = APIRouter()

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

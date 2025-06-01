from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app import models, schemas
from app.database import get_db
from fastapi import HTTPException
from passlib.context import CryptContext

router = APIRouter(prefix="/tutors", tags=["tutors"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 前端访问 /tutors/search，从地图中筛选当前区域内的 tutor 列表。
# 根据地图边界 + 可选科目，返回 tutor 数据


@router.get("/search", response_model=List[schemas.TutorOut], response_model_by_alias=True)
def search_tutors_by_map(
    north: float = Query(...),
    south: float = Query(...),
    east: float = Query(...),
    west: float = Query(...),
    subject: Optional[str] = None,
    db: Session = Depends(get_db)
):
    print(f"Received bounds: north={north}, south={south}, east={east}, west={west}")
    try:
        query = db.query(models.Profile).join(models.User).filter(
            models.User.role == "tutor",
            models.Profile.lat <= north,
            models.Profile.lat >= south,
            models.Profile.lng <= east,
            models.Profile.lng >= west
        )

        if subject:
            query = query.filter(models.Profile.subjects.ilike(f"%{subject}%"))

        results = query.all()
        print("Fetched tutors:", results)

        return [schemas.TutorOut.model_validate(row) for row in results]

    except Exception as e:
        print("🔥 Tutor search failed:", repr(e))
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/{tutor_id}", response_model=schemas.TutorOut, response_model_by_alias=True)
def get_tutor_by_id(tutor_id: int, db: Session = Depends(get_db)):
    # 查询 Profile 和关联 User（确保是 tutor 身份）
    tutor = db.query(models.Profile).join(models.User).filter(
        models.Profile.user_id == models.User.id,
        models.User.role == "tutor",
        models.Profile.id == tutor_id
    ).first()

    if not tutor:
        raise HTTPException(status_code=404, detail="Tutor not found")

    return schemas.TutorOut.model_validate(tutor)

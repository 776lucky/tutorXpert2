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

@router.post("/login")
def login_tutor(user: schemas.UserLogin, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(
        models.User.email == user.email,
        models.User.role == "tutor"  # 确保是 tutor 身份
    ).first()
    
    if not existing_user or not pwd_context.verify(user.password, existing_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    profile = db.query(models.Profile).filter(models.Profile.user_id == existing_user.id).first()

    return {
        "id": existing_user.id,
        "email": existing_user.email,
        "role": existing_user.role,
        "first_name": profile.first_name if profile else "User"
    }
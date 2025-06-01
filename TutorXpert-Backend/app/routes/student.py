from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app import models, schemas
from app.database import get_db
from app.core.security import verify_password, create_access_token
from app.core.security import hash_password


router = APIRouter(prefix="/students", tags=["students"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/register", response_model=schemas.UserOut)
def register_student(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = hash_password(user.password)
    new_user = models.User(
        email=user.email,
        hashed_password=hashed_pw,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # ✅ 创建完整 profile，使用 user 提交的字段
    new_profile = models.Profile(
        user_id=new_user.id,
        first_name=user.first_name,
        last_name=user.last_name,
        phone_number=user.phone_number,
        address=user.address,
        education_level=user.education_level,
        major=user.major,
        certifications=user.certifications,
        working_with_children_check=user.working_with_children_check,
        subjects=user.subjects,
        has_experience=user.has_experience,
        experience_details=user.experience_details,
        availability=user.availability,
        accepts_short_notice=user.accepts_short_notice
    )
    db.add(new_profile)
    db.commit()

    return new_user

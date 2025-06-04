from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app import models, schemas
from app.database import get_db
from app.core.security import verify_password, create_access_token, hash_password
from sqlalchemy.orm import joinedload
from app.schemas import UserWithProfileOut


router = APIRouter(tags=["auth"])

@router.post("/register", response_model=schemas.UserOut)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
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
        accepts_short_notice=user.accepts_short_notice,
        lat=user.lat,           # ✅ 添加
        lng=user.lng            # ✅ 添加
    )
    db.add(new_profile)
    db.commit()

    return new_user

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = (
        db.query(models.User)
        .options(joinedload(models.User.profile))
        .filter(models.User.email == form_data.username)
        .first()
    )

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    access_token = create_access_token(data={"sub": str(user.id)})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserWithProfileOut.from_orm(user)
    }
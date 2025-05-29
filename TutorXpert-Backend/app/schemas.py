# schemas.py
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

def to_camel(string: str) -> str:
    parts = string.split('_')
    return parts[0] + ''.join(word.capitalize() for word in parts[1:])

class ProfileBase(BaseModel):
    first_name: str
    last_name: str
    phone_number: Optional[str] = None
    address: Optional[str] = None
    education_level: Optional[str] = None
    major: Optional[str] = None
    certifications: Optional[str] = None
    working_with_children_check: Optional[str] = None
    subjects: Optional[str] = None
    has_experience: Optional[bool] = None
    experience_details: Optional[str] = None
    availability: Optional[str] = None
    accepts_short_notice: Optional[bool] = None

# ✅ 创建 ProfileUpdate：全部字段都设置为可选
class ProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None
    education_level: Optional[str] = None
    major: Optional[str] = None
    certifications: Optional[str] = None
    working_with_children_check: Optional[str] = None
    subjects: Optional[str] = None
    has_experience: Optional[bool] = None
    experience_details: Optional[str] = None
    availability: Optional[str] = None
    accepts_short_notice: Optional[bool] = None

class ProfileCreate(ProfileBase):
    pass

class ProfileOut(ProfileCreate):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class UserCreate(ProfileBase):
    email: EmailStr
    password: str
    role: str = "student"

class UserOut(BaseModel):
    id: int
    email: EmailStr
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TaskOut(BaseModel):
    id: int
    title: str
    subject: Optional[str] = None
    address: Optional[str] = None
    lat: float
    lng: float
    description: Optional[str] = None
    budget: Optional[str] = None
    deadline: Optional[str] = None
    posted_by: Optional[str] = None
    posted_date: Optional[str] = None
    status: Optional[str] = None

    class Config:
        from_attributes = True
        populate_by_name = True



class TutorOut(BaseModel):
    id: int
    first_name: str = Field(..., alias="firstName")
    last_name: str = Field(..., alias="lastName")
    title: Optional[str] = None
    bio: Optional[str] = None
    experience: Optional[str] = None
    hourly_rate: Optional[float] = Field(None, alias="hourlyRate")
    rating: Optional[float] = None
    subjects: Optional[str] = None
    address: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    name: Optional[str] = Field(None, alias="name")  # ✅ 可选字段，避免初始报错

    class Config:
        from_attributes = True
        populate_by_name = True

    @classmethod
    def model_validate(cls, obj):
        base = super().model_validate(obj)
        base.name = f"{base.first_name} {base.last_name}"  # ✅ 安全拼接
        return base
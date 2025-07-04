from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime
from typing import Optional, List, Literal


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
    hourly_rate: Optional[int] = None     # ✅ 添加这一行

# ✅ 创建 ProfileUpdate：全部字段都设置为可选
class ProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None
    education_level: Optional[str] = None
    major: Optional[str] = None
    certifications: Optional[str] = None
    working_with_children_check: Optional[bool] = None
    subjects: Optional[str] = None
    has_experience: Optional[bool] = None
    experience_details: Optional[str] = None
    availability: Optional[str] = None
    accepts_short_notice: Optional[bool] = None
    hourly_rate: Optional[int] = None

class ProfileCreate(ProfileBase):
    pass

class ProfileOut(BaseModel):
    first_name: Optional[str]
    last_name: Optional[str]
    avatar_url: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None
    education_level: Optional[str] = None
    major: Optional[str] = None
    certifications: Optional[str] = None
    working_with_children_check: Optional[str] = None
    has_experience: Optional[bool] = None
    experience_details: Optional[str] = None
    availability: Optional[str] = None
    accepts_short_notice: Optional[bool] = None
    hourly_rate: Optional[int] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    subjects: List[str] = []   # ✅ 转换为 list

    class Config:
        from_attributes = True

    @validator("subjects", pre=True)
    def parse_subjects(cls, v):
        if isinstance(v, str):
            return [s.strip() for s in v.split(",")]
        return v or []


class UserWithProfileOut(BaseModel):
    id: int
    email: EmailStr
    role: str
    profile: Optional[ProfileOut]

    class Config:
        from_attributes = True



class UserCreate(ProfileBase):
    email: EmailStr
    password: str
    role: str = "student"
    lat: Optional[float]   # ✅ 新增
    lng: Optional[float]   # ✅ 新增


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
    posted_date: Optional[datetime] = None
    status: Optional[str] = None
    accepted_tutor_id: Optional[int] = None
    student: Optional[UserWithProfileOut] = None


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
    subjects: Optional[List[str]] = None
    address: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    name: Optional[str] = Field(None, alias="name")

    class Config:
        from_attributes = True
        populate_by_name = True

    @validator("subjects", pre=True)
    def split_subjects(cls, v):
        if isinstance(v, str):
            return [s.strip() for s in v.split(",")]
        return v

    @classmethod
    def model_validate(cls, obj):
        base = super().model_validate(obj)
        base.name = f"{base.first_name} {base.last_name}"
        return base



class TaskCreate(BaseModel):
    title: str
    subject: Optional[str] = None
    address: Optional[str] = None
    lat: float
    lng: float
    description: Optional[str] = None
    budget: Optional[str] = None
    deadline: Optional[str] = None


class MessageCreate(BaseModel):
    sender_id: int
    receiver_id: int
    text: str

class MessageOut(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    text: str
    timestamp: datetime

    class Config:
        from_attributes: True

class ConversationOut(BaseModel):
    id: int
    name: str
    last_message: Optional[str]
    timestamp: Optional[datetime]
    unread: Optional[int] = 0

    class Config:
        from_attributes: True

class TaskApplicationCreate(BaseModel):
    task_id: int
    tutor_id: int
    message: Optional[str] = None
    bid_amount: Optional[float] = None  # 新增


class TaskApplicationOut(BaseModel):
    id: int
    task_id: int
    tutor_id: int
    applied_at: datetime
    status: str
    bid_amount: Optional[float]

    class Config:
        from_attributes: True


class TaskApplicationSimple(BaseModel):
    task_id: int
    status: str

    class Config:
        from_attributes: True


class TaskWithApplicationStatus(BaseModel):
    id: int
    title: str
    subject: Optional[str]
    budget: Optional[str]
    deadline: Optional[str]
    status: str

    class Config:
        from_attributes: True


# For tutor creating available slot
class AvailableSlotCreate(BaseModel):
    tutor_id: int
    start_time: datetime
    end_time: datetime
    subject: str

# For response
class AvailableSlotOut(BaseModel):
    id: int
    tutor_id: int
    start_time: datetime
    end_time: datetime
    subject: str                     # ✅ 补上
    is_booked: bool                  # ✅ 补上

    class Config:
        from_attributes = True


class AppointmentCreate(BaseModel):
    student_id: int
    tutor_id: int
    slot_id: int
    message: Optional[str] = None

class AppointmentOut(BaseModel):
    id: int
    student_id: int
    tutor_id: int
    slot_id: int
    message: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class AppointmentStatusUpdate(BaseModel):
    status: Literal["accepted", "rejected"]




class ApplicationDecision(BaseModel):
    decision: Literal["accept", "reject"]


class ProfileMini(BaseModel):
    first_name: Optional[str]
    last_name: Optional[str]
    hourly_rate: Optional[int]
    subjects: Optional[List[str]]
    address: Optional[str]

    class Config:
        from_attributes = True

    @validator("subjects", pre=True)
    def split_subjects(cls, v):
        if isinstance(v, str):
            return [s.strip() for s in v.split(",")]
        return v or []

class TutorBasicInfo(BaseModel):
    id: int
    profile: Optional[ProfileMini]

    class Config:
        from_attributes = True

class TaskApplicationWithTutorOut(BaseModel):
    id: int
    task_id: int
    tutor: TutorBasicInfo
    message: Optional[str]
    applied_at: datetime
    status: str

    class Config:
        from_attributes = True


class AppointmentWithSlotOut(BaseModel):
    id: int
    student_id: int
    tutor_id: int
    slot: AvailableSlotOut  # ✅ 替换 slot_id 为完整 slot 对象
    message: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

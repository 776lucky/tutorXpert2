from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base
from sqlalchemy import Float
from sqlalchemy.sql import func


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    profile = relationship("Profile", back_populates="user", uselist=False)

    # ✅ 指定外键，避免歧义
    tasks = relationship("Task", back_populates="user", foreign_keys="[Task.user_id]")
    available_slots = relationship("AvailableSlot", back_populates="tutor")

class Profile(Base):
    __tablename__ = "profile"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    phone_number = Column(String(20), nullable=True)
    address = Column(Text, nullable=True)
    education_level = Column(String(50), nullable=True)
    major = Column(Text, nullable=True)
    certifications = Column(Text, nullable=True)
    working_with_children_check = Column(String(50), nullable=True)
    subjects = Column(Text, nullable=True)
    has_experience = Column(Boolean, nullable=True)
    experience_details = Column(Text, nullable=True)
    availability = Column(Text, nullable=True)
    accepts_short_notice = Column(Boolean, nullable=True)
    lat = Column(Float, nullable=False, default=0.0)
    lng = Column(Float, nullable=False, default=0.0)
    hourly_rate = Column(Integer, nullable=True)
    rating = Column(Float, nullable=True)
    title = Column(String(100), nullable=True)
    bio = Column(Text, nullable=True)
    user = relationship("User", back_populates="profile")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    subject = Column(String)
    description = Column(String)
    address = Column(String)
    lat = Column(Float)
    lng = Column(Float)
    budget = Column(String)
    deadline = Column(String)
    status = Column(String, default="Open")  # ✅ 建议加 default
    posted_by = Column(String)
    posted_date = Column(DateTime(timezone=True), server_default=func.now())  # ✅ 添加
    user_id = Column(Integer, ForeignKey("users.id"))  # ✅ 添加这一行
    accepted_tutor_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # ✅ 新增
    user = relationship("User", back_populates="tasks", foreign_keys=[user_id])

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    text = Column(Text, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    sender = relationship("User", foreign_keys=[sender_id])
    receiver = relationship("User", foreign_keys=[receiver_id])



class TaskApplication(Base):
    __tablename__ = "task_applications"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False)
    tutor_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    applied_at = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, default="pending")

class AvailableSlot(Base):
    __tablename__ = "available_slots"

    id = Column(Integer, primary_key=True, index=True)
    tutor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    subject = Column(String(100), nullable=False)  # ✅ 新增字段
    is_booked = Column(Boolean, default=False)

    tutor = relationship("User", back_populates="available_slots")


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    tutor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    slot_id = Column(Integer, ForeignKey("available_slots.id"), nullable=False)
    message = Column(Text, nullable=True)
    status = Column(String(20), default="pending")  # pending / accepted / rejected
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    slot = relationship("AvailableSlot")
    student = relationship("User", foreign_keys=[student_id])
    tutor = relationship("User", foreign_keys=[tutor_id])


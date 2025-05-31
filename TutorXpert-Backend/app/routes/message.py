from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from typing import List


router = APIRouter(prefix="/messages", tags=["Messages"])

@router.post("/", response_model=schemas.MessageOut)
def send_message(msg: schemas.MessageCreate, db: Session = Depends(get_db)):
    db_msg = models.Message(**msg.dict())
    db.add(db_msg)
    db.commit()
    db.refresh(db_msg)
    return db_msg

@router.get("/history/{user1_id}/{user2_id}", response_model=list[schemas.MessageOut])
def get_conversation(user1_id: int, user2_id: int, db: Session = Depends(get_db)):
    return db.query(models.Message).filter(
        ((models.Message.sender_id == user1_id) & (models.Message.receiver_id == user2_id)) |
        ((models.Message.sender_id == user2_id) & (models.Message.receiver_id == user1_id))
    ).order_by(models.Message.timestamp).all()


@router.get("/conversations/{user_id}", response_model=List[schemas.ConversationOut])
def get_conversations(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 获取所有和该用户有过消息往来的对话人
    messages = db.query(models.Message).filter(
        (models.Message.sender_id == user_id) | (models.Message.receiver_id == user_id)
    ).order_by(models.Message.timestamp.desc()).all()

    seen_ids = set()
    conversations = []
    for msg in messages:
        other_id = msg.receiver_id if msg.sender_id == user_id else msg.sender_id
        if other_id in seen_ids:
            continue
        seen_ids.add(other_id)
        other_user = db.query(models.User).filter(models.User.id == other_id).first()
        profile = db.query(models.Profile).filter(models.Profile.user_id == other_id).first()
        conversations.append({
            "id": other_id,
            "name": f"{profile.first_name} {profile.last_name}" if profile else other_user.email,
            "last_message": msg.text,
            "timestamp": msg.timestamp.isoformat(),
            "unread": 0  # 可选：你也可以计算 unread 数
        })

    return conversations

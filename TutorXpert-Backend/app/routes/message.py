from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

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

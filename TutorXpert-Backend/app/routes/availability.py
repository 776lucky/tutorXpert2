from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from typing import List, Optional


router = APIRouter(prefix="/availability", tags=["availability"])

@router.post("/", response_model=schemas.AvailableSlotOut)
def create_slot(slot: schemas.AvailableSlotCreate, db: Session = Depends(get_db)):
    # 可加重复时间段检查
    new_slot = models.AvailableSlot(**slot.dict())
    db.add(new_slot)
    db.commit()
    db.refresh(new_slot)
    return new_slot

@router.get("/tutor/{tutor_id}", response_model=List[schemas.AvailableSlotOut])
def get_slots(tutor_id: int, db: Session = Depends(get_db)):
    return db.query(models.AvailableSlot).filter_by(tutor_id=tutor_id).all()

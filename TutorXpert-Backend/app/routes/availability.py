from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from typing import List
from pydantic import BaseModel




router = APIRouter(prefix="/availability", tags=["availability"])

SLOT_DURATION_MINUTES = 15  # 可改为 30 代表半小时一段

@router.post("/", response_model=List[schemas.AvailableSlotOut])
def create_slots(slot: schemas.AvailableSlotCreate, db: Session = Depends(get_db)):
    if slot.start_time >= slot.end_time:
        raise HTTPException(status_code=400, detail="Start time must be before end time")

    slots = []
    current = slot.start_time
    while current + timedelta(minutes=SLOT_DURATION_MINUTES) <= slot.end_time:
        new_slot = models.AvailableSlot(
            tutor_id=slot.tutor_id,
            start_time=current,
            end_time=current + timedelta(minutes=SLOT_DURATION_MINUTES),
            subject=slot.subject
        )
        db.add(new_slot)
        slots.append(new_slot)
        current += timedelta(minutes=SLOT_DURATION_MINUTES)

    db.commit()
    for s in slots:
        db.refresh(s)
    return slots

@router.get("/tutor/{tutor_id}", response_model=List[schemas.AvailableSlotOut])
def get_slots(tutor_id: int, db: Session = Depends(get_db)):
    return db.query(models.AvailableSlot).filter_by(tutor_id=tutor_id).all()

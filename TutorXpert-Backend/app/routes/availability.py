from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas
from sqlalchemy.sql import exists
from fastapi import HTTPException, status
from app import database



router = APIRouter(prefix="/availability", tags=["availability"])

SLOT_DURATION_MINUTES = 15  # 每个 slot 持续 15 分钟

@router.post("/", response_model=List[schemas.AvailableSlotOut])
def create_slots(slots: List[schemas.AvailableSlotCreate], db: Session = Depends(get_db)):
    created = []

    for slot in slots:
        if slot.start_time >= slot.end_time:
            raise HTTPException(status_code=400, detail="Start time must be before end time")

        new_slot = models.AvailableSlot(
            tutor_id=slot.tutor_id,
            start_time=slot.start_time,
            end_time=slot.end_time,
            subject=slot.subject
        )
        db.add(new_slot)
        created.append(new_slot)

    db.commit()
    for s in created:
        db.refresh(s)

    return created

# 获取某个 tutor 的所有可用时间
@router.get("/tutor/{tutor_id}", response_model=list[schemas.AvailableSlotOut])
def get_tutor_slots(tutor_id: int, db: Session = Depends(get_db)):
    slots = db.query(models.AvailableSlot).filter(models.AvailableSlot.tutor_id == tutor_id).all()
    result = []

    for slot in slots:
        is_booked = db.query(
            exists().where(models.Appointment.slot_id == slot.id)
        ).scalar()

        result.append(schemas.AvailableSlotOut(
            id=slot.id,
            tutor_id=slot.tutor_id,
            start_time=slot.start_time,
            end_time=slot.end_time,
            subject=slot.subject,
            is_booked=is_booked
        ))

    return result


@router.delete("/{slot_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_slot(slot_id: int, db: Session = Depends(get_db)):
    slot = db.query(models.AvailableSlot).filter(models.AvailableSlot.id == slot_id).first()
    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found")

    # 可选：阻止删除已被预约的 slot（建议加上，防止误删）
    is_booked = db.query(
        exists().where(models.Appointment.slot_id == slot.id)
    ).scalar()
    if is_booked:
        raise HTTPException(status_code=400, detail="Cannot delete a booked slot")

    db.delete(slot)
    db.commit()
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from typing import List, Optional


router = APIRouter(prefix="/appointments", tags=["appointments"])

@router.post("/", response_model=schemas.AppointmentOut)
def create_appointment(app_req: schemas.AppointmentCreate, db: Session = Depends(get_db)):
    # 检查 slot 是否存在且未被预约
    slot = db.query(models.AvailableSlot).filter_by(id=app_req.slot_id).first()
    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found")

    existing = db.query(models.Appointment).filter_by(slot_id=app_req.slot_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slot already booked")

    appointment = models.Appointment(**app_req.dict())
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment


@router.patch("/{appointment_id}/status")
def update_appointment_status(
    appointment_id: int,
    payload: schemas.AppointmentStatusUpdate,
    db: Session = Depends(get_db)
):
    appointment = db.query(models.Appointment).filter_by(id=appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    if appointment.status != "pending":
        raise HTTPException(status_code=400, detail="Cannot update status once finalized")

    appointment.status = payload.status
    db.commit()
    db.refresh(appointment)
    return {"message": f"Appointment status updated to {payload.status}"}


@router.get("/tutor/{tutor_id}", response_model=List[schemas.AppointmentWithSlotOut])
def get_appointments_by_tutor(tutor_id: int, db: Session = Depends(get_db)):
    appointments = db.query(models.Appointment).filter(models.Appointment.tutor_id == tutor_id).all()
    for a in appointments:
        _ = a.slot  # 确保 ORM 正确加载 slot
    return appointments

@router.post("/{appointment_id}/accept")
def accept_appointment(appointment_id: int, db: Session = Depends(get_db)):
    appt = db.query(models.Appointment).filter_by(id=appointment_id).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    appt.status = "accepted"
    appt.slot.is_booked = True
    db.commit()
    return {"detail": "Appointment accepted"}


@router.post("/{appointment_id}/reject")
def reject_appointment(appointment_id: int, db: Session = Depends(get_db)):
    appt = db.query(models.Appointment).filter_by(id=appointment_id).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    appt.status = "rejected"
    db.commit()
    return {"detail": "Appointment rejected"}
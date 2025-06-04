from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db
import requests

from fastapi.encoders import jsonable_encoder


router = APIRouter(prefix="/profiles", tags=["profiles"])


def get_lat_lng_from_address(address: str):
    url = "https://nominatim.openstreetmap.org/search"
    params = {"q": address, "format": "json"}
    headers = {"User-Agent": "TutorPlatform/1.0"}  # 必须加 UA，否则被拒绝
    try:
        res = requests.get(url, params=params, headers=headers)
        data = res.json()
        if data:
            return float(data[0]["lat"]), float(data[0]["lon"])
    except Exception as e:
        print("地址解析失败:", e)
    return None, None


@router.get("/{user_id}", response_model=schemas.ProfileOut)
def get_profile(user_id: int, db: Session = Depends(get_db)):
    profile = db.query(models.Profile).filter(models.Profile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return schemas.ProfileOut.model_validate(profile)


@router.put("/{user_id}", response_model=schemas.ProfileOut)
def update_profile(user_id: int, updated: schemas.ProfileUpdate, db: Session = Depends(get_db)):
    profile = db.query(models.Profile).filter(models.Profile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    for field, value in updated.dict(exclude_unset=True).items():
        setattr(profile, field, value)

    # ✅ 如果地址有更新，则获取经纬度并写入数据库
    if updated.address:
        lat, lng = get_lat_lng_from_address(updated.address)
        if lat and lng:
            profile.lat = lat
            profile.lng = lng

    db.commit()
    db.refresh(profile)
    return profile

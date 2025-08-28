from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.user_settings import UserSettings, UserSettingsUpdate, UserSettingsResponse
from app.core.firebase import get_db
from app.core.security import get_current_user_uid
from app.services.user_settings import get_user_settings, create_or_update_user_settings
from firebase_admin import firestore

router = APIRouter()

@router.get("/me/", response_model=UserSettingsResponse)
async def read_user_settings(
    uid: str = Depends(get_current_user_uid),
    db: firestore.Client = Depends(get_db)
):
    settings = await get_user_settings(uid, db)
    if not settings:
        raise HTTPException(status_code=404, detail="ユーザー設定が見つかりません")
    return settings

@router.put("/me/", response_model=UserSettingsResponse)
async def update_user_settings(
    data: UserSettingsUpdate,
    uid: str = Depends(get_current_user_uid),
    db: firestore.Client = Depends(get_db)
):
    settings = await create_or_update_user_settings(uid, data, db)
    return settings

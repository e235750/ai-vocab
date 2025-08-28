from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.users import UserProfile, UserProfileUpdate, UserProfileResponse
from app.core.firebase import get_db
from app.core.security import get_current_user_uid
from app.services.users import get_user_profile, create_or_update_user_profile
from firebase_admin import firestore

router = APIRouter()

@router.get("/me/", response_model=UserProfileResponse)
async def read_user_profile(
    uid: str = Depends(get_current_user_uid),
    db: firestore.Client = Depends(get_db)
):
    user = await get_user_profile(uid, db)
    if not user:
        raise HTTPException(status_code=404, detail="ユーザーが見つかりません")
    return user

@router.put("/me/", response_model=UserProfileResponse)
async def update_user_profile(
    data: UserProfileUpdate,
    uid: str = Depends(get_current_user_uid),
    db: firestore.Client = Depends(get_db)
):
    user = await create_or_update_user_profile(uid, data, db)
    return user

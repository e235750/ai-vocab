from firebase_admin import firestore
from datetime import datetime
from typing import Optional
from app.schemas.user_settings import UserSettings, UserSettingsUpdate

async def get_user_settings(uid: str, db: firestore.Client) -> Optional[UserSettings]:
    doc_ref = db.collection('userSettings').document(uid)
    doc = doc_ref.get()
    if doc.exists:
        return UserSettings(**doc.to_dict())
    return None

async def create_or_update_user_settings(uid: str, data: UserSettingsUpdate, db: firestore.Client) -> UserSettings:
    doc_ref = db.collection('userSettings').document(uid)
    now = datetime.now()
    update_data = data.dict(exclude_unset=True)
    update_data['updated_at'] = now
    doc_ref.set({**update_data, 'uid': uid, 'updated_at': now}, merge=True)
    doc = doc_ref.get()
    return UserSettings(**doc.to_dict())

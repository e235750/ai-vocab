from firebase_admin import firestore
from datetime import datetime
from typing import Optional
from app.schemas.users import UserProfile, UserProfileUpdate

async def get_user_profile(uid: str, db: firestore.Client) -> Optional[UserProfile]:
    doc_ref = db.collection('users').document(uid)
    doc = doc_ref.get()
    if doc.exists:
        return UserProfile(**doc.to_dict())
    return None

async def create_or_update_user_profile(uid: str, data: UserProfileUpdate, db: firestore.Client) -> UserProfile:
    doc_ref = db.collection('users').document(uid)
    now = datetime.now()
    update_data = data.dict(exclude_unset=True)
    update_data['updated_at'] = now
    doc_ref.set({**update_data, 'uid': uid, 'updated_at': now}, merge=True)
    doc = doc_ref.get()
    return UserProfile(**doc.to_dict())

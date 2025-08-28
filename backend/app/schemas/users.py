from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class UserProfile(BaseModel):
    """
    ユーザープロフィール情報のスキーマ
    """
    uid: str = Field(..., description="FirebaseのユーザーID")
    display_name: Optional[str] = Field(None, description="表示名")
    photo_url: Optional[str] = Field(None, description="プロフィール画像URL")
    email: Optional[str] = Field(None, description="メールアドレス")
    created_at: Optional[datetime] = Field(None, description="作成日時")
    updated_at: Optional[datetime] = Field(None, description="更新日時")

    class Config:
        json_schema_extra = {
            "example": {
                "uid": "user_abc123",
                "display_name": "山田太郎",
                "photo_url": "https://example.com/photo.jpg",
                "email": "taro@example.com",
                "created_at": "2024-06-01T12:00:00",
                "updated_at": "2024-06-01T12:00:00"
            }
        }

class UserProfileUpdate(BaseModel):
    display_name: Optional[str] = None
    photo_url: Optional[str] = None
    email: Optional[str] = None

class UserProfileResponse(UserProfile):
    pass

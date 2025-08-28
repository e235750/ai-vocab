from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class UserSettings(BaseModel):
    """
    ユーザー個人設定のスキーマ（全て必須・初期値あり）
    """
    uid: str = Field(..., description="FirebaseのユーザーID")
    flip_animation: bool = Field(False, description="フリップアニメーションの有効/無効")
    simple_card_mode: bool = Field(False, description="単語カードの簡易表示モード")
    updated_at: datetime = Field(default_factory=datetime.utcnow, description="更新日時")

    class Config:
        json_schema_extra = {
            "example": {
                "uid": "user_abc123",
                "flip_animation": True,
                "simple_card_mode": False,
                "updated_at": "2024-06-01T12:00:00"
            }
        }

class UserSettingsUpdate(BaseModel):
    flip_animation: Optional[bool] = None
    simple_card_mode: Optional[bool] = None

class UserSettingsResponse(UserSettings):
    pass

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class BookmarkBase(BaseModel):
    card_id: str


class BookmarkCreate(BookmarkBase):
    pass


class BookmarkResponse(BookmarkBase):
    id: str
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True


class BookmarkExistsResponse(BaseModel):
    is_bookmarked: bool

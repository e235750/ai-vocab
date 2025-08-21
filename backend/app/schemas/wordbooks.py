from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class WordBookCreate(BaseModel):
    """
    単語帳作成のスキーマ
    """
    name: str = Field(..., description="単語帳の名前")
    description: Optional[str] = Field(None, description="単語帳の説明")
    is_public: bool = Field(False, description="単語帳が公開されているかどうか")

    class Config:
        json_schema_extra = {
            "example": {
                "name": "英単語帳",
                "description": "英語の単語を学ぶための単語帳",
                "is_public": True
            }
        }

class WordBookUpdate(BaseModel):
    """
    単語帳更新のスキーマ
    """
    name: Optional[str] = Field(None, description="単語帳の名前")
    description: Optional[str] = Field(None, description="単語帳の説明") 
    is_public: Optional[bool] = Field(None, description="単語帳が公開されているかどうか")

    class Config:
        json_schema_extra = {
            "example": {
                "name": "英単語帳（更新版）",
                "description": "英語の単語を学ぶための単語帳",
                "is_public": False
            }
        }

class WordBook(BaseModel):
    """
    単語帳のスキーマ
    """
    name: str = Field(..., description="単語帳の名前")
    is_public: bool = Field(..., description="単語帳が公開されているかどうか")
    num_words: int = Field(..., description="単語帳に含まれる単語の数")
    description: Optional[str] = Field(None, description="単語帳の説明")
    user_name: Optional[str] = Field(None, description="ユーザー名")

    class Config:
        json_schema_extra = {
            "example": {
                "name": "英単語帳",
                "user_name": "ユーザー名",
                "is_public": True,
                "num_words": 50,
                "description": "英語の単語を学ぶための単語帳"
            }
        }

class WordBookResponse(WordBook):
    """
    単語帳のレスポンススキーマ
    """
    id: str = Field(..., description="単語帳のID")
    name: str = Field(..., description="単語帳の名前")
    is_public: bool = Field(..., description="単語帳が公開されているかどうか")
    num_words: int = Field(..., description="単語帳に含まれる単語の数")
    description: Optional[str] = Field(None, description="単語帳の説明")
    user_name: Optional[str] = Field(None, description="ユーザー名")
    created_at: datetime = Field(..., description="作成日時")
    updated_at: datetime = Field(..., description="更新日時")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "wordbook123",
                "name": "英単語帳",
                "user_name": "ユーザー名",
                "is_public": True,
                "num_words": 50,
                "description": "英語の単語を学ぶための単語帳",
                "created_at": datetime(2023, 10, 1, 12, 0, 0),
                "updated_at": datetime(2023, 10, 1, 12, 0, 0)
            }
        }

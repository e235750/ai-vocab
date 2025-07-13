from pydantic import BaseModel, Field
from typing import Optional

class WordBook(BaseModel):
    """
    単語帳のスキーマ
    """
    name: str = Field(..., description="単語帳の名前")
    owner_id: str = Field(..., description="所有者のユーザID")
    is_public: bool = Field(..., description="単語帳が公開されているかどうか")
    num_words: int = Field(..., description="単語帳に含まれる単語の数")
    description: Optional[str] = Field(None, description="単語帳の説明")

    class Config:
        json_schema_extra = {
            "example": {
                "name": "英単語帳",
                "owner_id": "user123",
                "is_public": True,
                "num_words": 50,
                "description": "英語の単語を学ぶための単語帳"
            }
        }

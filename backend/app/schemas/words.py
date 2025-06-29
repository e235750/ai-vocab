from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class WordRequest(BaseModel):
    """
    単語作成時のリクエストボディのスキーマ
    """
    english: str = Field(..., description="英単語")
    japanese: str = Field(..., description="日本語訳")
    synonyms: Optional[List[str]] = Field(None, description="類義語のリスト")
    example_sentences: Optional[List[str]] = Field(None, description="例文のリスト")
    part_of_speech: Optional[str] = Field(None, description="品詞")

    class Config:
        json_schema_extra = {
            "example": {
                "english": "example",
                "japanese": "例",
                "synonyms": ["sample", "instance"],
                "example_sentences": [
                    "This is an example sentence.",
                    "Here is another example."
                ],
                "part_of_speech": "noun"
            }
        }

class WordResponse(BaseModel):
    """
    単語作成時のレスポンスボディのスキーマ
    """
    id: str = Field(..., description="単語カードの一意のID (FirestoreのドキュメントID)")
    english: str = Field(..., description="英単語")
    japanese: str = Field(..., description="日本語訳")
    synonyms: Optional[List[str]] = Field(None, description="類義語のリスト")
    example_sentences: Optional[List[str]] = Field(None, description="例文のリスト")
    part_of_speech: Optional[str] = Field(None, description="品詞")
    created_at: datetime = Field(..., description="作成日時")
    updated_at: datetime = Field(..., description="最終更新日時")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "1234567890",
                "english": "example",
                "japanese": "例",
                "synonyms": ["sample", "instance"],
                "example_sentences": [
                    "This is an example sentence.",
                    "Here is another example."
                ],
                "part_of_speech": "noun",
                "created_at": "2023-10-01T12:00:00Z",
                "updated_at": "2023-10-01T12:00:00Z"
            }
        }

class WordsInfoRequest(BaseModel):
    """
    単語情報取得リクエストのスキーマ
    """
    word: str = Field(..., description="情報を取得したい英単語")

    class Config:
        json_schema_extra = {
            "example": {
                "word": "example"
            }
        }
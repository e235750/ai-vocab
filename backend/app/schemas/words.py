from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ExampleSentence(BaseModel):
    """
    例文のスキーマ
    """
    english: str
    japanese: str

class WordRequest(BaseModel):
    """
    単語作成時のリクエストボディのスキーマ
    """
    english: str = Field(..., description="英単語")
    japanese: Optional[List[str]] = Field(..., description="日本語訳")
    synonyms: Optional[List[str]] = Field(None, description="類義語のリスト")
    example_sentences: Optional[List[ExampleSentence]] = Field(None, description="例文のリスト")
    part_of_speech: Optional[List[str]] = Field(None, description="品詞")

    class Config:
        json_schema_extra = {
            "example": {
                "english": "example",
                "japanese": ["例", "サンプル"],
                "synonyms": ["sample", "instance"],
                "example_sentences": [
                    {
                        "english": "The information was very helpful.",
                        "japanese": "その情報は非常に役立ちました。"
                    },
                    {
                        "english": "I need more information.",
                        "japanese": "もっと情報が必要です。"
                    }
                ],
                "part_of_speech": ["noun-名詞"]
            }
        }

class WordResponse(BaseModel):
    """
    単語作成時のレスポンスボディのスキーマ
    """
    english: str = Field(..., description="英単語")
    japanese: List[str] = Field(..., description="日本語訳のリスト")
    synonyms: Optional[List[str]] = Field(None, description="類義語のリスト")
    example_sentences: Optional[List[ExampleSentence]] = Field(None, description="例文オブジェクトのリスト")
    part_of_speech: Optional[List[str]] = Field(None, description="品詞")

    class Config:
        json_schema_extra = {
            "example": {
                "english": "example",
                "japanese": ["例", "見本"],
                "synonyms": ["sample", "instance"],
                "example_sentences": [
                    {
                        "english": "This is an example sentence.",
                        "japanese": "これは例文です。"
                    },
                    {
                        "english": "Here is another example.",
                        "japanese": "こちらがもう一つの例です。"
                    }
                ],
                "part_of_speech": ["noun-名詞"]
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
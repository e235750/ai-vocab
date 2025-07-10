from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# -------------------------------------------------
# 依存されるクラスを先に定義
# -------------------------------------------------

class ExampleSentence(BaseModel):
    """
    例文のスキーマ
    """
    english: str
    japanese: str

class Definition(BaseModel):
    """
    品詞とそれに対応する日本語訳を格納するスキーマ
    """
    part_of_speech: str = Field(..., description="品詞 (例: 'noun-名詞')")
    japanese: List[str] = Field(..., description="その品詞に対応する日本語訳のリスト")

class DictionaryDefinition(BaseModel):
    """
    辞書データの定義部分のスキーマ
    """
    pos: str = Field(..., description="品詞")
    def_text: str = Field(..., alias="def", description="英語の定義文")

# -------------------------------------------------
# メインのクラス定義
# -------------------------------------------------

class WordRequest(BaseModel):
    """
    単語作成時のリクエストボディのスキーマ（修正案）
    """
    english: str
    definitions: List[Definition] = Field(..., description="品詞と日本語訳のペアのリスト")
    synonyms: Optional[List[str]] = Field(None, description="類義語のリスト")
    example_sentences: Optional[List[ExampleSentence]] = Field(None, description="例文のリスト")

    class Config:
        json_schema_extra = {
            "example": {
                "english": "example",
                "definitions": [
                    {
                        "part_of_speech": "noun-名詞",
                        "japanese": ["例", "手本", "見本"]
                    },
                    {
                        "part_of_speech": "verb-動詞",
                        "japanese": ["例証する"]
                    }
                ],
                "synonyms": ["sample", "instance", "model"],
                "example_sentences": [
                    {
                        "english": "This is an example sentence.",
                        "japanese": "これは例文です。"
                    }
                ]
            }
        }

class WordResponse(BaseModel):
    """
    単語作成時のレスポンスボディのスキーマ（更新版）
    """
    english: str
    definitions: List[Definition] = Field(..., description="品詞と日本語訳のペアのリスト")
    synonyms: Optional[List[str]] = Field(None, description="類義語のリスト")
    example_sentences: Optional[List[ExampleSentence]] = Field(None, description="例文オブジェクトのリスト")

    class Config:
        json_schema_extra = {
            "example": {
                "english": "example",
                "definitions": [
                    {
                        "part_of_speech": "noun-名詞",
                        "japanese": ["例", "手本", "見本"]
                    },
                    {
                        "part_of_speech": "verb-動詞",
                        "japanese": ["例証する"]
                    }
                ],
                "synonyms": ["sample", "instance", "model"],
                "example_sentences": [
                    {
                        "english": "This is an example sentence.",
                        "japanese": "これは例文です。"
                    },
                    {
                        "english": "Let me give you another example.",
                        "japanese": "もう一つ例を挙げさせてください。"
                    }
                ]
            }
        }

class WordsInfoRequest(BaseModel):
    """
    単語情報取得リクエストのスキーマ
    """
    word: str

    class Config:
        json_schema_extra = {
            "example": {
                "word": "example"
            }
        }

class DictionaryData(BaseModel):
    """
    辞書データのスキーマ
    """
    word: str
    part_of_speech: Optional[List[str]] = Field(None, description="品詞のリスト")
    definitions: Optional[List[DictionaryDefinition]] = Field(None, description="定義のリスト")
    translations: Optional[dict[str, List[str]]] = Field(None, description="翻訳のリスト")
    raw_examples: Optional[List[str]] = Field(None, description="生の例文のリスト")
    synonyms: Optional[List[str]] = Field(None, description="類義語のリスト")
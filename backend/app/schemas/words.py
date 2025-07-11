from pydantic import BaseModel, Field
from typing import Optional, List

class ExampleSentence(BaseModel):
    """
    例文のスキーマ
    """
    english: str
    japanese: str

class Definition(BaseModel):
    """
    品詞とそれに対応する日本語訳を格納するスキーマ (内部向け/生成用)
    """
    part_of_speech: str = Field(..., description="品詞 (例: 'noun-名詞')")
    japanese: List[str] = Field(..., description="その品詞に対応する日本語訳のリスト")

class DictionaryDefinition(BaseModel):
    """
    辞書データの定義部分のスキーマ (Firestoreから取得するデータ用)
    """
    pos: str = Field(..., description="品詞")
    def_text: str = Field(..., alias="def", description="英語の定義文")

class PhoneticInfo(BaseModel): # Phonetics と Phonetic を統一し、より適切な名前に変更
    """
    発音記号と音声データのスキーマ
    FreeDictionaryAPIの 'phonetics' リスト内の個々のオブジェクトに対応
    """
    text: Optional[str] = Field(None, description="国際音声記号 (IPA) 表記")
    audio: Optional[str] = Field(None, description="音声データのURL")
    sourceUrl: Optional[str] = Field(None, description="音声データのソースURL (FreeDictionaryAPI固有)")
    # sourceUrl は FreeDictionaryAPI の出力にあるため残す

# --- FreeDictionaryAPIのレスポンススキーマ ---

class MeaningItem(BaseModel): # DefinitionItem を MeaningItem に変更し、より明確に
    """
    FreeDictionaryAPIの 'meanings' -> 'definitions' 内の個々の定義項目
    """
    definition: str
    synonyms: List[str] = [] # デフォルトを空リストに設定
    antonyms: List[str] = [] # デフォルトを空リストに設定

class Meaning(BaseModel):
    """
    FreeDictionaryAPIの 'meanings' リスト内の個々の意味情報
    """
    partOfSpeech: str
    definitions: List[MeaningItem]
    synonyms: List[str] = [] # デフォルトを空リストに設定
    antonyms: List[str] = [] # デフォルトを空リストに設定

class License(BaseModel):
    """
    ライセンス情報のスキーマ (FreeDictionaryAPI用)
    """
    name: str
    url: str

class FDAData(BaseModel):
    """
    FreeDictionaryAPIから取得した単語データ全体のスキーマ
    """
    word: str
    phonetic: Optional[str] = None # 主要な発音記号（テキスト）
    phonetics: List[PhoneticInfo] = [] # 複数の発音情報（音声URLを含む）
    meanings: List[Meaning] = []
    license: Optional[License] = None
    sourceUrls: List[str] = [] # FreeDictionaryAPIの出力にあるため追加


# -------------------------------------------------
# メインのクラス定義 (アプリケーション内部・公開用)
# -------------------------------------------------

class WordRequest(BaseModel):
    """
    単語作成時のリクエストボディのスキーマ
    """
    english: str
    definitions: List[Definition] = Field(..., description="品詞と日本語訳のペアのリスト")
    synonyms: Optional[List[str]] = Field(None, description="類義語のリスト")
    example_sentences: Optional[List[ExampleSentence]] = Field(None, description="例文のリスト")
    # audioフィールドを削除し、phoneticsに統合
    phonetics: Optional[PhoneticInfo] = Field(None, description="発音記号と音声データのオブジェクト") # PhoneticsをPhoneticInfoに統一

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
                ],
                "phonetics": { # PhoneticsをPhoneticInfoに統一
                    "text": "/ˈɛɡzæmpəl/",
                    "audio": "https://example.com/audio/example.mp3",
                    "sourceUrl": "https://example.com/source/example.html" # FreeDictionaryAPIのsourceUrlを反映
                }
            }
        }

class WordResponse(BaseModel):
    """
    単語作成時のレスポンスボディのスキーマ
    """
    english: str
    definitions: List[Definition] = Field(..., description="品詞と日本語訳のペアのリスト")
    synonyms: Optional[List[str]] = Field(None, description="類義語のリスト")
    example_sentences: Optional[List[ExampleSentence]] = Field(None, description="例文オブジェクトのリスト")
    phonetics: Optional[PhoneticInfo] = Field(None, description="発音記号と音声データのオブジェクト") # PhoneticsをPhoneticInfoに統一

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
                ],
                "phonetics": { # PhoneticsをPhoneticInfoに統一
                    "text": "/ˈɛɡzæmpəl/",
                    "audio": "https://example.com/audio/example.mp3",
                    "sourceUrl": "https://example.com/source/example.html" # FreeDictionaryAPIのsourceUrlを反映
                }
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
    辞書データのスキーマ (Firestoreに保存される形式を想定)
    """
    word: str
    part_of_speech: Optional[List[str]] = Field(None, description="品詞のリスト")
    definitions: Optional[List[DictionaryDefinition]] = Field(None, description="定義のリスト")
    translations: Optional[dict[str, List[str]]] = Field(None, description="翻訳のリスト")
    raw_examples: Optional[List[str]] = Field(None, description="生の例文のリスト")
    synonyms: Optional[List[str]] = Field(None, description="類義語のリスト")
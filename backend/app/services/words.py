from openai import OpenAI
from dotenv import load_dotenv
from firebase_admin import firestore
from fastapi import HTTPException, status
from typing import Optional
import logging
import os
import json
import re
import httpx

from ..schemas.words import WordResponse, DictionaryData, FDAData, WordGenerated

load_dotenv()

try:
    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=os.getenv("OPENROUTER_API_KEY"),
    )
    logging.info("LLMクライアントが正常に初期化されました。")
except Exception as e:
    logging.error(f"LLMクライアントの初期化に失敗しました: {e}")
    raise

async def get_word_from_firestore(word: str) -> WordResponse:
    """
    Firestoreから単語情報を取得する。
    単語が存在しない場合は、Noneを返す。
    """
    try:
        db = firestore.client()
        doc_ref = db.collection('dictionary').document(word.lower())
        document = doc_ref.get()
        if document.exists:
            # 取得した辞書データをPydanticモデルに変換して返す
            return DictionaryData.model_validate(document.to_dict())
        return DictionaryData(
            word=word,
            part_of_speech=[],
            definitions=[],
            synonyms=[],
            raw_examples=[]
        )
    except Exception as e:
        logging.error(f"Firestoreからのデータ取得中にエラー: {e}")
        return None

"""
単一の英単語から、その詳細情報を取得するためのサービス
@param dictionary_data: DictionaryData型の辞書データ
@return dict: LLMから抽出された単語情報の辞書
"""
async def generate_enhanced_word_info(dictionary_data: DictionaryData, free_dictionary_data: Optional[FDAData] = None) -> WordGenerated:
    """辞書データを元に、AI(LLM)を使って最終的な応答JSONを生成する"""
    if not client:
        raise Exception("LLM client is not initialized.")

    word = dictionary_data.word
    logging.debug(dictionary_data)

    phonetics = None
    if free_dictionary_data and free_dictionary_data.phonetics:
        # 最初の有効な音声URLを探す
        for phonetic in free_dictionary_data.phonetics:
            if phonetic.audio:
                phonetics = phonetic
                break

    # 新しい要件に基づいたシステムプロンプト
    system_prompt = f"""
    あなたは、与えられた信頼できる辞書データに基づいて、単語情報を指定されたJSON形式で提供する専門家です。
    絶対に辞書データにない情報は生成せず、事実に基づいて以下のタスクを実行してください。

    # 辞書データ (事実情報):
    {dictionary_data.model_dump_json(indent=2)}

    # 重要な制約:
    1. 出力は必ず有効なJSONオブジェクトのみとしてください
    2. 説明やコメント、マークダウン形式は一切含めないでください
    3. JSON以外のテキストは絶対に含めないでください
    4. JSONの構文エラーがないように注意してください

    # あなたのタスク:
    以下の制約と出力JSONフォーマットを「絶対厳守」して、上記の辞書データから情報を抽出し、整形してください。

    - `definitions`: `part_of_speech` と `translations` を関連付け、品詞ごとに「日本語訳」をまとめたオブジェクトのリストを作成してください。各オブジェクトには `part_of_speech(品詞は日本語で生成してください。例：「名詞」「動詞」)`  と、それに対応する `japanese` (日本語訳のリスト) を含めてください。日本語訳は、"{word}"について最も一般的なものを3つ以内で選んでください。日本語訳は、品詞に則した訳である必要があります。出現するpart_of_speechは、一意である必要があります。
    - `synonyms`: `synonyms`の中から、最も意味が一般的なものを最大5つ選んでください。ない場合は空の配列 `[]` を使用してください。なお、`synonyms`は英単語の同義語のリストであり、重複は除外してください。日本語は含めないでください。
    - `example_sentences`: `raw_examples`を参考に、英語と日本語の両方を含む新しい例文を最大3つ生成してください。英語の例文は、{word}を確実に含む自然かつ簡潔な文である必要があります。日本語の例文は、英語の例文を自然な「日本語」に翻訳してください。例文は、与えられた単語の意味を明確に示す、純粋な日本語のものでなければなりません。例文は、`english`と`japanese`のペアで表現してください。

    出力は以下のJSONフォーマットに厳密に従ってください（余計なテキストは一切含めず、有効なJSONのみ）:

    {{
        "english": "{word}",
        "definitions": [
            {{
                "part_of_speech": "名詞",
                "japanese": ["情報", "知識"]
            }}
        ],
        "synonyms": ["data", "details"],
        "example_sentences": [
            {{
                "english": "I need more information about the project.",
                "japanese": "そのプロジェクトに関するもっと多くの情報が必要です。"
            }}
        ]
    }}
    """

    completion = client.chat.completions.create(
        model=os.getenv("MODEL_NAME"),
        messages=[{"role": "system", "content": system_prompt}],
        response_format={"type": "json_object"}
    )

    response_content = completion.choices[0].message.content
    
    # レスポンス内容をログ出力（デバッグ用）
    logging.info(f"LLMからの生レスポンス: {response_content}")

    try:
        # まず、レスポンス全体を直接JSONとして解析を試行
        try:
            json_data = json.loads(response_content)
            word_info = WordGenerated.model_validate(json_data)
        except json.JSONDecodeError:
            # 直接解析に失敗した場合、JSONオブジェクトを抽出
            logging.warning("直接JSON解析に失敗。JSONオブジェクトの抽出を試行中...")
            
            # より堅牢なJSON抽出
            # コードブロック（```json ```）がある場合は除去
            cleaned_content = re.sub(r'```json\s*|\s*```', '', response_content)
            
            # 最初と最後の{}を見つける
            first_brace = cleaned_content.find('{')
            last_brace = cleaned_content.rfind('}')
            
            if first_brace == -1 or last_brace == -1 or first_brace >= last_brace:
                raise ValueError("有効なJSONオブジェクトが見つかりません")
            
            json_str = cleaned_content[first_brace:last_brace + 1]
            
            # 抽出したJSONをログ出力
            logging.info(f"抽出されたJSON: {json_str}")
            
            # JSON文字列の妥当性をチェック
            json_data = json.loads(json_str)
            word_info = WordGenerated.model_validate(json_data)

        # phoneticsを設定
        word_info.phonetics = phonetics
        return word_info

    except (ValueError, json.JSONDecodeError) as e:
        logging.error(f"JSONの解析に失敗しました: {e}")
        logging.error(f"LLMからの生の応答: {response_content}")
        
        # フォールバック: 基本的な単語情報を返す
        fallback_data = {
            "english": word,
            "definitions": [{"part_of_speech": "未分類", "japanese": ["データが取得できませんでした。"]}],
            "synonyms": [],
            "example_sentences": []
        }
        
        word_info = WordGenerated.model_validate(fallback_data)
        word_info.phonetics = phonetics
        
        logging.warning(f"フォールバックデータを使用: {word}")
        return word_info
        
    except Exception as e:
        logging.error(f"予期しないエラー: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="AI生成中に予期しないエラーが発生しました"
        )

async def get_dictionary_data_for_word(word: str) -> DictionaryData:
    """
    指定された単語の辞書データをFirestoreから取得する依存性。
    データが見つからない場合は404エラーを発生させる。
    """
    dictionary_data = await get_word_from_firestore(word)
    if not dictionary_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Dictionary data for '{word}' not found."
        )
    return dictionary_data

async def get_word_info_from_free_dictionary(word: str) -> Optional[FDAData]:
    """
    Free Dictionary APIから単語情報を取得し、FDADataモデルにパースして返す。
    単語が見つからない場合はNoneを返す。
    """
    api_url = os.getenv("FREE_DICTIONARY_API_URL", "https://api.dictionaryapi.dev/api/v2/entries/en")
    full_url = f"{api_url}/{word}"

    async with httpx.AsyncClient() as client:
        response = await client.get(full_url)

        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list) and data:
                try:
                    # 最初の要素をFDADataモデルにパース
                    return FDAData.model_validate(data[0])
                except Exception as e:
                    logging.error(f"Free Dictionary APIのレスポンスパース中にエラー: {e}, Data: {data[0]}")
                    return None
            elif response.status_code == 404:
                logging.warning(f"Free Dictionary APIが単語を見つけられませんでした: {word}")
                return None
            else:
                logging.warning(f"Free Dictionary APIが空のリストまたは予期しない形式を返しました: {data}")
                return None
        else:
            logging.error(f"Free Dictionary APIからのデータ取得中にエラー: ステータスコード {response.status_code}, レスポンス: {response.text}")
            return None
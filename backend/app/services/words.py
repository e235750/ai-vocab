from openai import OpenAI
from dotenv import load_dotenv
from firebase_admin import firestore
from fastapi import HTTPException, status
import logging
import os
import json
import re

from ..schemas.words import WordResponse, DictionaryData

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
@return dict: LLMから抽出された単語情報の辞書（WordResponseの言語情報部分）
"""
async def generate_enhanced_word_info(dictionary_data: DictionaryData) -> WordResponse:
    """辞書データを元に、AI(LLM)を使って最終的な応答JSONを生成する"""
    if not client:
        raise Exception("LLM client is not initialized.")

    word = dictionary_data.word
    logging.debug(dictionary_data)

    # 新しい要件に基づいたシステムプロンプト
    system_prompt = f"""
    あなたは、与えられた信頼できる辞書データに基づいて、単語情報を指定されたJSON形式で提供する専門家です。
    絶対に辞書データにない情報は生成せず、事実に基づいて以下のタスクを実行してください。

    # 辞書データ (事実情報):
    {dictionary_data.model_dump_json(indent=2)}

    # あなたのタスク:
    以下の制約と出力JSONフォーマットを「絶対厳守」して、上記の辞書データから情報を抽出し、整形してください。

    - `definitions`: `part_of_speech` と `translations` を関連付け、品詞ごとに「日本語訳」をまとめたオブジェクトのリストを作成してください。各オブジェクトには `part_of_speech` ("英語-日本語"形式) と、それに対応する `japanese` (日本語訳のリスト) を含めてください。日本語訳は、"{word}"について最も一般的なものを3つ以内で選んでください。
    - `synonyms`: `synonyms`の中から、最も意味が一般的なものを最大5つ選んでください。ない場合は空の配列 `[]` を使用してください。なお、`synonyms`は英単語の同義語のリストであり、重複は除外してください。
    - `example_sentences`: `raw_examples`を参考に、英語と日本語の両方を含む新しい例文を最大5つ生成してください。英語の例文は、与えられた単語を含む自然かつ簡潔な文である必要があります。日本語の例文は、英語の例文を自然な「日本語」に翻訳してください。例文は、与えられた単語の意味を明確に示す、純粋な日本語のものでなければなりません。例文は、`english`と`japanese`のペアで表現してください。
    - **余計な説明やテキストは一切含まず**、純粋なJSONオブジェクトのみを出力してください。解説は不要です。

    # 出力JSONフォーマット:
    {{
        "english": "information",
        "definitions": [
            {{
                "part_of_speech": "noun-名詞",
                "japanese": ["情報", "知識"]
            }},
            {{
                "part_of_speech": "verb-動詞",
                "japanese": ["知らせる"]
            }}
        ],
        "synonyms": ["data", "details", "knowledge"],
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

    try:
        match = re.search(r'\{.*\}', response_content, re.DOTALL)

        if not match:
            raise ValueError("LLMの応答から有効なJSONオブジェクトを見つけられませんでした。")

        json_str = match.group(0)

        return WordResponse.model_validate_json(json_str)

    except (ValueError, json.JSONDecodeError) as e:
        logging.error(f"JSONの解析に失敗しました: {e}")
        logging.error(f"LLMからの生の応答（再掲）: {response_content}")
        raise

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
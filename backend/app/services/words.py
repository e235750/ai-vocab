from openai import OpenAI
from dotenv import load_dotenv
import json
import os

load_dotenv()

_SYSTEM_PROMPT = """
    あなたは与えられた英単語について、その詳細情報（日本語訳、類義語、例文、品詞）をJSON形式で提供する専門家です。
    情報が不足している場合は、空の配列やnullを使用してください。
    以下のフォーマットに従ってください。

    {
      "english": "元の英単語",
      "japanese": "日本語訳",
      "synonyms": ["類義語1", "類義語2"],
      "example_sentences": ["例文1", "例文2"],
      "part_of_speech": "品詞（例: "noun-名詞", "verb-動詞", "adjective-形容詞", "adverb-副詞"など）"
    }

    - 類義語と例文は、最大5つ提供してください。ない場合は空の配列 [] を使用してください。
    - 品詞は、最も適切なものを3つ以内で提供してください。
    - 余計な説明やテキストは一切含まず、純粋なJSONオブジェクトのみを出力してください。
    - 例文は、与えられた単語を使った自然で簡潔なものを提案してください。
    """

"""
単一の英単語から、その詳細情報を取得するためのサービス
@param word: str 情報を取得したい英単語
@return dict: LLMから抽出された単語情報の辞書（WordResponseの言語情報部分）
"""
async def get_word_info_from_llm(word: str) -> dict: # 戻り値はdictとします（idなどは後で付与するため）
    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=os.getenv("OPENROUTER_API_KEY"),
    )

    user_content = f"'{word}' という英単語について、詳細情報を抽出してください。"

    completion = client.chat.completions.create(
        model="mistralai/mistral-7b-instruct:free",
        messages=[
            {"role": "system", "content": _SYSTEM_PROMPT},
            {"role": "user", "content": user_content}
        ],
        response_format={"type": "json_object"}
    )

    try:
        json_string = completion.choices[0].message.content
        extracted_data = json.loads(json_string)

        # パースされたデータが想定通りの辞書であることを確認
        if not isinstance(extracted_data, dict):
            raise ValueError("LLM did not return a valid JSON object.")

        return extracted_data
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON from LLM: {e}")
        print(f"LLM raw response: {completion.choices[0].message.content}")
        raise ValueError("LLM did not return valid JSON.")
    except Exception as e:
        print(f"An unexpected error occurred in get_word_info: {e}")
        raise


from fastapi import APIRouter, HTTPException, status
from datetime import datetime
from uuid import uuid4

from ...schemas.words import WordResponse, WordsInfoRequest
from ...services.words import get_word_info_from_llm

router = APIRouter()

@router.post("/info", response_model=WordResponse, status_code=status.HTTP_200_OK)
async def get_word_info(request: WordsInfoRequest) -> WordResponse:
    """
    単一の英単語から、その詳細情報を取得するエンドポイント
    """
    word = request.word.strip()

    if not word:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Word cannot be empty")

    # ここで実際のLLM呼び出しを行う
    try:
        word_info = await get_word_info_from_llm(word)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    # レスポンスモデルに変換
    response = WordResponse(
        id=str(uuid4()),
        english=word,
        japanese=word_info.get("japanese", ""),
        synonyms=word_info.get("synonyms", []),
        example_sentences=word_info.get("example_sentences", []),
        part_of_speech=word_info.get("part_of_speech", ""),
        created_at=datetime.now(),
        updated_at=datetime.now()
    )

    return response
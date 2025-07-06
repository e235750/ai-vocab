from fastapi import APIRouter, HTTPException, status, Depends
from firebase_admin import firestore
from datetime import datetime
from uuid import uuid4

from ...schemas.words import WordRequest, WordResponse, WordsInfoRequest
from ...services.words import get_word_info_from_llm
from app.core.firebase import get_db

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

    response = WordResponse(
        english=word,
        japanese=word_info.get("japanese", []),
        synonyms=word_info.get("synonyms", []),
        example_sentences=word_info.get("example_sentences", []),
        part_of_speech=word_info.get("part_of_speech", [])
    )

    return response

@router.post("/word", response_model=WordResponse, status_code=status.HTTP_201_CREATED)
async def create_word(request: WordRequest, db: firestore.Client = Depends(get_db)):
    """
    単語情報をデータベースに保存するエンドポイント
    """

    example_sentences_dict = None
    if request.example_sentences:
        # Pydantic v2 をお使いの場合 .model_dump() を使用
        example_sentences_dict = [ex.model_dump() for ex in request.example_sentences]
    now = datetime.now()
    word_data = {
        "id": str(uuid4()),
        "english": request.english,
        "japanese": request.japanese,
        "synonyms": request.synonyms,
        "example_sentences": example_sentences_dict,
        "part_of_speech": request.part_of_speech,
        "created_at": now,
        "updated_at": now
    }

    doc_ref = db.collection("words").document(word_data["id"])
    doc_ref.set(word_data)
    return word_data
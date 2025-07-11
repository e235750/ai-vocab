from fastapi import APIRouter, HTTPException, status, Depends
from firebase_admin import firestore
from datetime import datetime
from uuid import uuid4

from app.core.firebase import get_db
from ...schemas.words import WordRequest, WordResponse, WordsInfoRequest
from ...services.words import generate_enhanced_word_info, get_dictionary_data_for_word, get_word_info_from_free_dictionary

router = APIRouter()

@router.post("/word", response_model=WordResponse, status_code=status.HTTP_201_CREATED)
async def create_word(request: WordRequest, db: firestore.Client = Depends(get_db)):
    """
    単語情報をデータベースに保存するエンドポイント
    """

    now = datetime.now()
    word_data = {
    "id": str(uuid4()),
    "english": request.english,
    "definitions": [definition.model_dump() for definition in request.definitions],
    "synonyms": request.synonyms,
    "example_sentences": [sentence.model_dump() for sentence in request.example_sentences] if request.example_sentences else [],
    "phonetics": request.phonetics.model_dump() if request.phonetics else None,
    "created_at": now,
    "updated_at": now
}

    doc_ref = db.collection("words").document(word_data["id"])
    doc_ref.set(word_data)
    return word_data

@router.post(
    "/info",
    response_model=WordResponse,
    summary="単語情報をAIで拡張して取得",
    description="Firestoreの辞書データを元に、AIが要約・整形した単語情報を返す。"
)
async def get_enhanced_word_info(
    request: WordsInfoRequest,
) -> WordResponse:
    dictionary_data = await get_dictionary_data_for_word(request.word)
    free_dictionary_data = await get_word_info_from_free_dictionary(request.word)
    enhanced_info = await generate_enhanced_word_info(dictionary_data, free_dictionary_data)
    return enhanced_info

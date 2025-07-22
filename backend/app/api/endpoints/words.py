from fastapi import APIRouter, status, Depends, HTTPException
from firebase_admin import firestore
from datetime import datetime
from uuid import uuid4

from app.core.firebase import get_db
from app.core.security import get_current_user_uid
from ...schemas.words import WordRequest, WordResponse, WordsInfoRequest
from ...services.words import generate_enhanced_word_info, get_dictionary_data_for_word, get_word_info_from_free_dictionary

router = APIRouter()

@router.post("/", response_model=WordResponse, status_code=status.HTTP_201_CREATED)
async def create_word(request: WordRequest, db: firestore.Client = Depends(get_db), uid: str = Depends(get_current_user_uid)):
    """
    単語情報をデータベースに保存するエンドポイント
    """
    wordbook_ref = db.collection("wordbooks").document(request.wordbook_id)
    wordbook_doc = wordbook_ref.get()

    if not wordbook_doc.exists:
        raise HTTPException(status_code=404, detail="Wordbook not found")

    batch = db.batch()

    batch.update(wordbook_ref, {"num_words": firestore.Increment(1)})

    now = datetime.now()
    word_id = str(uuid4())
    word_ref = db.collection("words").document(word_id)
    word_data = {
        "id": word_id,
        "english": request.english,
        "definitions": [definition.model_dump() for definition in request.definitions],
        "synonyms": request.synonyms,
        "example_sentences": [sentence.model_dump() for sentence in request.example_sentences] if request.example_sentences else [],
        "phonetics": request.phonetics.model_dump() if request.phonetics else None,
        "owner_id": uid,
        "wordbook_id": request.wordbook_id,
        "created_at": now,
        "updated_at": now
    }
    batch.set(word_ref, word_data)

    batch.commit()

    return WordResponse(**word_data, id=word_id)


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

@router.put("/{word_id}", response_model=WordResponse, status_code=status.HTTP_200_OK)
async def update_word(
    word_id: str,
    request: WordRequest,
    db: firestore.Client = Depends(get_db),
    uid: str = Depends(get_current_user_uid)
):
    """
    単語情報を更新するエンドポイント
    """
    word_ref = db.collection("words").document(word_id)
    word_doc = word_ref.get()

    if not word_doc.exists:
        raise HTTPException(status_code=404, detail="Word not found")

    if word_doc.to_dict().get("owner_id") != uid:
        raise HTTPException(status_code=403, detail="You do not have permission to update this word")

    now = datetime.now()
    updated_data = {
        "english": request.english,
        "definitions": [definition.model_dump() for definition in request.definitions],
        "synonyms": request.synonyms,
        "example_sentences": [sentence.model_dump() for sentence in request.example_sentences] if request.example_sentences else [],
        "phonetics": request.phonetics.model_dump() if request.phonetics else None,
        "updated_at": now
    }

    word_ref.update(updated_data)

    return WordResponse(**{**word_doc.to_dict(), **updated_data, "id": word_id})

@router.delete("/{word_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_word(
    word_id: str,
    db: firestore.Client = Depends(get_db),
    uid: str = Depends(get_current_user_uid)
):
    """
    単語情報を削除するエンドポイント
    """
    word_ref = db.collection("words").document(word_id)
    word_doc = word_ref.get()

    if not word_doc.exists:
        raise HTTPException(status_code=404, detail="Word not found")

    if word_doc.to_dict().get("owner_id") != uid:
        raise HTTPException(status_code=403, detail="You do not have permission to delete this word")

    # 単語帳の単語数を減らす
    wordbook_ref = db.collection("wordbooks").document(word_doc.to_dict()["wordbook_id"])
    batch = db.batch()
    batch.update(wordbook_ref, {"num_words": firestore.Increment(-1)})

    # 単語を削除
    batch.delete(word_ref)

    batch.commit()

    return {"message": "Word deleted successfully"}
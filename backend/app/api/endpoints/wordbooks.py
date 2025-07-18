from fastapi import APIRouter, status, Depends, HTTPException
from firebase_admin import firestore
from datetime import datetime
from uuid import uuid4

from app.core.firebase import get_db
from ...schemas.wordbooks import WordBook, WordBookResponse
from ...schemas.words import WordResponse
from ...core.security import get_current_user_uid
from typing import List
router = APIRouter()

@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    summary="単語帳を作成",
    description="指定された単語情報をデータベースに保存する"
)
async def create_wordbook(request: WordBook, db: firestore.Client = Depends(get_db), uid: str = Depends(get_current_user_uid)):
    now = datetime.now()
    wordbook_data = {
        "id": str(uuid4()),
        "name": request.name,
        "owner_id": uid,
        "is_public": request.is_public,
        "num_words": request.num_words,
        "description": request.description,
        "created_at": now,
        "updated_at": now
    }

    doc_ref = db.collection("wordbooks").document(wordbook_data["id"])
    doc_ref.set(wordbook_data)
    return wordbook_data

@router.get(
    "/",
    summary="ユーザの単語帳を取得",
    response_model=List[WordBookResponse],
    description="指定されたユーザIDに紐づく単語帳のリストを取得する"
)
async def get_owned_wordbooks(db: firestore.Client = Depends(get_db), uid: str = Depends(get_current_user_uid)):
    wordbooks_ref = db.collection("wordbooks").where("owner_id", "==", uid)
    docs = wordbooks_ref.stream()
    return [WordBookResponse(**doc.to_dict()) for doc in docs]

@router.get("/{wordbook_id}/words",
    response_model=List[WordResponse],
    summary="単語帳の単語を取得",
    description="指定された単語帳IDに紐づく単語のリストを取得する"
)
async def get_words_in_wordbook(wordbook_id: str, db: firestore.Client = Depends(get_db), uid: str = Depends(get_current_user_uid)):
    """
    単語帳IDに紐づく単語のリストを取得する
    """
    wordbook_ref = db.collection("wordbooks").document(wordbook_id)
    wordbook_doc = wordbook_ref.get()

    if not wordbook_doc.exists:
        raise HTTPException(status_code=404, detail="Wordbook not found")

    wordbook_data = wordbook_doc.to_dict()

    is_public = wordbook_data.get("is_public", False) # デフォルトは非公開

    if not is_public:
        if uid is None or wordbook_data.get("owner_id") != uid:
            raise HTTPException(status_code=403, detail="Access denied")

    words_ref = db.collection("words").where("wordbook_id", "==", wordbook_id)
    docs = words_ref.stream()
    return [WordResponse(**doc.to_dict()) for doc in docs]
from fastapi import APIRouter, status, Depends
from firebase_admin import firestore
from datetime import datetime
from uuid import uuid4

from app.core.firebase import get_db
from ...schemas.wordbooks import WordBook
router = APIRouter()

@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    summary="単語帳を作成",
    description="指定された単語情報をデータベースに保存する"
)
async def create_wordbook(request: WordBook, db: firestore.Client = Depends(get_db)):
    now = datetime.now()
    wordbook_data = {
        "id": str(uuid4()),
        "name": request.name,
        "owner_id": request.owner_id,
        "is_public": request.is_public,
        "num_words": request.num_words,
        "description": request.description,
        "created_at": now,
        "updated_at": now
    }

    doc_ref = db.collection("wordbooks").document(wordbook_data["id"])
    doc_ref.set(wordbook_data)
    return wordbook_data


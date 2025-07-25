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
        "num_words": 0,
        "description": request.description,
        "created_at": now,
        "updated_at": now
    }

    doc_ref = db.collection("wordbooks").document(wordbook_data["id"])
    doc_ref.set(wordbook_data)
    return wordbook_data

@router.post(
    "/{wordbook_id}/duplicate",
    status_code=status.HTTP_201_CREATED,
    response_model=WordBookResponse,
    summary="単語帳を複製",
    description="指定された単語帳IDの単語帳と単語を複製する"
)
async def duplicate_wordbook(
    wordbook_id: str,
    request: WordBook,
    db: firestore.Client = Depends(get_db),
    uid: str = Depends(get_current_user_uid)
):
    # 元の単語帳の存在確認
    original_wordbook_ref = db.collection("wordbooks").document(wordbook_id)
    original_wordbook_doc = original_wordbook_ref.get()
    
    if not original_wordbook_doc.exists:
        raise HTTPException(status_code=404, detail="Original wordbook not found")
    
    original_wordbook_data = original_wordbook_doc.to_dict()
    
    # 公開設定されていない場合は所有者チェック
    if not original_wordbook_data.get("is_public", False):
        if original_wordbook_data.get("owner_id") != uid:
            raise HTTPException(status_code=403, detail="You do not have permission to duplicate this wordbook")
    
    # 新しい単語帳を作成
    now = datetime.now()
    new_wordbook_id = str(uuid4())
    new_wordbook_data = {
        "id": new_wordbook_id,
        "name": request.name,
        "owner_id": uid,
        "is_public": request.is_public,
        "num_words": 0,  # 後で更新
        "description": request.description,
        "created_at": now,
        "updated_at": now
    }
    
    # バッチ処理で単語帳と単語を同時に作成
    batch = db.batch()
    
    # 新しい単語帳を作成
    new_wordbook_ref = db.collection("wordbooks").document(new_wordbook_id)
    batch.set(new_wordbook_ref, new_wordbook_data)
    
    # 元の単語帳の単語を取得して複製
    words_query = db.collection("words").where("wordbook_id", "==", wordbook_id)
    words = list(words_query.stream())
    
    word_count = 0
    for word_doc in words:
        word_data = word_doc.to_dict()
        new_word_id = str(uuid4())
        new_word_data = {
            **word_data,
            "id": new_word_id,
            "wordbook_id": new_wordbook_id,
            "owner_id": uid,
            "created_at": now,
            "updated_at": now
        }
        
        new_word_ref = db.collection("words").document(new_word_id)
        batch.set(new_word_ref, new_word_data)
        word_count += 1
    
    # 単語数を更新
    new_wordbook_data["num_words"] = word_count
    batch.update(new_wordbook_ref, {"num_words": word_count})
    
    # バッチ実行
    batch.commit()
    
    return WordBookResponse(**new_wordbook_data)

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

    # 指定された単語帳に含まれる単語を取得
    words_query = db.collection("words").where("wordbook_id", "==", wordbook_id)
    words = words_query.stream()
    return [WordResponse(**doc.to_dict()) for doc in words]

@router.put("/{wordbook_id}",
    response_model=WordBookResponse,
    summary="単語帳を更新",
    description="指定された単語帳IDの単語帳情報を更新する"
)
async def update_wordbook(
    wordbook_id: str,
    request: WordBook,
    db: firestore.Client = Depends(get_db),
    uid: str = Depends(get_current_user_uid)
):
    """
    単語帳を更新するエンドポイント
    """
    wordbook_ref = db.collection("wordbooks").document(wordbook_id)
    wordbook_doc = wordbook_ref.get()

    if not wordbook_doc.exists:
        raise HTTPException(status_code=404, detail="Wordbook not found")

    if wordbook_doc.to_dict().get("owner_id") != uid:
        raise HTTPException(status_code=403, detail="You do not have permission to update this wordbook")

    now = datetime.now()
    updated_data = {
        "name": request.name,
        "description": request.description,
        "is_public": request.is_public,
        "updated_at": now
    }

    wordbook_ref.update(updated_data)

    # 更新されたデータを返す
    updated_doc = wordbook_ref.get()
    return WordBookResponse(**updated_doc.to_dict())

@router.delete("/{wordbook_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="単語帳を削除",
    description="指定された単語帳IDに紐づく単語帳を削除する"
)
async def delete_wordbook(wordbook_id: str, db: firestore.Client = Depends(get_db), uid: str = Depends(get_current_user_uid)):
    """
    単語帳を削除するエンドポイント
    """
    wordbook_ref = db.collection("wordbooks").document(wordbook_id)
    wordbook_doc = wordbook_ref.get()

    if not wordbook_doc.exists:
        raise HTTPException(status_code=404, detail="Wordbook not found")

    if wordbook_doc.to_dict().get("owner_id") != uid:
        raise HTTPException(status_code=403, detail="You do not have permission to delete this wordbook")

    # 単語帳に紐づく単語を全て削除
    words_ref = db.collection("words").where("wordbook_id", "==", wordbook_id)
    batch = db.batch()
    for doc in words_ref.stream():
        batch.delete(doc.reference)

    # 単語帳自体を削除
    batch.delete(wordbook_ref)

    batch.commit()
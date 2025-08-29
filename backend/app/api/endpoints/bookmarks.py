from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.bookmarks import BookmarkCreate, BookmarkResponse, BookmarkExistsResponse
from app.core.firebase import get_db
from app.core.security import get_current_user_uid
from google.cloud import firestore
from datetime import datetime
import uuid

router = APIRouter()


@router.post("/", response_model=BookmarkResponse)
async def create_bookmark(
    bookmark_data: BookmarkCreate,
    uid: str = Depends(get_current_user_uid),
    db: firestore.Client = Depends(get_db)
):
    """ブックマークを作成"""
    bookmarks_collection = db.collection('bookmarks')
    
    try:
        # 既存のブックマークをチェック
        existing_query = bookmarks_collection.where(
            'user_id', '==', uid
        ).where(
            'card_id', '==', bookmark_data.card_id
        ).limit(1)
        
        existing_bookmarks = list(existing_query.stream())
        if existing_bookmarks:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="このカードは既にブックマークされています"
            )

        # 新しいブックマークを作成
        bookmark_id = str(uuid.uuid4())
        bookmark_doc = {
            'id': bookmark_id,
            'card_id': bookmark_data.card_id,
            'user_id': uid,
            'created_at': datetime.utcnow()
        }
        
        bookmarks_collection.document(bookmark_id).set(bookmark_doc)
        
        return BookmarkResponse(**bookmark_doc)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"ブックマークの作成中にエラーが発生しました: {str(e)}"
        )


@router.get("/", response_model=List[BookmarkResponse])
async def get_bookmarks(
    uid: str = Depends(get_current_user_uid),
    db: firestore.Client = Depends(get_db)
):
    """ユーザーのブックマーク一覧を取得"""
    import traceback
    bookmarks_collection = db.collection('bookmarks')
    try:
        bookmarks_query = bookmarks_collection.where(
            'user_id', '==', uid
        ).order_by('created_at', direction=firestore.Query.DESCENDING)
        bookmarks = []
        for doc in bookmarks_query.stream():
            bookmark_data = doc.to_dict()
            bookmarks.append(BookmarkResponse(**bookmark_data))
        return bookmarks
    except Exception as e:
        print("[BOOKMARKS GET ERROR]", e)
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"ブックマークの取得中にエラーが発生しました: {str(e)}"
        )


@router.delete("/{bookmark_id}/")
async def delete_bookmark(
    bookmark_id: str,
    uid: str = Depends(get_current_user_uid),
    db: firestore.Client = Depends(get_db)
):
    """ブックマークを削除"""
    bookmarks_collection = db.collection('bookmarks')
    
    try:
        bookmark_doc = bookmarks_collection.document(bookmark_id)
        bookmark_data = bookmark_doc.get()
        
        if not bookmark_data.exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="ブックマークが見つかりません"
            )
        
        bookmark_info = bookmark_data.to_dict()
        if bookmark_info['user_id'] != uid:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="このブックマークを削除する権限がありません"
            )
        
        bookmark_doc.delete()
        return {"message": "ブックマークが削除されました"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"ブックマークの削除中にエラーが発生しました: {str(e)}"
        )


@router.delete("/card/{card_id}/")
async def delete_bookmark_by_card_id(
    card_id: str,
    uid: str = Depends(get_current_user_uid),
    db: firestore.Client = Depends(get_db)
):
    """カードIDでブックマークを削除"""
    bookmarks_collection = db.collection('bookmarks')
    
    try:
        bookmarks_query = bookmarks_collection.where(
            'user_id', '==', uid
        ).where(
            'card_id', '==', card_id
        ).limit(1)
        
        bookmarks = list(bookmarks_query.stream())
        if not bookmarks:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="ブックマークが見つかりません"
            )
        
        bookmark_doc = bookmarks[0]
        bookmark_doc.reference.delete()
        
        return {"message": "ブックマークが削除されました"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"ブックマークの削除中にエラーが発生しました: {str(e)}"
        )


@router.get("/check/{card_id}/", response_model=BookmarkExistsResponse)
async def check_bookmark_exists(
    card_id: str,
    uid: str = Depends(get_current_user_uid),
    db: firestore.Client = Depends(get_db)
):
    """特定のカードがブックマークされているかチェック"""
    bookmarks_collection = db.collection('bookmarks')
    
    try:
        bookmarks_query = bookmarks_collection.where(
            'user_id', '==', uid
        ).where(
            'card_id', '==', card_id
        ).limit(1)
        
        bookmarks = list(bookmarks_query.stream())
        is_bookmarked = len(bookmarks) > 0
        
        return BookmarkExistsResponse(is_bookmarked=is_bookmarked)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"ブックマーク確認中にエラーが発生しました: {str(e)}"
        )

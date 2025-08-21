from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth
from firebase_admin.auth import InvalidIdTokenError, ExpiredIdTokenError

# Bearerトークンをヘッダーから取得するためのスキーマ
oauth2_scheme = HTTPBearer()

def get_current_user_uid(cred: HTTPAuthorizationCredentials = Depends(oauth2_scheme)) -> str:
    """
    AuthorizationヘッダーからIDトークンを取得し、検証してUIDを返すFastAPIの依存関係。
    保護したいエンドポイントでこの関数をDependsに指定する。
    """
    if not cred:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Bearerトークンが必要です。",
        )

    id_token = cred.credentials
    try:
        # IDトークンを検証
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token["uid"]
    except (InvalidIdTokenError, ExpiredIdTokenError) as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"無効な認証情報です: {e}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Firebase認証中にエラーが発生しました: {e}"
        )
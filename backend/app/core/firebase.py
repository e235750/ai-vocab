import os
import json
import firebase_admin
from firebase_admin import credentials, firestore
from firebase_admin.exceptions import FirebaseError

def initialize_firebase():
    """
    環境変数からFirebaseサービスアカウント情報を読み込み、
    Firebase Admin SDKを初期化する。
    すでに初期化済みの場合は何もしない。
    """
    if not firebase_admin._apps:
        try:
            # 環境変数からサービスアカウントのJSON文字列を取得
            creds_json_str = os.getenv("FIREBASE_CREDENTIALS_JSON")
            if not creds_json_str:
                raise ValueError("環境変数 'FIREBASE_CREDENTIALS_JSON' が設定されていません。")

            creds_json = json.loads(creds_json_str)
            cred = credentials.Certificate(creds_json)
            firebase_admin.initialize_app(cred)
            print("Firebase Admin SDKが正常に初期化されました。")
        except (ValueError, json.JSONDecodeError, FirebaseError) as e:
            print(f"Firebaseの初期化に失敗しました: {e}")
            raise

def get_db():
    """
    Firestoreクライアントを返す。
    この関数はFastAPIの依存関係として使用することを想定。
    """
    if not firebase_admin._apps:
        raise Exception("Firebaseが初期化されていません。アプリケーションの起動時に初期化してください。")

    return firestore.client()
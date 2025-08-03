# Backend - AI Vocab API

AI VocabのFastAPI バックエンドサービスです。AI機能、ユーザー認証、単語帳管理のためのRESTful APIを提供します。

## 🛠️ 技術スタック

### 主要技術
- **FastAPI**: 高性能Python Webフレームワーク
- **Python 3.13**: プログラミング言語
- **Uvicorn**: ASGI Webサーバー
- **Poetry**: 依存関係管理・パッケージング

### 主要ライブラリ
- **Firebase Admin SDK**: サーバーサイドFirebase機能
- **OpenAI API**: AI機能（GPT-4）
- **Pydantic**: データ検証・設定管理
- **HTTPX**: 非同期HTTPクライアント
- **Python-dotenv**: 環境変数管理

## 📁 プロジェクト構造

```
backend/
├── app/                      # メインアプリケーション
│   ├── __init__.py
│   ├── main.py              # FastAPI アプリケーション
│   ├── dependencies.py      # 依存性注入
│   ├── api/                 # API エンドポイント
│   │   ├── __init__.py
│   │   ├── router.py        # APIルーター
│   │   └── endpoints/       # エンドポイント実装
│   │       ├── __init__.py
│   │       ├── bookmarks.py # ブックマークAPI
│   │       ├── wordbooks.py # 単語帳API
│   │       └── words.py     # 単語API
│   ├── core/                # 核となる機能
│   │   ├── __init__.py
│   │   ├── firebase.py      # Firebase設定
│   │   └── security.py      # セキュリティ・認証
│   ├── schemas/             # Pydantic スキーマ
│   │   ├── __init__.py
│   │   ├── bookmarks.py     # ブックマークスキーマ
│   │   ├── wordbooks.py     # 単語帳スキーマ
│   │   └── words.py         # 単語スキーマ
│   └── services/            # ビジネスロジック
│       └── words.py         # 単語サービス
├── Dockerfile               # Docker設定
├── pyproject.toml          # Poetry設定
├── poetry.lock             # 依存関係ロック
└── README.md              # このファイル
```

## 🚀 開発環境セットアップ

### 前提条件
- Python 3.13以上
- Poetry
- Firebase プロジェクト
- OpenAI API キー

### インストール

```bash
# Poetry環境セットアップ
poetry install

# 仮想環境の有効化
poetry shell
```

### 環境変数設定

`.env` ファイルを作成し、以下の環境変数を設定してください：

```bash
# Firebase設定（Admin SDK用サービスアカウントキー）
FIREBASE_CREDENTIALS_PATH=path/to/serviceAccountKey.json

# または直接JSON
FIREBASE_CREDENTIALS_JSON={"type": "service_account", ...}

# OpenAI設定
OPENAI_API_KEY=sk-your_openai_api_key

# アプリケーション設定
DEBUG=True
HOST=0.0.0.0
PORT=8000
```

### 開発サーバー起動

```bash
# 開発サーバー開始
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# または
python -m uvicorn app.main:app --reload
```

API ドキュメントは [http://localhost:8000/docs](http://localhost:8000/docs) で確認できます。

## 📊 API エンドポイント

### 認証
すべてのAPIエンドポイントはFirebase Authenticationトークンによる認証が必要です。

```http
Authorization: Bearer <firebase_id_token>
```

### 単語帳 API (`/wordbooks`)

#### 単語帳一覧取得
```http
GET /wordbooks
```

#### 単語帳作成
```http
POST /wordbooks
Content-Type: application/json

{
  "name": "TOEIC単語集",
  "description": "TOEIC対策用の単語帳",
  "is_public": false
}
```

#### 単語帳更新
```http
PUT /wordbooks/{wordbook_id}
Content-Type: application/json

{
  "name": "更新された単語帳名",
  "description": "更新された説明",
  "is_public": true
}
```

#### 単語帳削除
```http
DELETE /wordbooks/{wordbook_id}
```

### 単語 API (`/words`)

#### 単語一覧取得
```http
GET /words?wordbook_id={wordbook_id}
```

#### 単語作成
```http
POST /words
Content-Type: application/json

{
  "english": "example",
  "definitions": [
    {
      "part_of_speech": "名詞",
      "japanese": ["例", "実例"]
    }
  ],
  "wordbook_id": "wordbook_id_here",
  "synonyms": ["sample", "instance"],
  "example_sentences": [
    {
      "english": "This is an example sentence.",
      "japanese": "これは例文です。"
    }
  ],
  "phonetics": {
    "text": "/ɪɡˈzæmpəl/",
    "audio": "https://example.com/audio.mp3"
  }
}
```

#### 単語更新
```http
PUT /words/{word_id}
```

#### 単語削除
```http
DELETE /words/{word_id}
```

### ブックマーク API (`/bookmarks`)

#### ブックマーク一覧取得
```http
GET /bookmarks
```

#### ブックマーク追加
```http
POST /bookmarks
Content-Type: application/json

{
  "wordbook_id": "wordbook_id_here"
}
```

#### ブックマーク削除
```http
DELETE /bookmarks/{bookmark_id}
```

## 🤖 AI機能

### OpenAI GPT-4 統合
- 英単語の定義自動生成
- 例文作成
- 類義語検索
- 発音情報生成

### サービス実装 (`services/words.py`)
- AIプロンプト最適化
- レスポンス解析・構造化
- エラーハンドリング

## 🔐 セキュリティ

### Firebase認証
- JWT トークン検証
- ユーザー識別・認可
- セキュアなAPI アクセス

### データ保護
- 入力データバリデーション（Pydantic）
- SQLインジェクション対策
- CORS設定

## 🧪 テスト

```bash
# テスト実行（実装時）
poetry run pytest

# コード品質チェック
poetry run flake8 app/
poetry run black app/ --check
poetry run isort app/ --check-only
```

## 🐳 Docker

### 開発環境
```bash
# Dockerコンテナで実行
docker-compose up backend
```

### 本番環境
```bash
# 本番用イメージビルド
docker build -t ai-vocab-backend .

# コンテナ実行
docker run -p 8000:8000 --env-file .env ai-vocab-backend
```

## 📈 パフォーマンス

### 実装済み最適化
- 非同期処理（async/await）
- HTTPXによる非同期HTTPリクエスト
- Pydanticによる高速データ検証
- FastAPIの自動ドキュメント生成

### 監視・ログ
- 構造化ログ出力
- エラートラッキング
- パフォーマンスメトリクス

## 🔧 設定

### 環境設定
- 開発環境: `DEBUG=True`
- 本番環境: `DEBUG=False`
- ログレベル調整

### Firebase設定
- サービスアカウントキー設定
- プロジェクトID設定
- セキュリティルール設定

## 🤝 コントリビューション

1. Pydantic スキーマで型安全性を保つ
2. 非同期処理を活用する
3. 適切なHTTPステータスコードを返す
4. エラーハンドリングを徹底する
5. APIドキュメントを自動生成する

## 📚 参考資料

- [FastAPI ドキュメント](https://fastapi.tiangolo.com/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [OpenAI API ドキュメント](https://platform.openai.com/docs/api-reference)
- [Pydantic ドキュメント](https://docs.pydantic.dev/)
- [Poetry ドキュメント](https://python-poetry.org/docs/)

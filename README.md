# AI Vocab - AI英単語学習アプリケーション

AI Vocabは、AI技術を活用した現代的な英単語学習プラットフォームです。ユーザーは単語帳を作成し、AIが生成する詳細な定義、例文、発音情報を使って効率的に英語学習を行うことができます。

![AI Vocab](./docs/images/app-preview.png)

## 🚀 主な機能

### 📚 単語帳管理
- **マイ単語帳**: 個人用の単語帳を作成・編集・削除
- **公開単語帳**: 他のユーザーが作成した単語帳を閲覧・複製
- **権限制御**: 所有者のみが編集可能、閲覧者は複製のみ可能

### 🤖 AI機能
- **自動定義生成**: AIが英単語の詳細な定義を自動生成
- **例文作成**: 実践的な例文を自動生成
- **発音情報**: 音声付きの発音ガイド
- **類義語検索**: 関連する単語の提案

### 📱 ユーザーエクスペリエンス
- **レスポンシブデザイン**: PC・タブレット・スマートフォン対応
- **直感的UI**: ドロップダウンメニュー、アコーディオン表示
- **リアルタイム更新**: 即座に反映される編集・削除操作
- **Firebase認証**: 安全なユーザー認証システム

## 🏗️ アーキテクチャ

### システム構成
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │ Dictionary      │
│   (Next.js)     │◄──►│   (FastAPI)     │◄──►│   Builder       │
│                 │    │                 │    │   (Python)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Firebase      │    │   OpenAI API    │    │   WordNet       │
│   Auth/DB       │    │                 │    │   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 技術スタック

#### フロントエンド
- **Next.js 15**: React フレームワーク
- **TypeScript**: 型安全性
- **Tailwind CSS**: ユーティリティファーストCSS
- **React Icons**: アイコンライブラリ
- **Zustand**: 状態管理
- **Firebase SDK**: 認証・データベース

#### バックエンド
- **FastAPI**: Python Webフレームワーク
- **Python 3.13**: プログラミング言語
- **Firebase Admin**: サーバーサイド Firebase SDK
- **OpenAI API**: AI機能
- **Poetry**: 依存関係管理

#### 辞書ビルダー
- **Python 3.13**: データ処理
- **NLTK**: 自然言語処理
- **WordNet**: 英語辞書データベース
- **Firebase Admin**: データベース操作

## 🚀 クイックスタート

### 前提条件
- Docker & Docker Compose
- Node.js 18+ (開発時)
- Python 3.13+ (開発時)

### 環境構築

1. **リポジトリのクローン**
```bash
git clone https://github.com/e235750/ai-vocab.git
cd ai-vocab
```

2. **環境変数の設定**
```bash
# Frontend環境変数
cp frontend/.env.example frontend/.env.local

# Backend環境変数
cp backend/.env.example backend/.env

# Dictionary Builder環境変数
cp dictionary_builder/.env.example dictionary_builder/.env
```

3. **Docker Composeで起動**
```bash
# 開発環境
docker-compose up -d

# 本番環境
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

4. **アクセス**
- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:8000
- API ドキュメント: http://localhost:8000/docs

### 開発環境セットアップ

詳細な開発環境のセットアップについては、各ディレクトリのREADME.mdを参照してください：

- [Frontend開発ガイド](./frontend/README.md)
- [Backend開発ガイド](./backend/README.md)
- [Dictionary Builder ガイド](./dictionary_builder/README.md)

## 📁 プロジェクト構造

```
ai-vocab/
├── frontend/                 # Next.js フロントエンドアプリケーション
│   ├── src/
│   │   ├── app/             # App Router ページ
│   │   ├── components/       # React コンポーネント
│   │   ├── hooks/           # カスタムフック
│   │   ├── lib/             # ユーティリティ・API
│   │   ├── stores/          # Zustand 状態管理
│   │   └── types/           # TypeScript 型定義
│   └── public/              # 静的ファイル
├── backend/                  # FastAPI バックエンドAPI
│   ├── app/
│   │   ├── api/             # API エンドポイント
│   │   ├── core/            # 設定・認証
│   │   ├── schemas/         # Pydantic スキーマ
│   │   └── services/        # ビジネスロジック
│   └── pyproject.toml       # Python 依存関係
├── dictionary_builder/       # 辞書データ構築ツール
│   ├── parsers/             # データパーサー
│   ├── data/                # 辞書データ
│   └── build_database.py    # データベース構築スクリプト
├── docker-compose.yml       # Docker 開発環境
├── docker-compose.prod.yml  # Docker 本番環境
└── README.md               # このファイル
```

## 🎯 主要機能詳細

### ドロップダウンメニューシステム
- **統一されたUI**: 全てのコンポーネントで一貫したドロップダウンメニュー
- **権限ベース制御**: owner/public/readonly の3段階権限
- **カスタムフック**: `useMenuItems` によるメニューアイテム管理
- **型安全性**: TypeScript による完全な型チェック

### 権限管理
- **Owner**: 編集・削除・複製・閲覧が可能
- **Public**: 複製・閲覧のみ可能
- **Readonly**: 閲覧のみ可能

### 状態管理
- **Zustand**: 軽量で直感的な状態管理
- **Firebase連携**: リアルタイムデータ同期
- **ローカル状態**: コンポーネントレベルの状態管理

## 🤝 コントリビューション

1. Forkしてブランチを作成
2. 変更を実装
3. テストを実行
4. Pull Requestを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 👨‍💻 開発者

- **Yuri Kuniyoshi** - *初期開発* - [e235750](https://github.com/e235750)

## 🙏 謝辞

- OpenAI for GPT API
- Firebase for backend services
- WordNet for dictionary data
- Next.js and React communities

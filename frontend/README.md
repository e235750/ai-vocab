# Frontend - WordWise

WordWiseのNext.js フロントエンドアプリケーションです。モダンなReact技術スタックを使用して、直感的で響応性の高いユーザーインターフェースを提供します。

## 🛠️ 技術スタック

### 主要技術
- **Next.js 15**: React フレームワーク（App Router使用）
- **TypeScript**: 型安全なJavaScript
- **Tailwind CSS**: ユーティリティファーストCSS フレームワーク
- **React 19**: UIライブラリ

### 主要ライブラリ
- **Firebase**: 認証・データベース
- **Zustand**: 軽量状態管理
- **React Icons**: SVGアイコンコンポーネント
- **Tailwind Merge**: クラス名の最適化

### 開発ツール
- **ESLint**: コード品質チェック
- **TypeScript Compiler**: 型チェック

## 📁 プロジェクト構造

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # 認証ページグループ
│   │   │   ├── sign-in/       # サインインページ
│   │   │   └── sign-up/       # サインアップページ
│   │   ├── (main)/            # メインアプリケーション
│   │   │   ├── word-list/     # 単語リストページ
│   │   │   └── wordbooks/     # 単語帳ページ
│   │   ├── api/               # API Routes
│   │   ├── globals.css        # グローバルスタイル
│   │   └── layout.tsx         # ルートレイアウト
│   ├── components/            # Reactコンポーネント
│   │   ├── cardForm/          # カード作成・編集フォーム
│   │   ├── forms/             # 認証フォーム
│   │   ├── wordBook/          # 単語帳関連コンポーネント
│   │   ├── CardViewer.tsx     # カード表示コンポーネント
│   │   ├── DropdownMenu.tsx   # ドロップダウンメニュー
│   │   ├── Header.tsx         # ヘッダーコンポーネント
│   │   ├── Loading.tsx        # ローディング表示
│   │   ├── WordItem.tsx       # 単語アイテム
│   │   └── WordList.tsx       # 単語リスト
│   ├── constants/             # 定数定義
│   │   └── menuItems.tsx      # メニューアイテム定数
│   ├── hooks/                 # カスタムフック
│   │   ├── useAuth.ts         # 認証フック
│   │   ├── useMenuItems.ts    # メニューアイテムフック
│   │   └── useMenus.ts        # メニュー制御フック
│   ├── lib/                   # ユーティリティ・ライブラリ
│   │   ├── api/               # API関連
│   │   └── firebase/          # Firebase設定
│   ├── stores/                # Zustand状態管理
│   │   ├── bookmarkStore.ts   # ブックマーク状態
│   │   └── deckStore.ts       # 単語帳状態
│   └── types/                 # TypeScript型定義
│       └── index.ts           # メイン型定義
├── public/                    # 静的ファイル
│   └── img/                   # 画像ファイル
├── Dockerfile                 # Docker設定
├── next.config.ts             # Next.js設定
├── package.json               # npm依存関係
├── tailwind.config.js         # Tailwind CSS設定
└── tsconfig.json             # TypeScript設定
```

## 🚀 開発環境セットアップ

### 前提条件
- Node.js 18以上
- npm または yarn

### インストール

```bash
# 依存関係のインストール
npm install

# または
yarn install
```

### 環境変数設定

`.env.local` ファイルを作成し、以下の環境変数を設定してください：

```bash
# Firebase設定
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# API設定
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### 開発サーバー起動

```bash
# 開発サーバー開始
npm run dev

# または
yarn dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認してください。

## 🏗️ アーキテクチャ

### 状態管理パターン

#### Zustand Store
- **deckStore**: 単語帳の状態管理
- **bookmarkStore**: ブックマークの状態管理

#### カスタムフック
- **useAuth**: Firebase認証の管理
- **useMenuItems**: 権限ベースメニューアイテム生成
- **useMenus**: メニュー制御ロジック

### コンポーネント設計

#### 権限制御システム
```typescript
type PermissionLevel = 'owner' | 'public' | 'readonly'

// 権限レベルに基づくメニューアイテム生成
const menuItems = useMenuItems({
  permission: 'owner', // または 'public', 'readonly'
  onEdit: handleEdit,
  onDelete: handleDelete,
})
```

#### ドロップダウンメニューシステム
- **統一されたAPI**: 全コンポーネントで共通のDropdownMenuコンポーネント
- **権限ベース制御**: PermissionLevelに基づく表示制御
- **型安全性**: TypeScriptによる完全な型チェック

### ルーティング構造

```
/                          # ホームページ
├── /sign-in              # サインイン
├── /sign-up              # サインアップ
├── /word-list/[id]       # 特定の単語帳の単語リスト
└── /wordbooks            # 単語帳一覧
    ├── /my               # マイ単語帳
    └── /public           # 公開単語帳
```

## 🧪 テスト

```bash
# Lintチェック
npm run lint

# 型チェック
npx tsc --noEmit
```

## 🐳 Docker

### 開発環境
```bash
# Dockerコンテナでの開発
docker-compose up frontend
```

### 本番ビルド
```bash
# 本番用ビルド
npm run build

# 本番サーバー起動
npm start
```

## 📊 パフォーマンス最適化

### 実装済み最適化
- **動的インポート**: 必要時のみコンポーネント読み込み
- **useMemo/useCallback**: 不要な再レンダリング防止
- **画像最適化**: Next.js Image コンポーネント使用
- **コード分割**: App Routerによる自動コード分割

### 推奨事項
- Bundle Analyzer を使用してバンドルサイズを監視
- Core Web Vitals の定期的な測定
- Lighthouse スコアの改善

## 🔧 カスタマイズ

### テーマ設定
Tailwind CSS の設定は `tailwind.config.js` で変更できます。

### アイコン
React Icons ライブラリから必要なアイコンを選択して使用してください。

## 🤝 コントリビューション

1. コンポーネントは再利用可能な設計にする
2. TypeScript の型定義を必ず追加する
3. Tailwind CSS のユーティリティクラスを使用する
4. カスタムフックでロジックを分離する
5. 権限制御を適切に実装する

## 📚 参考資料

- [Next.js ドキュメント](https://nextjs.org/docs)
- [React ドキュメント](https://react.dev/)
- [TypeScript ドキュメント](https://www.typescriptlang.org/docs/)
- [Tailwind CSS ドキュメント](https://tailwindcss.com/docs)
- [Firebase ドキュメント](https://firebase.google.com/docs)

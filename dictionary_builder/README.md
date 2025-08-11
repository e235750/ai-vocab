# Dictionary Builder

WordWiseプロジェクトの辞書データベース構築ツールです。WordNetや補足データから英語辞書データを生成・処理します。

## 🎯 概要

Dictionary Builderは、以下のデータソースから包括的な英語辞書データベースを構築します：

- **WordNet**: 英語の語彙データベース（Princeton University）
- **補足データ**: 追加の語彙・定義情報
- **カスタムデータ**: プロジェクト固有の語彙データ

## 🛠️ 技術スタック

### 主要技術

- **Python 3.13**: プログラミング言語
- **Poetry**: 依存関係管理・パッケージング
- **SQLite**: 軽量データベース（開発・テスト用）
- **PostgreSQL**: 本番データベース

### 主要ライブラリ

- **NLTK**: 自然言語処理ライブラリ（WordNet アクセス）
- **Pandas**: データ処理・操作
- **SQLAlchemy**: データベースORM
- **Click**: コマンドラインインターフェース
- **Pydantic**: データ検証・設定管理

## 📁 プロジェクト構造

```text
dictionary_builder/
├── build_database.py       # メインスクリプト
├── pyproject.toml          # Poetry設定
├── Dockerfile              # Docker設定
├── README.md              # このファイル
├── data/                  # データファイル
│   └── raw/               # 生データ
│       └── supplement.tsv # 補足データ（TSV形式）
└── parsers/               # データパーサー
    ├── __init__.py
    ├── supplement_parser.py # 補足データパーサー
    └── wordnet_parser.py    # WordNetパーサー
```

## 🚀 セットアップ・使用方法

### インストール

```bash
# Poetry環境セットアップ
cd dictionary_builder
poetry install

# 仮想環境の有効化
poetry shell

# NLTKデータダウンロード（初回のみ）
python -c "import nltk; nltk.download('wordnet'); nltk.download('omw-1.4')"
```

### データベース構築

#### 基本的な使用方法

```bash
# 全データから辞書データベース構築
python build_database.py

# 特定のデータソースのみ
python build_database.py --source wordnet
python build_database.py --source supplement

# 出力先指定
python build_database.py --output ./dictionary.db

# ログレベル設定
python build_database.py --log-level DEBUG
```

#### コマンドラインオプション

```bash
# 使用可能なオプション表示
python build_database.py --help
```

```text
Usage: build_database.py [OPTIONS]

Options:
  --source [wordnet|supplement|all]  データソース選択 [default: all]
  --output PATH                      出力データベースパス [default: dictionary.db]
  --log-level [DEBUG|INFO|WARNING|ERROR]  ログレベル [default: INFO]
  --clean                           既存データベースを削除してから構築
  --batch-size INTEGER              バッチ処理サイズ [default: 1000]
  --help                            ヘルプ表示
```

### Docker実行

```bash
# Dockerでデータベース構築
docker-compose run dictionary-builder

# 特定オプション付きで実行
docker-compose run dictionary-builder python build_database.py --source wordnet --clean
```

## 📊 データ構造

### WordNetデータ

```python
{
    "word": "example",
    "pos": "noun",  # 品詞（noun, verb, adjective, adverb）
    "definitions": [
        {
            "definition": "a representative form or pattern",
            "examples": ["This is an example sentence."]
        }
    ],
    "synonyms": ["sample", "instance", "illustration"],
    "hypernyms": ["representation"],  # 上位概念
    "hyponyms": ["case", "precedent"]  # 下位概念
}
```

### 補足データ形式

TSVファイル（`data/raw/supplement.tsv`）:

```tsv
word	pos	definition	japanese	examples	synonyms
example	noun	a representative form	例、実例	This is an example.	sample,instance
study	verb	to learn about something	勉強する	I study English.	learn,examine
```

### データベーススキーマ

```sql
-- 単語テーブル
CREATE TABLE words (
    id INTEGER PRIMARY KEY,
    word VARCHAR(100) NOT NULL,
    pos VARCHAR(20) NOT NULL,
    frequency_rank INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 定義テーブル
CREATE TABLE definitions (
    id INTEGER PRIMARY KEY,
    word_id INTEGER REFERENCES words(id),
    definition TEXT NOT NULL,
    japanese TEXT,
    source VARCHAR(50) NOT NULL
);

-- 例文テーブル
CREATE TABLE examples (
    id INTEGER PRIMARY KEY,
    definition_id INTEGER REFERENCES definitions(id),
    english TEXT NOT NULL,
    japanese TEXT
);

-- 同義語テーブル
CREATE TABLE synonyms (
    id INTEGER PRIMARY KEY,
    word_id INTEGER REFERENCES words(id),
    synonym VARCHAR(100) NOT NULL
);
```

## 🔧 カスタマイズ

### 新しいデータソース追加

1. `parsers/` ディレクトリに新しいパーサーを作成

```python
# parsers/custom_parser.py
from typing import List, Dict, Any

def parse_custom_data(file_path: str) -> List[Dict[str, Any]]:
    """カスタムデータファイルを解析"""
    words = []
    # パースロジック実装
    return words
```

2. `build_database.py` にパーサーを統合

```python
from parsers.custom_parser import parse_custom_data

# データソース追加
if source in ['custom', 'all']:
    custom_words = parse_custom_data('data/raw/custom.json')
    process_words(custom_words)
```

### データ処理カスタマイズ

```python
# 独自の前処理ロジック
def preprocess_word(word_data: Dict[str, Any]) -> Dict[str, Any]:
    """単語データの前処理"""
    # 正規化
    word_data['word'] = word_data['word'].lower().strip()
    
    # フィルタリング
    if len(word_data['word']) < 2:
        return None
    
    return word_data

# 後処理ロジック
def postprocess_database(db_path: str):
    """データベースの後処理"""
    # インデックス作成
    # 統計情報更新
    # データ品質チェック
    pass
```

## 📈 パフォーマンス

### 最適化設定

```python
# バッチ処理サイズ調整
BATCH_SIZE = 1000  # メモリ使用量に応じて調整

# データベース最適化
def optimize_database():
    """データベースの最適化"""
    # インデックス作成
    # 統計情報更新
    # VACUUM実行
```

### 処理時間目安

- **WordNet全体**: 約15-30分（約147,000語）
- **補足データ**: 約5-10分（データサイズ依存）
- **インデックス作成**: 約5分

## 🧪 テスト・品質管理

### テストデータ作成

```bash
# テスト用小規模データベース作成
python build_database.py --source supplement --output test.db --batch-size 100
```

### データ品質チェック

```python
# データ品質検証スクリプト
def validate_data_quality(db_path: str):
    """データベースの品質チェック"""
    # 重複データチェック
    # NULL値チェック
    # データ型チェック
    # 外部キー整合性チェック
```

## 🐳 Docker

### 開発環境

```bash
# 開発用コンテナ実行
docker-compose run --rm dictionary-builder bash

# 対話的にデータベース構築
docker-compose run --rm dictionary-builder python -c "
from build_database import main
main()
"
```

### 本番環境

```dockerfile
# 本番用Dockerイメージ
FROM python:3.13-slim

WORKDIR /app
COPY . .

RUN pip install poetry && \
    poetry config virtualenvs.create false && \
    poetry install --no-dev

# NLTKデータダウンロード
RUN python -c "import nltk; nltk.download('wordnet'); nltk.download('omw-1.4')"

CMD ["python", "build_database.py"]
```

## 📚 データソース詳細

### WordNet

- **提供元**: Princeton University
- **ライセンス**: WordNet License（自由使用可能）
- **内容**: 約147,000の英語語彙
- **特徴**: 意味的関係性（同義語、上位・下位概念）

### 補足データ

- **形式**: TSV（Tab-Separated Values）
- **内容**: 日本語翻訳、追加例文、発音情報
- **用途**: WordNetデータの補完・拡張
- **データソース**: [supplement.tsv](https://dbmx.net/dict/supplement.tsv)

## 🤝 コントリビューション

### データ追加

1. 適切な形式でデータファイルを準備
2. 対応するパーサーを作成
3. テストデータで動作確認
4. プルリクエスト作成

### パフォーマンス改善

- バッチ処理サイズの最適化
- データベーススキーマの改善
- インデックス戦略の最適化
- メモリ使用量の削減

## 🔍 トラブルシューティング

### よくある問題

#### NLTKデータが見つからない

```bash
# 解決方法
python -c "import nltk; nltk.download('wordnet')"
```

#### メモリ不足

```bash
# バッチサイズを小さくする
python build_database.py --batch-size 500
```

#### データベースロックエラー

```bash
# クリーンビルド実行
python build_database.py --clean
```

## 📖 参考資料

- [WordNet](https://wordnet.princeton.edu/)
- [NLTK Documentation](https://www.nltk.org/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Pandas Documentation](https://pandas.pydata.org/docs/)
- [Poetry Documentation](https://python-poetry.org/docs/)

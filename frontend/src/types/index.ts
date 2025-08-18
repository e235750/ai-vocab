// 検索クエリ用インターフェース
export interface SearchQuery {
  q?: string;
  is_public?: boolean;
  is_owned?: boolean;
  min_words?: number;
  sort_by?: string; // 例: "created_at"
  sort_order?: string; // 例: "desc"
  page?: number;
  limit?: number;
}
// 意味の型定義
export interface Definition {
  part_of_speech: string
  japanese: string[]
}

// 例文の型定義
export interface ExampleSentence {
  english: string
  japanese: string
}

// 発音情報の型定義
export interface Phonetics {
  text?: string
  audio?: string
  sourceUrl?: string
}

export const partOfSpeechOptions = [
  '名詞',
  '動詞',
  '形容詞',
  '副詞',
  '代名詞',
  '前置詞',
  '接続詞',
  '感動詞',
]

// 新規単語カードの型定義
export interface NewCard {
  english: string
  definitions: Definition[]
  synonyms?: string[]
  example_sentences?: ExampleSentence[]
  phonetics?: Phonetics
  wordbook_id: string
}
// 単語カードの型定義
export interface Card {
  id: string
  english: string
  definitions: Definition[]
  synonyms?: string[]
  example_sentences?: ExampleSentence[]
  phonetics?: Phonetics
  wordbook_id: string
  created_at: string
  updated_at: string
}

// 単語帳のデータ型定義
export interface DeckData {
  name: string
  description?: string
  is_public: boolean
  num_words: number
  user_name?: string
}

// 単語帳の型定義
export interface Deck {
  id: string
  name: string
  is_public: boolean
  num_words: number
  description?: string
  created_at: string
  updated_at: string
  user_name?: string
}

// 検索用の単語帳型定義（Deckのエイリアス）
export type WordBook = Deck

// ブックマークの型定義
export interface Bookmark {
  id: string
  card_id: string
  user_id: string
  created_at: string
}

// 新規ブックマークの型定義
export interface NewBookmark {
  card_id: string
}
// 権限レベルの定義
export type PermissionLevel = 'owner' | 'public' | 'readonly'

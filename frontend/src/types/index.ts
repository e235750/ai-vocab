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
}

// 単語帳の型定義
// "id": "wordbook123",
// "name": "英単語帳",
// "is_public": True,
// "num_words": 50,
// "description": "英語の単語を学ぶための単語帳",
// "created_at": datetime(2023, 10, 1, 12, 0, 0),
// "updated_at": datetime(2023, 10, 1, 12, 0, 0)
export interface Deck {
  id: string
  name: string
  is_public: boolean
  num_words: number
  description?: string
  created_at: string
  updated_at: string
}

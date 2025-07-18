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
export interface Deck {
  id: string
  name: string
  cards: { id: string; word: string; definition: string }[]
}

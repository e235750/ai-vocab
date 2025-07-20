import { create } from 'zustand'
import { Deck, Card } from '@/types'
import { getOwnedWordbooks, getWordsInWordbook } from '@/lib/api/db'

export interface DeckState {
  decks: Deck[]
  cachedCards: Record<string, Card[]>
  selectedDeckId: string
  currentCardIndexes: Record<string, number>
  loading: boolean
  error: string | null
}

export interface DeckActions {
  setDecks: (decks: Deck[]) => void
  setWordsInDeck: (deckId: string, cards: Card[]) => void
  addCardToCache: (deckId: string, card: Card) => void
  selectDeck: (deckId: string) => void
  navigateCard: (newIndex: number) => void
  reset: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  fetchDecks: (idToken: string) => Promise<Deck[]>
  fetchWordsInDeck: (deckId: string, idToken: string) => Promise<Card[]>
  initializeDeckData: (
    deckId: string,
    idToken: string
  ) => Promise<{ words: Card[]; deckName: string }>
}

type DeckStore = DeckState & DeckActions

// 4. 初期状態を定義
const initialState: DeckState = {
  decks: [],
  cachedCards: {},
  selectedDeckId: '',
  currentCardIndexes: {},
  loading: false,
  error: null,
}

export const useDeckStore = create<DeckStore>((set, get) => ({
  ...initialState,

  /**
   * デッキのリストをstateに保存する
   */
  setDecks: (decks) => {
    set({ decks })
  },

  /**
   * 特定のデッキのカードリストをキャッシュに保存する
   */
  setWordsInDeck: (deckId, cards) => {
    set((state) => ({
      cachedCards: { ...state.cachedCards, [deckId]: cards },
    }))
  },

  /**
   * 新しいカードをキャッシュに追加する
   */
  addCardToCache: (deckId, card) => {
    set((state) => ({
      cachedCards: {
        ...state.cachedCards,
        [deckId]: [...(state.cachedCards[deckId] || []), card],
      },
    }))
  },

  /**
   * 単語帳を選択する（IDをセットするだけ）
   */
  selectDeck: (deckId) => {
    set({ selectedDeckId: deckId })
  },

  /**
   * カードの表示位置を更新する
   */
  navigateCard: (newIndex) => {
    const { selectedDeckId } = get()
    if (!selectedDeckId) return
    set((state) => ({
      currentCardIndexes: {
        ...state.currentCardIndexes,
        [selectedDeckId]: newIndex,
      },
    }))
  },

  /**
   * 状態を初期値にリセットする
   */
  reset: () => {
    set(initialState)
  },

  /**
   * ローディング状態を設定する
   */
  setLoading: (loading) => {
    set({ loading })
  },

  /**
   * エラー状態を設定する
   */
  setError: (error) => {
    set({ error })
  },

  /**
   * ユーザーの単語帳を取得する
   */
  fetchDecks: async (idToken) => {
    const { setLoading, setError } = get()
    try {
      setLoading(true)
      setError(null)
      const fetchedDecks = await getOwnedWordbooks(idToken)
      set({ decks: fetchedDecks })
      return fetchedDecks
    } catch (error) {
      console.error('Error fetching decks:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'デッキの取得に失敗しました'
      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  },

  /**
   * 特定のデッキの単語を取得する
   */
  fetchWordsInDeck: async (deckId, idToken) => {
    const { setLoading, setError, setWordsInDeck } = get()
    try {
      setLoading(true)
      setError(null)
      const result = await getWordsInWordbook(deckId, idToken)

      if (result.error) {
        setError(result.error)
        throw new Error(result.error)
      }
      const fetchedWords = result || []
      setWordsInDeck(deckId, fetchedWords)
      return fetchedWords
    } catch (error) {
      console.error('Error fetching words:', error)
      const errorMessage =
        error instanceof Error ? error.message : '単語の取得に失敗しました'
      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  },

  /**
   * デッキデータを初期化する（デッキ情報と単語の両方を取得）
   */
  initializeDeckData: async (deckId, idToken) => {
    const { decks, cachedCards, fetchDecks, fetchWordsInDeck, selectDeck } =
      get()

    try {
      set({ loading: true, error: null })

      // デッキを選択
      selectDeck(deckId)

      // デッキ情報が空の場合は取得
      let currentDecks = decks
      if (decks.length === 0) {
        currentDecks = await fetchDecks(idToken)
      }

      // デッキ名を取得
      const deck = currentDecks.find((d) => d.id === deckId)
      const deckName = deck?.name || ''

      // キャッシュから単語を取得
      let words = cachedCards[deckId]
      if (!words) {
        words = await fetchWordsInDeck(deckId, idToken)
      }

      return { words, deckName }
    } catch (error) {
      console.error('Error initializing deck data:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'データの初期化に失敗しました'
      set({ error: errorMessage })
      throw error
    } finally {
      set({ loading: false })
    }
  },
}))

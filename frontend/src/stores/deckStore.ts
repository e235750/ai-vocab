import { create } from 'zustand'
import { Deck, Card, DeckData } from '@/types'
import {
  getOwnedWordbooks,
  getPublicWordbooks,
  getWordsInWordbook,
  deleteWordbook,
  updateWordbook,
  duplicateWordbook,
  addWordbook,
} from '@/lib/api/db'

export interface DeckState {
  decks: Deck[]
  publicDecks: Deck[]
  allDecks: Deck[]
  cachedCards: Record<string, Card[]>
  selectedDeckId: string
  currentCardIndexes: Record<string, number>
  loading: boolean
  error: string | null
  lastFetchTime: number | null
}

export interface DeckActions {
  setDecks: (decks: Deck[]) => void
  setPublicDecks: (decks: Deck[]) => void
  setAllDecks: (decks: Deck[]) => void
  setWordsInDeck: (deckId: string, cards: Card[]) => void
  addCardToCache: (deckId: string, card: Card) => void
  selectDeck: (deckId: string) => void
  navigateCard: (newIndex: number) => void
  reset: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  fetchDecks: (idToken: string) => Promise<Deck[]>
  fetchPublicDecks: (idToken: string) => Promise<Deck[]>
  fetchAllDecks: (idToken: string) => Promise<{ owned: Deck[]; public: Deck[] }>
  fetchWordsInDeck: (deckId: string, idToken: string) => Promise<Card[]>
  createDeck: (data: DeckData, idToken: string) => Promise<void>
  deleteDeck: (deckId: string, idToken: string) => Promise<void>
  updateDeck: (deckId: string, data: DeckData, idToken: string) => Promise<void>
  duplicateDeck: (
    deckId: string,
    data: DeckData,
    idToken: string
  ) => Promise<void>
  initializeDeckData: (
    deckId: string,
    idToken: string
  ) => Promise<{ words: Card[]; deckName: string }>
}

type DeckStore = DeckState & DeckActions

// 初期状態を定義
const initialState: DeckState = {
  decks: [],
  publicDecks: [],
  allDecks: [],
  cachedCards: {},
  selectedDeckId: '',
  currentCardIndexes: {},
  loading: false,
  error: null,
  lastFetchTime: null,
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
   * 公開デッキのリストをstateに保存する
   */
  setPublicDecks: (decks) => {
    set({ publicDecks: decks })
  },

  /**
   * 全てのデッキ（自分の＋公開）のリストをstateに保存する
   */
  setAllDecks: (decks) => {
    set({ allDecks: decks })
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
      const result = await getOwnedWordbooks(idToken)

      if (result.error) {
        setError(result.error)
        throw new Error(result.error)
      }

      // result is the data directly when successful
      const fetchedDecks = result || []
      set({ decks: fetchedDecks, lastFetchTime: Date.now() })
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
   * 公開単語帳を取得する
   */
  fetchPublicDecks: async (idToken) => {
    const { setLoading, setError } = get()
    try {
      setLoading(true)
      setError(null)
      const result = await getPublicWordbooks(idToken)

      if (result.error) {
        setError(result.error)
        throw new Error(result.error)
      }

      // result is the data directly when successful
      const fetchedDecks = result || []
      set({ publicDecks: fetchedDecks, lastFetchTime: Date.now() })
      return fetchedDecks
    } catch (error) {
      console.error('Error fetching public decks:', error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : '公開デッキの取得に失敗しました'
      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  },

  /**
   * 自分の単語帳と公開単語帳を並行して取得する
   */
  fetchAllDecks: async (idToken) => {
    const { setLoading, setError, lastFetchTime, allDecks } = get()

    // キャッシュの有効期限（5分）
    const CACHE_DURATION = 5 * 60 * 1000
    const now = Date.now()

    // キャッシュが有効な場合はスキップ
    if (
      lastFetchTime &&
      now - lastFetchTime < CACHE_DURATION &&
      allDecks.length > 0
    ) {
      const { decks, publicDecks } = get()
      return { owned: decks, public: publicDecks }
    }

    try {
      setLoading(true)
      setError(null)

      const [ownedResult, publicResult] = await Promise.all([
        getOwnedWordbooks(idToken),
        getPublicWordbooks(idToken),
      ])

      const ownedDecks = !ownedResult.error ? ownedResult : []
      const publicDecks = !publicResult.error ? publicResult : []
      const allDecks = [...ownedDecks, ...publicDecks]

      set({
        decks: ownedDecks,
        publicDecks,
        allDecks,
        lastFetchTime: Date.now(),
      })

      return { owned: ownedDecks, public: publicDecks }
    } catch (error) {
      console.error('Error fetching all decks:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'デッキの取得に失敗しました'
      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  },

  /**
   * 単語帳を削除する
   */
  deleteDeck: async (deckId, idToken) => {
    const { setLoading, setError } = get()
    try {
      setLoading(true)
      setError(null)
      await deleteWordbook(deckId, idToken)

      // ローカル状態からも削除
      set((state) => ({
        decks: state.decks.filter((deck) => deck.id !== deckId),
        allDecks: state.allDecks.filter((deck) => deck.id !== deckId),
        cachedCards: Object.fromEntries(
          Object.entries(state.cachedCards).filter(([key]) => key !== deckId)
        ),
      }))
    } catch (error) {
      console.error('Error deleting deck:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'デッキの削除に失敗しました'
      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  },

  /**
   * 単語帳を作成する
   */
  createDeck: async (data, idToken) => {
    const { setLoading, setError, fetchDecks } = get()
    try {
      setLoading(true)
      setError(null)
      const result = await addWordbook(data, idToken)

      if (result.error) {
        setError(result.error)
        throw new Error(result.error)
      }

      // デッキリストを再取得して最新状態にする
      await fetchDecks(idToken)
    } catch (error) {
      console.error('Error creating deck:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'デッキの作成に失敗しました'
      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  },

  /**
   * 単語帳を更新する
   */
  updateDeck: async (deckId, data, idToken) => {
    const { setLoading, setError } = get()
    try {
      setLoading(true)
      setError(null)
      await updateWordbook(deckId, data, idToken)

      // ローカル状態も更新
      set((state) => ({
        decks: state.decks.map((deck) =>
          deck.id === deckId ? { ...deck, ...data } : deck
        ),
        allDecks: state.allDecks.map((deck) =>
          deck.id === deckId ? { ...deck, ...data } : deck
        ),
      }))
    } catch (error) {
      console.error('Error updating deck:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'デッキの更新に失敗しました'
      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  },

  /**
   * 単語帳を複製する
   */
  duplicateDeck: async (deckId, data, idToken) => {
    const { setLoading, setError, fetchDecks } = get()
    try {
      setLoading(true)
      setError(null)
      await duplicateWordbook(deckId, data, idToken)

      // デッキリストを再取得して最新状態にする
      await fetchDecks(idToken)
    } catch (error) {
      console.error('Error duplicating deck:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'デッキの複製に失敗しました'
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

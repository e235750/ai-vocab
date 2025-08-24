import DeckItem from './DeckItem'
import Loading from '@/components/Loading'
import { Deck } from '@/types'

type DeckListProps = {
  decks: Deck[]
  selectedDeckId: string
  isFetchingDecks: boolean
  onSelectDeck: (id: string) => void
  openCreateDeckModal: () => void
  onWordbookDeleted?: (wordbookId: string) => void
  onWordbookEdit?: (deck: Deck) => void
  onWordbookDuplicate?: (deck: Deck) => void
}

export default function DeckList({
  decks,
  selectedDeckId,
  isFetchingDecks,
  onSelectDeck,
  openCreateDeckModal,
  onWordbookDeleted,
  onWordbookEdit,
  onWordbookDuplicate,
}: DeckListProps) {
  const handleDelete = async (deckId: string) => {
    try {
      if (onWordbookDeleted) {
        onWordbookDeleted(deckId)
      }
    } catch (error) {
      console.error('単語帳の削除に失敗しました:', error)
      alert('単語帳の削除に失敗しました。')
    }
  }

  const handleEdit = (deck: Deck) => {
    if (onWordbookEdit) {
      onWordbookEdit(deck)
    }
  }

  const handleDuplicate = (deck: Deck) => {
    if (onWordbookDuplicate) {
      onWordbookDuplicate(deck)
    }
  }
  return (
    <section className="p-6 bg-white dark:bg-[#23272f] border border-gray-300 dark:border-gray-700 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-600 dark:text-gray-300">
          単語帳一覧
        </h2>
        <button
          className="px-4 py-1.5 font-semibold bg-white dark:bg-[#23272f] border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100"
          onClick={openCreateDeckModal}
        >
          新規作成
        </button>
      </div>

      {/* 状態に応じて表示を切り替えるコンテナ */}
      <div className="min-h-[100px] flex flex-col justify-center">
        {isFetchingDecks ? (
          // ローディング中の表示
          <Loading
            className="h-10 w-60 m-auto pl-10"
            message="読み込み中..."
            svgClassName="h-12 w-12"
            textClassName="text-xl w-full"
          />
        ) : decks.length === 0 ? (
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              単語帳がありません。
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              「新規作成」ボタンから新しい単語帳を作成してください。
            </p>
          </div>
        ) : (
          // 単語帳リストの表示
          <ul className="flex flex-col gap-2.5">
            {decks.map((deck) => (
              <DeckItem
                key={deck.id}
                deck={deck}
                isActive={deck.id === selectedDeckId}
                onSelect={onSelectDeck}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

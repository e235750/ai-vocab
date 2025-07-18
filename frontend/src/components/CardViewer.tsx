import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'
import { Card } from '@/types'

type CardViewerProps = {
  deckName: string
  cards: Card[]
  totalCards: number
  currentIndex: number
  isCreatingCard: boolean
  onNavigate: (newIndex: number) => void
  setIsCreatingCard: (isCreating: boolean) => void
}

export default function CardViewer({
  deckName,
  cards,
  totalCards,
  currentIndex,
  isCreatingCard,
  onNavigate,
  setIsCreatingCard,
}: CardViewerProps) {
  const currentCard = cards[currentIndex]

  const handlePrev = () => {
    if (currentIndex > 0) onNavigate(currentIndex - 1)
  }

  const handleNext = () => {
    if (currentIndex < totalCards - 1) onNavigate(currentIndex + 1)
  }

  const handleCreateNewCard = () => {
    setIsCreatingCard(!isCreatingCard)
  }

  return (
    <section className="flex flex-col items-center p-6 bg-white border border-gray-300 rounded-xl">
      <h2 className="mb-4 text-base font-semibold text-gray-600">{deckName}</h2>
      <div className="flex items-center justify-center w-full h-[200px] mb-5 border border-gray-300 rounded-lg shadow-sm">
        <p className="text-2xl font-bold text-gray-500">
          {currentCard?.english || 'カードがありません'}
        </p>
      </div>
      <div className="flex items-center w-full gap-4 mb-5">
        <div className="flex items-center flex-grow gap-3">
          <input
            type="range"
            min="0"
            max={totalCards > 0 ? totalCards - 1 : 0}
            value={currentIndex}
            className="w-full cursor-pointer"
            readOnly
          />
          <span>
            {totalCards > 0 ? currentIndex + 1 : 0}/{totalCards}
          </span>
        </div>
        <button
          className="text-3xl text-gray-600 cursor-pointer"
          onClick={handlePrev}
          aria-label="Previous card"
          disabled={currentIndex === 0}
        >
          <FaArrowLeft />
        </button>
        <button
          className="text-3xl text-gray-600 cursor-pointer"
          onClick={handleNext}
          aria-label="Next card"
          disabled={currentIndex >= totalCards - 1}
        >
          <FaArrowRight />
        </button>
      </div>
      <div className="flex gap-3">
        <button className="px-6 py-2 text-base bg-white border border-gray-300 rounded-md hover:bg-gray-100">
          編集
        </button>
        <button
          className={`px-6 py-2 text-base border border-gray-300 rounded-md hover:bg-gray-100 ${
            isCreatingCard
              ? 'bg-indigo-50 border-indigo-400'
              : 'bg-white border-gray-300 hover:bg-gray-50'
          }`}
          onClick={handleCreateNewCard}
        >
          新規作成
        </button>
        <button className="px-6 py-2 text-base bg-white border border-gray-300 rounded-md hover:bg-gray-100">
          一覧
        </button>
      </div>
    </section>
  )
}

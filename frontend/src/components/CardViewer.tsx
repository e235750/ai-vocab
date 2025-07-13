import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'

type CardViewerProps = {
  deckName: string
  currentCard: {
    id: number
    word: string
  }
  totalCards: number
  currentIndex: number
  onNavigate: (newIndex: number) => void
}

export default function CardViewer({
  deckName,
  currentCard,
  totalCards,
  currentIndex,
  onNavigate,
}: CardViewerProps) {
  const handlePrev = () => {
    if (currentIndex > 0) onNavigate(currentIndex - 1)
  }

  const handleNext = () => {
    if (currentIndex < totalCards - 1) onNavigate(currentIndex + 1)
  }

  return (
    <section className="flex flex-col items-center p-6 bg-white border border-gray-300 rounded-xl">
      <h2 className="mb-4 text-base font-semibold text-gray-600">{deckName}</h2>
      <div className="flex items-center justify-center w-full h-[200px] mb-5 border border-gray-300 rounded-lg shadow-sm">
        <p className="text-5xl font-bold">
          {currentCard?.word || 'カードがありません'}
        </p>
      </div>
      <div className="flex items-center w-full gap-4 mb-5">
        <div className="flex items-center flex-grow gap-3">
          <input
            type="range"
            min="0"
            max={totalCards - 1}
            value={currentIndex}
            className="w-full cursor-pointer"
            readOnly
          />
          <span>
            {currentIndex + 1}/{totalCards}
          </span>
        </div>
        <button
          className="text-3xl text-gray-600 cursor-pointer material-symbols-outlined"
          onClick={handlePrev}
          aria-label="Previous card"
        >
          <FaArrowLeft />
        </button>
        <button
          className="text-3xl text-gray-600 cursor-pointer material-symbols-outlined"
          onClick={handleNext}
          aria-label="Next card"
        >
          <FaArrowRight />
        </button>
      </div>
      <div className="flex gap-3">
        <button className="px-6 py-2 text-base bg-white border border-gray-300 rounded-md hover:bg-gray-100">
          編集
        </button>
        <button className="px-6 py-2 text-base bg-white border border-gray-300 rounded-md hover:bg-gray-100">
          新規作成
        </button>
        <button className="px-6 py-2 text-base bg-white border border-gray-300 rounded-md hover:bg-gray-100">
          一覧
        </button>
      </div>
    </section>
  )
}

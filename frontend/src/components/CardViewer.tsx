import {
  FaArrowRight,
  FaArrowLeft,
  FaEdit,
  FaPlus,
  FaTrash,
  FaListUl,
} from 'react-icons/fa'
import { Card } from '@/types'
import Link from 'next/link'
import { useState } from 'react'
import AudioPlayButton from './AudioPlayButton'

type CardViewerProps = {
  deckName: string
  selectedDeckId: string
  cards: Card[]
  totalCards: number
  currentIndex: number
  isCreatingCard: boolean
  isUpdatingCard?: boolean
  onNavigate: (newIndex: number) => void
  setIsCreatingCard: (isCreating: boolean) => void
  setIsUpdatingCard: (isUpdating: boolean) => void
  onDeleteCard?: (cardId: string) => void
}

export default function CardViewer({
  deckName,
  selectedDeckId,
  cards,
  totalCards,
  currentIndex,
  isCreatingCard,
  isUpdatingCard,
  onNavigate,
  setIsCreatingCard,
  setIsUpdatingCard,
  onDeleteCard,
}: CardViewerProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const currentCard = cards[currentIndex]

  const handlePrev = () => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1)
      setIsFlipped(false) // カード切り替え時にフリップをリセット
    }
  }

  const handleNext = () => {
    if (currentIndex < totalCards - 1) {
      onNavigate(currentIndex + 1)
      setIsFlipped(false) // カード切り替え時にフリップをリセット
    }
  }

  const handleCreateNewCard = () => {
    setIsCreatingCard(!isCreatingCard)
  }

  const handleUpdateCard = () => {
    setIsUpdatingCard(!isUpdatingCard)
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIndex = parseInt(e.target.value)
    onNavigate(newIndex)
    setIsFlipped(false) // スライダー操作時にフリップをリセット
  }

  const handleCardClick = () => {
    setIsFlipped(!isFlipped)
  }

  const handleDeleteCard = () => {
    if (!currentCard || !onDeleteCard) return

    if (
      window.confirm(
        `「${currentCard.english}」を削除しますか？この操作は取り消せません。`
      )
    ) {
      onDeleteCard(currentCard.id)
    }
  }

  return (
    <section className="flex flex-col items-center p-6 bg-white border border-gray-300 rounded-xl">
      <h2 className="mb-4 text-base font-semibold text-gray-600">{deckName}</h2>

      {/* フリップカード */}
      <div
        className="relative w-full h-[300px] mb-5 perspective-1000 cursor-pointer"
        onClick={handleCardClick}
      >
        <div
          className={`absolute inset-0 w-full h-full transition-transform duration-300 transform-style-preserve-3d ${
            isFlipped ? 'rotate-x-180' : ''
          }`}
        >
          {/* 表面（英単語） */}
          <div className="absolute inset-0 w-full h-full bg-white border border-gray-200 rounded-lg shadow-lg backface-hidden flex items-center justify-center">
            <div className="text-center px-8">
              <p className="text-4xl font-bold text-gray-800 mb-4 font-mono tracking-wide">
                {currentCard?.english || 'カードがありません'}
              </p>
              {currentCard?.phonetics && (
                <div className="flex flex-col items-center gap-3">
                  <p className="text-lg text-gray-600 font-mono">
                    {currentCard.phonetics.text}
                  </p>
                  {currentCard.phonetics.audio && (
                    <AudioPlayButton audioUrl={currentCard.phonetics.audio} />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 裏面（詳細情報） */}
          <div
            className="absolute inset-0 w-full h-full bg-white border border-gray-200 rounded-lg shadow-lg backface-hidden rotate-x-180 overflow-y-auto"
            tabIndex={0}
            aria-label="カードの詳細情報"
          >
            {currentCard ? (
              <div className="p-6">
                {/* ボディ */}
                <main className="card-body">
                  {/* 定義 */}
                  {currentCard.definitions &&
                    currentCard.definitions.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 border-b pb-2">
                          定義
                        </h3>
                        {currentCard.definitions.map((def, index) => (
                          <div key={index} className="mb-4">
                            <p className="font-semibold text-gray-700 mb-2">
                              {def.part_of_speech}
                            </p>
                            <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
                              {def.japanese.map((jp, i) => (
                                <li
                                  key={i}
                                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                                >
                                  {jp}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                  {/* 類義語 */}
                  {currentCard.synonyms && currentCard.synonyms.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 border-b pb-2 mt-6">
                        類義語
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {currentCard.synonyms.map((synonym, index) => (
                          <span
                            key={index}
                            className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {synonym}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 例文 */}
                  {currentCard.example_sentences &&
                    currentCard.example_sentences.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 border-b pb-2 mt-6">
                          例文
                        </h3>
                        <div className="space-y-4">
                          {currentCard.example_sentences.map(
                            (sentence, index) => (
                              <div key={index} className="mb-2">
                                <p className="text-gray-800 font-mono">
                                  {sentence.english}
                                </p>
                                <p className="text-gray-600 text-sm">
                                  {sentence.japanese}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </main>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">カードがありません</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center w-full gap-4 mb-6">
        <div className="flex items-center flex-grow gap-4">
          <input
            type="range"
            min="0"
            max={totalCards > 0 ? totalCards - 1 : 0}
            value={currentIndex}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <span className="text-sm font-medium text-gray-600 min-w-max">
            {totalCards > 0 ? currentIndex + 1 : 0} / {totalCards}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handlePrev}
            aria-label="Previous card"
            disabled={currentIndex === 0}
          >
            <FaArrowLeft className="text-lg" />
          </button>
          <button
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleNext}
            aria-label="Next card"
            disabled={currentIndex >= totalCards - 1}
          >
            <FaArrowRight className="text-lg" />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        {cards.length > 0 && (
          <button
            className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md ${
              isUpdatingCard
                ? 'bg-indigo-500 text-white border border-indigo-500'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
            onClick={handleUpdateCard}
          >
            <FaEdit className="inline-block mr-1 text-lg" /> 編集
          </button>
        )}
        <button
          className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md ${
            isCreatingCard
              ? 'bg-blue-500 text-white border border-blue-500'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
          onClick={handleCreateNewCard}
        >
          <FaPlus className="inline-block mr-1 text-lg" /> カード追加
        </button>
        {currentCard && (
          <button
            className="px-5 py-2.5 text-sm font-medium bg-white text-red-600 border border-red-300 rounded-lg hover:bg-red-50 hover:border-red-400 transition-all duration-200 shadow-sm hover:shadow-md"
            onClick={handleDeleteCard}
          >
            <FaTrash className="inline-block mr-1 text-lg" /> 削除
          </button>
        )}
        <Link
          href={`word-list/${selectedDeckId}`}
          className="px-5 py-2.5 text-sm font-medium bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md inline-flex items-center gap-1"
        >
          <FaListUl className="inline-block mr-1 text-lg" /> 一覧
        </Link>
      </div>
    </section>
  )
}

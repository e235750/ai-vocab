import { Deck } from '@/types'
import WordbookCard from './WordbookCard'
import WordbookEmptyState from './WordbookEmptyState'

interface WordbookGridProps {
  wordbooks: Deck[]
  activeTab: 'my' | 'public'
  currentUserId?: string
  onEdit: (wordbook: Deck) => void
  onDuplicate: (wordbook: Deck) => void
  onDelete: (wordbook: Deck) => void
}

export default function WordbookGrid({
  wordbooks,
  activeTab,
  onEdit,
  onDuplicate,
  onDelete,
}: WordbookGridProps) {
  if (wordbooks.length === 0) {
    return <WordbookEmptyState activeTab={activeTab} />
  }

  return (
    <>
      {wordbooks.map((wordbook) => {
        return (
          <WordbookCard
            key={wordbook.id}
            wordbook={wordbook}
            activeTab={activeTab}
            onEdit={onEdit}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
          />
        )
      })}
    </>
  )
}

import WordItem from './WordItem'
import { Card, NewCard } from '@/types'

type WordListProps = {
  words: Card[]
  onUpdate?: (cardId: string, updatedCard: NewCard) => void
  onDelete?: (cardId: string) => void
}
export default function WordList({ words, onUpdate, onDelete }: WordListProps) {
  return (
    <div className="w-full max-w-3xl bg-white rounded-xl shadow-md overflow-visible">
      {words.map((word) => (
        <WordItem
          key={word.id}
          word={word}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

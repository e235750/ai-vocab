import WordItem from './WordItem'
import { Card, NewCard } from '@/types'

type WordListProps = {
  words: Card[]
  onUpdate?: (cardId: string, updatedCard: NewCard) => void
}
export default function WordList({ words, onUpdate }: WordListProps) {
  return (
    <div className="w-full max-w-3xl bg-white rounded-xl shadow-md overflow-hidden">
      {words.map((word) => (
        <WordItem key={word.id} word={word} onUpdate={onUpdate} />
      ))}
    </div>
  )
}

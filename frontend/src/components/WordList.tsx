import WordItem from './WordItem'
import { Card, NewCard } from '@/types'
import { PermissionLevel } from '@/types'

type WordListProps = {
  words: Card[]
  permission?: PermissionLevel
  onUpdate?: (cardId: string, updatedCard: NewCard) => void
  onDelete?: (cardId: string) => void
}
export default function WordList({
  words,
  permission = 'owner',
  onUpdate,
  onDelete,
}: WordListProps) {
  return (
    <div className="w-full max-w-3xl bg-white rounded-xl shadow-md overflow-visible">
      {words.map((word) => (
        <WordItem
          key={word.id}
          word={word}
          permission={permission}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

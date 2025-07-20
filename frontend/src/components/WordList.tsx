import WordItem from './WordItem'
import { Card } from '@/types'

type WordListProps = {
  words: Card[]
}
export default function WordList({ words }: WordListProps) {
  return (
    <div className="w-full max-w-3xl bg-white rounded-xl shadow-md overflow-hidden">
      {words.map((word) => (
        <WordItem key={word.id} word={word} />
      ))}
    </div>
  )
}

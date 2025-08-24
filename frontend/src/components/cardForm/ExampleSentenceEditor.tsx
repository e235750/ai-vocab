import { FaTimes } from 'react-icons/fa'
import { ExampleSentence } from '@/types'

interface ExampleSentenceEditorProps {
  exampleSentences: ExampleSentence[]
  newExampleEnglish: string
  newExampleJapanese: string
  onAdd: () => void
  onRemove: (index: number) => void
  onEnglishChange: (value: string) => void
  onJapaneseChange: (value: string) => void
}

export default function ExampleSentenceEditor({
  exampleSentences,
  newExampleEnglish,
  newExampleJapanese,
  onAdd,
  onRemove,
  onEnglishChange,
  onJapaneseChange,
}: ExampleSentenceEditorProps) {
  return (
    <div>
      <label className="font-semibold text-gray-700 dark:text-gray-200">例文</label>
      <div className="mt-2 space-y-2">
        {exampleSentences.map((ex, index) => (
          <div
            key={index}
            className="flex items-start justify-between p-2 bg-gray-100 dark:bg-[#23272f] rounded border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <div>
              <p className="text-gray-800 dark:text-gray-100">{ex.english}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{ex.japanese}</p>
            </div>
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
            >
              <FaTimes />
            </button>
          </div>
        ))}
        <div className="flex flex-col gap-2 pt-2">
          <input
            type="text"
            value={newExampleEnglish}
            onChange={(e) => onEnglishChange(e.target.value)}
            placeholder="英文"
            className="p-2 border rounded w-full bg-white dark:bg-[#23272f] text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
          />
          <input
            type="text"
            value={newExampleJapanese}
            onChange={(e) => onJapaneseChange(e.target.value)}
            placeholder="日本語訳"
            className="p-2 border rounded w-full bg-white dark:bg-[#23272f] text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
          />
          <button
            type="button"
            onClick={onAdd}
            className="bg-blue-500 text-white rounded px-3 py-2 text-sm hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 self-end"
          >
            例文を追加
          </button>
        </div>
      </div>
    </div>
  )
}

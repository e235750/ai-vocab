import { FaTimes } from 'react-icons/fa'

interface SynonymEditorProps {
  synonyms: string[]
  newSynonym: string
  onAdd: () => void
  onRemove: (index: number) => void
  onNewSynonymChange: (value: string) => void
}

export default function SynonymEditor({
  synonyms,
  newSynonym,
  onAdd,
  onRemove,
  onNewSynonymChange,
}: SynonymEditorProps) {
  return (
    <div>
      <label className="font-semibold text-gray-700 dark:text-gray-200">類義語</label>
      <div className="mt-2">
        {synonyms.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {synonyms.map((syn, index) => (
              <div
                key={index}
                className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-full px-3 py-1 flex items-center gap-2"
              >
                <span>{syn}</span>
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newSynonym}
            onChange={(e) => onNewSynonymChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                onAdd()
              }
            }}
            placeholder="類義語を入力"
            className="p-2 border rounded flex-grow bg-white dark:bg-[#23272f] text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
          />
          <button
            type="button"
            onClick={onAdd}
            className="bg-blue-500 text-white rounded px-3 py-2 text-sm hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 flex-shrink-0"
          >
            追加
          </button>
        </div>
      </div>
    </div>
  )
}

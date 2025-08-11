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
      <label className="font-semibold text-gray-700">類義語</label>
      <div className="mt-2">
        {synonyms.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {synonyms.map((syn, index) => (
              <div
                key={index}
                className="bg-gray-200 text-gray-800 rounded-full px-3 py-1 flex items-center gap-2"
              >
                <span>{syn}</span>
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="text-gray-500 hover:text-black"
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
            className="p-2 border rounded flex-grow"
          />
          <button
            type="button"
            onClick={onAdd}
            className="bg-blue-500 text-white rounded px-3 py-2 text-sm hover:bg-blue-600 flex-shrink-0"
          >
            追加
          </button>
        </div>
      </div>
    </div>
  )
}

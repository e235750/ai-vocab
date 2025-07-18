import { FaTimes, FaPlus } from 'react-icons/fa'
import { Definition } from '@/types'

interface DefinitionEditorProps {
  definitions: Definition[]
  newMeanings: string[]
  onAddBlock: () => void
  onRemoveBlock: (index: number) => void
  onPartOfSpeechChange: (index: number, value: string) => void
  onNewMeaningChange: (index: number, value: string) => void
  onAddMeaning: (index: number) => void
  onRemoveMeaning: (defIndex: number, meaningIndex: number) => void
}

export default function DefinitionEditor({
  definitions,
  newMeanings,
  onAddBlock,
  onRemoveBlock,
  onPartOfSpeechChange,
  onNewMeaningChange,
  onAddMeaning,
  onRemoveMeaning,
}: DefinitionEditorProps) {
  return (
    <div>
      <label className="font-semibold text-gray-700">品詞と意味</label>
      <div className="space-y-3 mt-2">
        {definitions.map((def, defIndex) => (
          <div key={defIndex} className="space-y-2 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <input
                type="text"
                list="part-of-speech-list"
                value={def.part_of_speech}
                onChange={(e) => onPartOfSpeechChange(defIndex, e.target.value)}
                placeholder="品詞"
                className="p-2 border rounded w-full"
              />
              {definitions.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveBlock(defIndex)}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <FaTimes />
                </button>
              )}
            </div>
            <div className="pl-2">
              {def.japanese.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {def.japanese.map((meaning, meaningIndex) => (
                    <div
                      key={meaningIndex}
                      className="bg-gray-200 text-gray-800 rounded-full px-3 py-1 flex items-center gap-2"
                    >
                      <span>{meaning}</span>
                      <button
                        type="button"
                        onClick={() => onRemoveMeaning(defIndex, meaningIndex)}
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
                  value={newMeanings[defIndex] || ''}
                  onChange={(e) => onNewMeaningChange(defIndex, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      onAddMeaning(defIndex)
                    }
                  }}
                  placeholder="意味を追加"
                  className="p-2 border rounded flex-grow"
                />
                <button
                  type="button"
                  onClick={() => onAddMeaning(defIndex)}
                  className="bg-blue-500 text-white rounded px-3 py-2 text-sm hover:bg-blue-600 flex-shrink-0"
                >
                  追加
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onAddBlock}
        className="mt-3 text-sm text-blue-600 font-bold flex items-center gap-1"
      >
        <FaPlus />
        品詞ブロックを追加
      </button>
    </div>
  )
}

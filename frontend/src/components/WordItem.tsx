import { useState } from 'react'

export default function WordItem({ word }) {
  const [isOpen, setIsOpen] = useState(false)

  // 詳細情報がない場合はアコーディオンを開けないようにする
  const hasDetails = word.definitions || word.synonyms || word.exampleSentences

  return (
    <div className="border-b last:border-b-0 border-gray-200">
      {/* --- アコーディオンヘッダー --- */}
      <div
        className="flex justify-between items-center p-4 sm:px-6 sm:py-5 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => hasDetails && setIsOpen(!isOpen)}
      >
        <span className="font-medium text-lg text-slate-800">
          {word.english}
        </span>
        <span className="text-gray-500 mr-auto ml-5 hidden sm:block">
          {word.translation}
        </span>
        {hasDetails && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 text-gray-400 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </div>

      {/* --- アコーディオンの中身 --- */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden max-h-0 ${
          isOpen ? 'max-h-[1000px]' : ''
        }`}
      >
        <div className="bg-gray-50/70 p-4 sm:px-6 sm:py-5 border-t border-gray-200">
          {/* 詳細がない場合の表示 */}
          {!hasDetails && (
            <p className="text-gray-500">詳細情報はありません。</p>
          )}

          <div className="space-y-6">
            {/* 発音記号と音声 */}
            {word.phonetics && (
              <div className="flex items-center gap-4">
                <span className="text-gray-600">{word.phonetics}</span>
                <button
                  className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors"
                  aria-label="音声を聞く"
                >
                  🔊
                </button>
              </div>
            )}

            {/* 定義 */}
            {word.definitions && (
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  定義
                </h3>
                <div className="space-y-4">
                  {word.definitions.map((def, index) => (
                    <div key={index}>
                      <p className="font-semibold text-gray-700 mb-2">
                        {def.part_of_speech}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {def.japanese.map((jp, i) => (
                          <span
                            key={i}
                            className="bg-gray-200 text-gray-800 px-3 py-1 text-sm rounded-full"
                          >
                            {jp}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 類義語 */}
            {word.synonyms && (
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  類義語
                </h3>
                <div className="flex flex-wrap gap-2">
                  {word.synonyms.map((synonym, index) => (
                    <span
                      key={index}
                      className="bg-teal-100 text-teal-800 px-3 py-1 text-sm font-medium rounded-full"
                    >
                      {synonym}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 例文 */}
            {word.exampleSentences && (
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  例文
                </h3>
                <div className="space-y-4">
                  {word.exampleSentences.map((sentence, index) => (
                    <div key={index}>
                      <p className="text-gray-800">{sentence.english}</p>
                      <p className="text-gray-500 text-sm">
                        {sentence.japanese}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

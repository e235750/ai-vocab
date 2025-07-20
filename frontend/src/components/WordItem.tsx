import { useState } from 'react'
import { Card } from '@/types'

type WordItemProps = {
  word: Card
}

export default function WordItem({ word }: WordItemProps) {
  const [isOpen, setIsOpen] = useState(false)

  // 詳細情報がある場合のみアコーディオンを開けるようにする
  const hasDetails =
    (word.synonyms && word.synonyms.length > 0) ||
    (word.example_sentences && word.example_sentences.length > 0) ||
    (word.phonetics && (word.phonetics.text || word.phonetics.audio))

  return (
    <div className="border-b last:border-b-0 border-gray-200 hover:bg-gray-50/50 transition-colors">
      {/* --- アコーディオンヘッダー --- */}
      <div
        className="flex justify-between items-center p-5 sm:px-6 sm:py-6 cursor-pointer"
        onClick={() => hasDetails && setIsOpen(!isOpen)}
      >
        <div className="flex-1 min-w-0">
          {/* 英単語表示 */}
          <div className="flex items-center gap-4">
            <span className="font-bold text-xl text-slate-900 leading-tight">
              {word.english}
            </span>
          </div>

          {/* 定義表示（簡易表示） */}
          <div className="mt-3 space-y-2">
            {word.definitions && word.definitions.length > 0 && (
              <>
                {word.definitions.map((def, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded tracking-wide">
                      {def.part_of_speech}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {def.japanese.map((jp, i) => (
                        <span
                          key={i}
                          className="text-slate-700 font-medium bg-gray-100 px-3 py-1 rounded-full"
                        >
                          {jp}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        {hasDetails && (
          <div className="ml-4 flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
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
          </div>
        )}
      </div>

      {/* --- アコーディオンの中身 --- */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden max-h-0 ${
          isOpen ? 'max-h-[1000px]' : ''
        }`}
      >
        <div className="bg-gray-50/70 p-4 sm:px-6 sm:py-5 border-t border-gray-200">
          <div className="space-y-6">
            {/* 発音記号と音声 */}
            {word.phonetics &&
              (word.phonetics.text || word.phonetics.audio) && (
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                    発音
                  </h3>
                  <div className="bg-white p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-4">
                      {word.phonetics.text && (
                        <span className="text-slate-600 text-lg font-mono bg-slate-100 px-3 py-2 rounded">
                          {word.phonetics.text}
                        </span>
                      )}
                      {word.phonetics.audio && (
                        <button
                          className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors"
                          aria-label="音声を聞く"
                          onClick={() => {
                            // 音声再生の実装（将来的に）
                          }}
                        >
                          🔊
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

            {/* 類義語 */}
            {word.synonyms && word.synonyms.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                  類義語
                </h3>
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {word.synonyms.map((synonym, index) => (
                      <span
                        key={index}
                        className="bg-teal-50 text-teal-700 px-3 py-2 text-sm font-medium rounded-md border border-teal-200 hover:bg-teal-100 transition-colors"
                      >
                        {synonym}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 例文 */}
            {word.example_sentences && word.example_sentences.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                  例文
                </h3>
                <div className="space-y-4">
                  {word.example_sentences.map((sentence, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg border border-gray-100"
                    >
                      <p className="text-gray-900 font-medium mb-2 leading-relaxed">
                        {sentence.english}
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed">
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

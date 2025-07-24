'use client'

import { useState } from 'react'
import { FaChevronRight, FaChevronUp, FaPlus, FaRobot } from 'react-icons/fa'
import {
  NewCard,
  Definition,
  ExampleSentence,
  partOfSpeechOptions,
} from '@/types'
import { getIdToken } from '@/lib/firebase/auth'
import { createCard } from '@/lib/api/card'

import DefinitionEditor from './DefinitionEditor'
import ExampleSentenceEditor from './ExampleSentenceEditor'
import SynonymEditor from './SynonymEditor'
import Loading from '@/components/Loading'

interface AddCardFormProps {
  onAddCard: (newCardData: NewCard, idToken: string) => void
  selectedDeckId: string
}

export default function AddCardForm({
  onAddCard,
  selectedDeckId,
}: AddCardFormProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAIGenerating, setIsAIGenerating] = useState(false)

  const [english, setEnglish] = useState('')
  const [definitions, setDefinitions] = useState<Definition[]>([
    {
      part_of_speech: '',
      japanese: [],
    },
  ])
  const [synonyms, setSynonyms] = useState<string[]>([])
  const [exampleSentences, setExampleSentences] = useState<ExampleSentence[]>(
    []
  )

  const [newMeanings, setNewMeanings] = useState<string[]>([])
  const [newSynonym, setNewSynonym] = useState('')
  const [newExampleEnglish, setNewExampleEnglish] = useState('')
  const [newExampleJapanese, setNewExampleJapanese] = useState('')

  const handleAIGenerate = async () => {
    if (!english.trim()) {
      alert('英単語を入力してからAI生成を実行してください。')
      return
    }

    setIsAIGenerating(true)
    try {
      const result = await createCard(english.trim())

      if (result.error) {
        alert(`AI生成に失敗しました: ${result.error}`)
        return
      }

      // AI生成データをフォームに設定
      if (result.definitions && result.definitions.length > 0) {
        setDefinitions(result.definitions)
        setNewMeanings(result.definitions.map(() => ''))
      }

      if (result.synonyms) {
        setSynonyms(result.synonyms)
      }

      if (result.example_sentences) {
        setExampleSentences(result.example_sentences)
      }

      // フォームを展開状態にする
      setIsExpanded(true)
    } catch (error) {
      console.error('AI生成エラー:', error)
      alert('AI生成中にエラーが発生しました。')
    } finally {
      setIsAIGenerating(false)
    }
  }

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!english.trim()) {
      alert('表面（英単語）を入力してください。')
      return
    }

    const newCardData = {
      english: english.trim(),
      definitions: [
        {
          part_of_speech: '未分類',
          japanese: [definitions[0]?.japanese[0]?.trim() || ''],
        },
      ],
      synonyms: [],
      example_sentences: [],
      phonetics: { text: '', audio: '', sourceUrl: '' },
      wordbook_id: selectedDeckId,
    }

    const idToken = await getIdToken()
    if (!idToken) return
    onAddCard(newCardData, idToken)

    resetFormContent()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 空の定義を除外し、品詞が空の場合は「未分類」に設定
    const cleanedDefinitions = definitions
      .filter((d) => d.japanese.some((j) => j.trim() !== ''))
      .map((d) => ({
        ...d,
        part_of_speech: d.part_of_speech.trim() || '未分類',
      }))

    const newCardData = {
      english,
      definitions: cleanedDefinitions,
      synonyms,
      example_sentences: exampleSentences,
      phonetics: { text: '', audio: '', sourceUrl: '' },
      wordbook_id: selectedDeckId,
    }

    const idToken = await getIdToken()
    if (!idToken) return
    onAddCard(newCardData, idToken)

    setIsExpanded(false)
    resetFormContent()
  }

  const resetFormContent = () => {
    setEnglish('')
    setDefinitions([{ part_of_speech: '', japanese: [''] }])
    setNewMeanings([''])
    setSynonyms([])
    setExampleSentences([])
    setNewExampleEnglish('')
    setNewExampleJapanese('')
    setNewSynonym('')
  }

  // --- 「品詞と意味」セクションのハンドラ ---
  const handleAddDefinitionBlock = () => {
    if (
      definitions.length === 1 &&
      definitions[0].part_of_speech === '' &&
      definitions[0].japanese.every((j) => j === '')
    ) {
      setDefinitions([{ part_of_speech: '', japanese: [] }])
      setNewMeanings([''])
    } else {
      setDefinitions([...definitions, { part_of_speech: '', japanese: [] }])
      setNewMeanings([...newMeanings, ''])
    }
  }

  const handleRemoveDefinitionBlock = (defIndex: number) => {
    if (defIndex > 0) {
      setDefinitions(definitions.filter((_, i) => i !== defIndex))
      setNewMeanings(newMeanings.filter((_, i) => i !== defIndex))
    }
  }

  const handlePartOfSpeechChange = (defIndex: number, value: string) => {
    const newDefs = [...definitions]
    newDefs[defIndex].part_of_speech = value
    setDefinitions(newDefs)
  }

  const handleNewMeaningChange = (defIndex: number, value: string) => {
    const meanings = [...newMeanings]
    meanings[defIndex] = value
    setNewMeanings(meanings)
  }

  const handleAddMeaning = (defIndex: number) => {
    const meaningToAdd = newMeanings[defIndex]?.trim()
    if (!meaningToAdd) return
    const newDefs = [...definitions]
    newDefs[defIndex].japanese.push(meaningToAdd)
    setDefinitions(newDefs)
    const meanings = [...newMeanings]
    meanings[defIndex] = ''
    setNewMeanings(meanings)
  }

  const handleRemoveMeaning = (defIndex: number, meaningIndex: number) => {
    const newDefs = [...definitions]
    newDefs[defIndex].japanese.splice(meaningIndex, 1)
    setDefinitions(newDefs)
  }

  // --- 「例文」セクションのハンドラ ---
  const handleAddExample = () => {
    if (!newExampleEnglish.trim() || !newExampleJapanese.trim()) return
    setExampleSentences([
      ...exampleSentences,
      {
        english: newExampleEnglish.trim(),
        japanese: newExampleJapanese.trim(),
      },
    ])
    setNewExampleEnglish('')
    setNewExampleJapanese('')
  }
  const handleRemoveExample = (index: number) => {
    setExampleSentences(exampleSentences.filter((_, i) => i !== index))
  }

  // --- 「類義語」セクションのハンドラ ---
  const handleAddSynonym = () => {
    if (newSynonym.trim() !== '') {
      setSynonyms([...synonyms, newSynonym.trim()])
      setNewSynonym('')
    }
  }
  const handleRemoveSynonym = (index: number) => {
    setSynonyms(synonyms.filter((_, i) => i !== index))
  }

  if (isAIGenerating) {
    return (
      <div className="flex items-center p-3 bg-white border border-gray-300 rounded-xl">
        <Loading
          className="h-10 w-60 m-auto pl-10"
          message="生成中です..."
          svgClassName="h-12 w-12"
          textClassName="text-xl w-full"
        />
      </div>
    )
  }

  // --- 展開前の表示 ---
  if (!isExpanded) {
    return (
      <div className="flex items-center p-3 bg-white border border-gray-300 rounded-xl">
        <div className="flex-1">
          <label className="text-xs text-gray-500">表面</label>
          <input
            type="text"
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
            placeholder="新しい単語を追加..."
            className="w-full text-lg bg-transparent focus:outline-none"
            required
          />
        </div>
        <div className="w-px h-10 bg-gray-200 mx-4"></div>
        <div className="flex-1">
          <label className="text-xs text-gray-500">裏面</label>
          <input
            type="text"
            value={definitions[0]?.japanese[0] || ''}
            onChange={(e) => {
              const newDefs = [...definitions]
              newDefs[0] = { ...newDefs[0], japanese: [e.target.value] }
              setDefinitions(newDefs)
            }}
            placeholder="意味"
            className="w-full text-lg bg-transparent focus:outline-none"
          />
        </div>

        {/* 詳細表示ボタン */}
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="p-2 ml-1 text-gray-400 hover:text-gray-700"
        >
          <FaChevronRight />
        </button>

        {/* クイック保存ボタン */}
        <button
          type="button"
          onClick={handleQuickAdd}
          className="p-2 ml-1 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          <FaPlus />
        </button>

        {/* AI生成ボタン */}
        <button
          type="button"
          onClick={handleAIGenerate}
          disabled={isAIGenerating || !english.trim()}
          className="p-2 ml-1 text-white bg-purple-500 rounded-lg hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          title="AI生成"
        >
          <FaRobot />
        </button>
      </div>
    )
  }

  // --- 展開後の表示 ---
  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white border-2 border-blue-500 rounded-xl flex flex-col gap-6"
    >
      <datalist id="part-of-speech-list">
        {partOfSpeechOptions.map((pos) => (
          <option key={pos} value={pos} />
        ))}
      </datalist>

      <div className="flex justify-between items-start">
        <div className="flex-1">
          <label className="font-semibold text-gray-700">表面</label>
          <div className="flex gap-2 mt-1">
            <input
              type="text"
              value={english}
              onChange={(e) => setEnglish(e.target.value)}
              placeholder="example"
              className="text-xl text-gray-800 flex-1 border rounded p-2"
            />
            <button
              type="button"
              onClick={handleAIGenerate}
              disabled={isAIGenerating || !english.trim()}
              className="px-4 py-2 text-white bg-purple-500 rounded hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
              title="AI生成"
            >
              <>
                <FaRobot />
                AI生成
              </>
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(false)}
          className="p-1 text-gray-500 hover:text-gray-800"
        >
          <FaChevronUp />
        </button>
      </div>

      <hr className="border-t border-gray-200" />

      <DefinitionEditor
        definitions={definitions}
        newMeanings={newMeanings}
        onAddBlock={handleAddDefinitionBlock}
        onRemoveBlock={handleRemoveDefinitionBlock}
        onPartOfSpeechChange={handlePartOfSpeechChange}
        onNewMeaningChange={handleNewMeaningChange}
        onAddMeaning={handleAddMeaning}
        onRemoveMeaning={handleRemoveMeaning}
      />

      <hr className="border-t border-gray-200" />

      <ExampleSentenceEditor
        exampleSentences={exampleSentences}
        newExampleEnglish={newExampleEnglish}
        newExampleJapanese={newExampleJapanese}
        onAdd={handleAddExample}
        onRemove={handleRemoveExample}
        onEnglishChange={setNewExampleEnglish}
        onJapaneseChange={setNewExampleJapanese}
      />

      <hr className="border-t border-gray-200" />

      <SynonymEditor
        synonyms={synonyms}
        newSynonym={newSynonym}
        onAdd={handleAddSynonym}
        onRemove={handleRemoveSynonym}
        onNewSynonymChange={setNewSynonym}
      />

      <hr className="border-t border-gray-200" />

      <div className="flex justify-end gap-3 mt-4">
        <button
          type="button"
          onClick={() => setIsExpanded(false)}
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="w-full px-4 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 font-bold"
        >
          この内容でカードを追加する
        </button>
      </div>
    </form>
  )
}

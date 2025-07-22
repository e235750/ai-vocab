'use client'

import { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'
import {
  Card,
  NewCard,
  Definition,
  ExampleSentence,
  partOfSpeechOptions,
} from '@/types'

import DefinitionEditor from './DefinitionEditor'
import ExampleSentenceEditor from './ExampleSentenceEditor'
import SynonymEditor from './SynonymEditor'

interface CardEditFormProps {
  selectedDeckId: string
  cardData?: Card // 編集時のみ提供される
  onSubmit: (cardData: NewCard) => void
  onCancel: () => void
  submitButtonText?: string
  title?: string
  showHeader?: boolean
}

export default function CardEditForm({
  selectedDeckId,
  cardData,
  onSubmit,
  onCancel,
  submitButtonText = '保存',
  title = 'カードを編集',
  showHeader = true,
}: CardEditFormProps) {
  const [english, setEnglish] = useState('')
  const [definitions, setDefinitions] = useState<Definition[]>([
    { part_of_speech: '', japanese: [''] },
  ])
  const [synonyms, setSynonyms] = useState<string[]>([])
  const [exampleSentences, setExampleSentences] = useState<ExampleSentence[]>(
    []
  )
  const [phoneticsText, setPhoneticsText] = useState('')

  const [newMeanings, setNewMeanings] = useState<string[]>([''])
  const [newSynonym, setNewSynonym] = useState('')
  const [newExampleEnglish, setNewExampleEnglish] = useState('')
  const [newExampleJapanese, setNewExampleJapanese] = useState('')

  // 既存カードデータで初期化（編集モード）
  useEffect(() => {
    if (cardData) {
      setEnglish(cardData.english)
      setDefinitions(
        cardData.definitions.length > 0
          ? cardData.definitions
          : [{ part_of_speech: '', japanese: [''] }]
      )
      setSynonyms(cardData.synonyms || [])
      setExampleSentences(cardData.example_sentences || [])
      setPhoneticsText(cardData.phonetics?.text || '')
      setNewMeanings(cardData.definitions.map(() => ''))
    }
  }, [cardData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 空の定義を除外し、品詞が空の場合は「未分類」に設定
    const cleanedDefinitions = definitions
      .filter((d) => d.japanese.some((j) => j.trim() !== ''))
      .map((d) => ({
        ...d,
        part_of_speech: d.part_of_speech.trim() || '未分類',
      }))

    const cardDataToSubmit: NewCard = {
      english: english.trim(),
      definitions: cleanedDefinitions,
      synonyms: synonyms.filter((s) => s.trim() !== ''),
      example_sentences: exampleSentences,
      phonetics: phoneticsText.trim()
        ? { text: phoneticsText.trim(), audio: '', sourceUrl: '' }
        : undefined,
      wordbook_id: selectedDeckId,
    }

    onSubmit(cardDataToSubmit)
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

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white border-2 border-blue-500 rounded-xl flex flex-col gap-6 shadow-lg"
    >
      <datalist id="part-of-speech-list">
        {partOfSpeechOptions.map((pos) => (
          <option key={pos} value={pos} />
        ))}
      </datalist>

      {/* ヘッダー */}
      {showHeader && (
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* 英単語入力 */}
      <div>
        <label className="font-semibold text-gray-700 block mb-2">英単語</label>
        <input
          type="text"
          value={english}
          onChange={(e) => setEnglish(e.target.value)}
          placeholder="example"
          className="text-xl text-gray-800 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
          required
        />
      </div>

      {/* 発音記号 */}
      <div>
        <label className="font-semibold text-gray-700 block mb-2">
          発音記号（任意）
        </label>
        <input
          type="text"
          value={phoneticsText}
          onChange={(e) => setPhoneticsText(e.target.value)}
          placeholder="/ɪɡˈzæmpəl/"
          className="text-lg text-gray-800 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
        />
      </div>

      <hr className="border-t border-gray-200" />

      {/* 定義セクション */}
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

      {/* 例文セクション */}
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

      {/* 類義語セクション */}
      <SynonymEditor
        synonyms={synonyms}
        newSynonym={newSynonym}
        onAdd={handleAddSynonym}
        onRemove={handleRemoveSynonym}
        onNewSynonymChange={setNewSynonym}
      />

      <hr className="border-t border-gray-200" />

      {/* ボタン */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 font-bold transition-colors"
        >
          {submitButtonText}
        </button>
      </div>
    </form>
  )
}

import { FaVolumeUp } from 'react-icons/fa'
import { useState } from 'react'

type AudioPlayButtonProps = {
  audioUrl?: string
  size?: number
  className?: string
  disabled?: boolean
  onError?: (error: Error) => void
}

export default function AudioPlayButton({
  audioUrl,
  size = 20,
  className = '',
  disabled = false,
  onError,
}: AudioPlayButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const handleAudioPlay = (e: React.MouseEvent) => {
    e.stopPropagation() // 親要素のクリックイベントを防ぐ
    e.preventDefault() // デフォルト動作を防ぐ

    if (!audioUrl) {
      console.warn('音声URLが指定されていません')
      return
    }

    if (isPlaying) {
      return // 再生中の場合は何もしない
    }

    setIsPlaying(true)
    const audio = new Audio(audioUrl)

    // 音声再生完了時またはエラー時に状態をリセット
    const resetPlayingState = () => {
      setIsPlaying(false)
      audio.removeEventListener('ended', resetPlayingState)
      audio.removeEventListener('error', resetPlayingState)
    }

    audio.addEventListener('ended', resetPlayingState)
    audio.addEventListener('error', resetPlayingState)

    audio.play().catch((error) => {
      console.error('音声再生エラー:', error)
      setIsPlaying(false) // エラー時も状態をリセット
      if (onError) {
        onError(error)
      }
    })
  }

  // 音声URLがない場合は何も表示しない
  if (!audioUrl) {
    return null
  }

  return (
    <button
      type="button"
      className={`bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${className}`}
      aria-label={isPlaying ? '音声再生中...' : '音声を聞く'}
      onClick={handleAudioPlay}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      disabled={disabled || isPlaying}
    >
      <FaVolumeUp size={size} className={isPlaying ? 'animate-pulse' : ''} />
    </button>
  )
}

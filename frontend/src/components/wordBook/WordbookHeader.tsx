import { LuPlus, LuRefreshCw } from 'react-icons/lu'

interface WordbookHeaderProps {
  loading: boolean
  onRefresh: () => void
  onCreate: () => void
}

export default function WordbookHeader({
  loading,
  onRefresh,
  onCreate,
}: WordbookHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">単語帳</h1>
          <p className="text-gray-600 mt-1">
            あなたの単語帳と公開されている単語帳を管理・閲覧できます
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            title="最新の情報に更新"
          >
            <LuRefreshCw
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
            />
          </button>
          <button
            onClick={onCreate}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <LuPlus className="w-4 h-4 mr-2" />
            新しい単語帳を作成
          </button>
        </div>
      </div>
    </div>
  )
}

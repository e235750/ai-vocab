import { LuBookOpen } from 'react-icons/lu'

interface WordbookEmptyStateProps {
  activeTab: 'my' | 'public'
}

export default function WordbookEmptyState({
  activeTab,
}: WordbookEmptyStateProps) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
      <LuBookOpen className="w-12 h-12 mb-4 text-gray-400 dark:text-gray-600" />
      <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
        {activeTab === 'my'
          ? '単語帳がありません'
          : '公開単語帳が見つかりません'}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {activeTab === 'my'
          ? '新しい単語帳を作成してみましょう'
          : '検索条件を変更するか、後でもう一度お試しください'}
      </p>
    </div>
  )
}

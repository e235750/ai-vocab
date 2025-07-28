interface WordbookTabsProps {
  activeTab: 'my' | 'public'
  onTabChange: (tab: 'my' | 'public') => void
}

export default function WordbookTabs({
  activeTab,
  onTabChange,
}: WordbookTabsProps) {
  return (
    <div className="flex border-b border-gray-200">
      <button
        onClick={() => onTabChange('my')}
        className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
          activeTab === 'my'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`}
      >
        マイ単語帳
      </button>
      <button
        onClick={() => onTabChange('public')}
        className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
          activeTab === 'public'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`}
      >
        公開単語帳
      </button>
    </div>
  )
}

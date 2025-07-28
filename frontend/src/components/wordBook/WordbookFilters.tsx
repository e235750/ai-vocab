import WordbookTabs from './WordbookTabs'
import WordbookSearchBar from './WordbookSearchBar'

interface WordbookFiltersProps {
  activeTab: 'my' | 'public'
  searchQuery: string
  onTabChange: (tab: 'my' | 'public') => void
  onSearchChange: (query: string) => void
}

export default function WordbookFilters({
  activeTab,
  searchQuery,
  onTabChange,
  onSearchChange,
}: WordbookFiltersProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <WordbookTabs activeTab={activeTab} onTabChange={onTabChange} />
        <WordbookSearchBar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />
      </div>
    </div>
  )
}

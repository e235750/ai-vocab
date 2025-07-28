import { LuSearch } from 'react-icons/lu'

interface WordbookSearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  placeholder?: string
}

export default function WordbookSearchBar({
  searchQuery,
  onSearchChange,
  placeholder = '単語帳を検索...',
}: WordbookSearchBarProps) {
  return (
    <div className="relative">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      />
      <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
    </div>
  )
}

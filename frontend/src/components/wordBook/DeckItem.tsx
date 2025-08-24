import { Deck } from '@/types'
import DropdownMenu from '../DropdownMenu'
import { useDeckMenuItems } from '@/hooks/useMenuItems'
import { PermissionLevel } from '@/types'

type DeckItemProps = {
  deck: Deck
  isActive: boolean
  onSelect: (id: string) => void
  onEdit?: (deck: Deck) => void
  onDelete?: (deckId: string) => void
  onDuplicate?: (deck: Deck) => void
}

export default function DeckItem({
  deck,
  isActive,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
}: DeckItemProps) {
  const activeClasses = isActive
    ? 'bg-indigo-50 dark:bg-indigo-900 border-indigo-400 dark:border-indigo-500'
    : 'bg-white dark:bg-[#23272f] border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'

  const handleEdit = () => {
    if (onEdit) {
      onEdit(deck)
    }
  }

  const handleDuplicate = () => {
    if (onDuplicate) {
      onDuplicate(deck)
    }
  }

  const handleDelete = () => {
    if (
      !window.confirm(
        `単語帳「${deck.name}」を削除しますか？\n\nこの操作により、単語帳内のすべての単語も削除されます。\nこの操作は取り消せません。`
      )
    ) {
      return
    }

    if (onDelete) {
      onDelete(deck.id)
    }
  }

  // カスタムフックを使用してメニューアイテムを取得
  const permission: PermissionLevel = 'owner' // DeckItemは常にマイ単語帳
  const menuItems = useDeckMenuItems({
    deckId: deck.id,
    permission,
    onEdit: handleEdit,
    onDuplicate: handleDuplicate,
    onDelete: handleDelete,
  })

  return (
    <li
      className={`border rounded-lg cursor-pointer transition-colors duration-150 ${activeClasses} relative`}
      onClick={() => onSelect(deck.id)}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex-1">
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {deck.name}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-full">
            {deck.num_words}
          </span>

          {/* ドロップダウンメニュー */}
          <DropdownMenu items={menuItems} />
        </div>
      </div>
    </li>
  )
}

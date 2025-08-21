import { useMemo } from 'react'
import { MENU_ITEMS } from '@/constants/menuItems'
import type { DropdownMenuItem } from '@/components/DropdownMenu'
import { PermissionLevel } from '@/types'

interface UseMenuItemsConfig {
  // 基本情報
  deckId?: string
  deckTitle?: string
  permission?: PermissionLevel

  // ハンドラー関数
  onEdit?: () => void
  onDuplicate?: () => void
  onDelete?: () => void
  onViewWords?: () => void
  onViewCards?: () => void
}

export function useMenuItems(config: UseMenuItemsConfig = {}) {
  return useMemo(() => {
    const {
      deckId,
      permission = 'readonly',
      onEdit,
      onDuplicate,
      onDelete,
      onViewWords,
      onViewCards,
    } = config

    // WordbookCard用のメニューアイテム（権限レベル別）
    const wordbookMenuItems: DropdownMenuItem[] = [
      {
        ...MENU_ITEMS.viewWords,
        href: `/word-list/${deckId}`,
        onClick: onViewWords,
      },
      {
        ...MENU_ITEMS.viewCards,
        href: '/',
        onClick: onViewCards,
      },
      MENU_ITEMS.divider,
      {
        ...MENU_ITEMS.duplicate,
        onClick: onDuplicate,
      },
      // 所有者権限のみで編集・削除を表示
      ...(permission === 'owner'
        ? [
            MENU_ITEMS.divider,
            {
              ...MENU_ITEMS.edit,
              onClick: onEdit,
            },
            {
              ...MENU_ITEMS.delete,
              onClick: onDelete,
            },
          ]
        : []),
    ]

    // DeckItem用のメニューアイテム（権限レベル別）
    const deckMenuItems: DropdownMenuItem[] = [
      {
        ...MENU_ITEMS.viewWordList,
        href: `/word-list/${deckId}`,
      },
      {
        ...MENU_ITEMS.viewCards,
        href: `/`,
        onClick: onViewCards,
      },
      ...(permission === 'owner'
        ? [
            MENU_ITEMS.divider,
            {
              ...MENU_ITEMS.edit,
              onClick: onEdit,
            },
            {
              ...MENU_ITEMS.duplicate,
              onClick: onDuplicate,
            },
            MENU_ITEMS.divider,
            {
              ...MENU_ITEMS.delete,
              onClick: onDelete,
            },
          ]
        : permission === 'public'
        ? [
            MENU_ITEMS.divider,
            {
              ...MENU_ITEMS.duplicate,
              onClick: onDuplicate,
            },
          ]
        : []),
    ]

    // WordItem用のメニューアイテム（権限レベル別）
    const wordMenuItems: DropdownMenuItem[] =
      permission === 'owner'
        ? [
            {
              ...MENU_ITEMS.edit,
              onClick: onEdit,
            },
            {
              ...MENU_ITEMS.deleteWord,
              onClick: onDelete,
            },
          ]
        : []

    return {
      wordbookMenuItems,
      deckMenuItems,
      wordMenuItems,
    }
  }, [config])
}

// 個別のメニュータイプ用のヘルパーフック
export function useWordbookMenuItems(
  config: Pick<
    UseMenuItemsConfig,
    | 'deckId'
    | 'deckTitle'
    | 'permission'
    | 'onEdit'
    | 'onDuplicate'
    | 'onDelete'
    | 'onViewWords'
    | 'onViewCards'
  >
) {
  const { wordbookMenuItems } = useMenuItems(config)
  return wordbookMenuItems
}

export function useDeckMenuItems(
  config: Pick<
    UseMenuItemsConfig,
    | 'deckId'
    | 'permission'
    | 'onEdit'
    | 'onDuplicate'
    | 'onDelete'
    | 'onViewCards'
  >
) {
  const { deckMenuItems } = useMenuItems(config)
  return deckMenuItems
}

export function useWordMenuItems(
  config: Pick<UseMenuItemsConfig, 'permission' | 'onEdit' | 'onDelete'>
) {
  const { wordMenuItems } = useMenuItems(config)
  return wordMenuItems
}

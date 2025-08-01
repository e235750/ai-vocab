import React from 'react'
import {
  LuList,
  LuPencil,
  LuTrash2,
  LuCopy,
  LuBookOpen,
} from 'react-icons/lu'
import { FaListUl } from 'react-icons/fa'

// 基本的なメニューアイテムテンプレート
export const MENU_ITEMS = {
  viewWords: {
    id: 'view-words',
    label: '単語一覧を見る',
    icon: <LuList className="w-4 h-4" />,
  },
  viewCards: {
    id: 'view-cards',
    label: 'カード学習',
    icon: <LuBookOpen className="w-4 h-4" />,
  },
  viewWordList: {
    id: 'view-word-list',
    label: '単語一覧を見る',
    icon: <FaListUl className="w-3 h-3" />,
  },
  edit: {
    id: 'edit',
    label: '編集',
    icon: <LuPencil className="w-4 h-4" />,
  },
  duplicate: {
    id: 'duplicate',
    label: '複製',
    icon: <LuCopy className="w-4 h-4" />,
  },
  delete: {
    id: 'delete',
    label: '削除',
    icon: <LuTrash2 className="w-4 h-4" />,
    className: 'flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors',
  },
  deleteWord: {
    id: 'delete',
    label: '削除',
    className: 'w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-b-lg transition-colors',
  },
  divider: {
    id: 'divider',
    label: '',
    isDivider: true,
  },
} as const

// よく使われる組み合わせのタイプ定義
export type MenuItemType = keyof typeof MENU_ITEMS

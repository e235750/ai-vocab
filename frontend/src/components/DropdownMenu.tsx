import { useState, useEffect, useRef, ReactNode } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import Link from 'next/link'

export type DropdownMenuItem = {
  id: string
  label: string
  icon?: ReactNode
  onClick?: () => void
  href?: string
  className?: string
  isDivider?: boolean
}

type DropdownMenuProps = {
  items: DropdownMenuItem[]
  buttonClassName?: string
  menuClassName?: string
  buttonIcon?: ReactNode
  buttonTitle?: string
  onMenuOpen?: () => void
  onMenuClose?: () => void
}

export default function DropdownMenu({
  items,
  buttonClassName = 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
  menuClassName = 'absolute right-0 top-8 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50',
  buttonIcon,
  buttonTitle = 'メニューを開く',
  onMenuOpen,
  onMenuClose,
}: DropdownMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // メニューの外側をクリックしたら閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      onMenuOpen?.()
    } else {
      onMenuClose?.()
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen, onMenuOpen, onMenuClose])

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMenuOpen(!isMenuOpen)
  }

  const handleItemClick = (item: DropdownMenuItem) => {
    setIsMenuOpen(false)
    if (item.onClick) {
      item.onClick()
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={handleMenuClick}
        className={buttonClassName}
        title={buttonTitle}
      >
        {buttonIcon || <BsThreeDotsVertical className="w-5 h-5" />}
      </button>

      {/* ドロップダウンメニュー */}
      {isMenuOpen && (
        <div className={menuClassName}>
          <div className="py-1">
            {items.map((item, index) => {
              if (item.isDivider) {
                return (
                  <hr
                    key={`divider-${index}`}
                    className="my-1 border-gray-200 dark:border-gray-600"
                  />
                )
              }

              // Linkアイテムの場合
              if (item.href) {
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => handleItemClick(item)}
                    className={
                      item.className ||
                      'flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                    }
                  >
                    {item.icon && <span className="mr-3">{item.icon}</span>}
                    {item.label}
                  </Link>
                )
              }

              // ボタンアイテムの場合
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={
                    item.className ||
                    'flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                  }
                >
                  {item.icon && <span className="mr-3">{item.icon}</span>}
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

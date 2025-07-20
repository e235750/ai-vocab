import Link from 'next/link'
import { LuCircleUserRound } from 'react-icons/lu'

export default function Header() {
  return (
    <div className="flex items-end justify-between max-w-4xl pb-3 mx-auto border-b border-gray-300">
      <div className="flex items-end gap-5">
        <h1 className="text-2xl font-bold">
          <Link href="/">AI-Vocab</Link>
        </h1>
        <nav className="flex items-center gap-2">
          <button className="px-3 py-2 text-base bg-transparent border-none rounded-lg">
            単語帳作成
          </button>
          <button className="px-3 py-2 text-base font-semibold bg-gray-200 border-none rounded-lg">
            単語ディレクトリ
          </button>
        </nav>
      </div>
      <div>
        <LuCircleUserRound className="text-4xl text-gray-500" />
      </div>
    </div>
  )
}

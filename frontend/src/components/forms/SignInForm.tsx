'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { signIn, signInWithGoogle } from '@/lib/firebase/auth'

export default function SignInForm() {
  const router = useRouter()
  const doSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      await signIn(email, password)
      router.push('/')
      console.log('User signed in successfully')
    } catch (error) {
      console.error('Error signing in user:', error)
    }
  }

  const doSignInWithGoogle = async () => {
    try {
      await signInWithGoogle()
      router.push('/')
      console.log('User signed in with Google successfully')
    } catch (error) {
      console.error('Error signing in with Google:', error)
    }
  }
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          {/* <Image
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          /> */}
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            アカウントにサインイン
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={doSignIn} method="POST" className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                メールアドレス
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  パスワード
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    パスワードを忘れましたか？
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                サインイン
              </button>
            </div>
          </form>
          <div className="text-sm mt-2">
            <a
              href="/sign-up"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              初めての方はこちら
            </a>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">または</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4">
              <button
                onClick={doSignInWithGoogle}
                className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
                type="button"
              >
                <Image
                  alt="Google logo"
                  src="/img/logo/google-logo.svg"
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
                <span>Googleでサインイン</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

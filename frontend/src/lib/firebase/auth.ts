import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithRedirect,
} from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { auth } from './config'

/**
 * ユーザーを登録する関数
 * @param email
 * @param password
 * @returns
 */
export const register = async (email: string, password: string) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password)
  } catch (error) {
    const firebaseError = error as FirebaseError
    if (firebaseError.code === 'auth/email-already-in-use') {
      alert('このメールアドレスはすでに使用されています。')
      throw new Error('このメールアドレスはすでに使用されています。')
    } else {
      console.error('Error registering user:', error)
      throw error
    }
  }
}

/**
 * ユーザーをサインインする関数
 * @param email
 * @param password
 * @returns
 */
export const signIn = async (email: string, password: string) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password)
  } catch (error) {
    console.error('Error signing in user:', error)
    throw error
  }
}

/**
 * ユーザーをログアウトする関数
 */
export const logout = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error('Error logging out user:', error)
    throw error
  }
}

/**
 * Googleでサインインする関数
 * @returns
 */
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  try {
    return await signInWithRedirect(auth, provider)
  } catch (error) {
    console.error('Error signing in with Google (redirect):', error)
    throw error
  }
}

/**
 * 現在サインインしているユーザーをログアウトする関数
 * @returns
 */
export const deleteUser = async () => {
  const user = auth.currentUser
  if (user) {
    try {
      await user.delete()
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  } else {
    console.error('No user is currently signed in.')
    throw new Error('No user is currently signed in.')
  }
}

/**
 * 現在ログインしているユーザーのIDトークンを取得する
 * @returns {Promise<string | null>}
 */
export const getIdToken = async (): Promise<string | null> => {
  const user = auth.currentUser

  if (!user) {
    console.error('User is not authenticated.')
    return null
  }

  try {
    const idToken = await user.getIdToken()
    return idToken
  } catch (error) {
    console.error('Error getting ID token:', error)
    return null
  }
}

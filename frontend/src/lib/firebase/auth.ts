import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { FireBaseError } from 'firebase/app'
import { auth } from './config'

export const register = async (email: string, password: string) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password)
  } catch (error: FireBaseError) {
    if (error.code === 'auth/email-already-in-use') {
      alert('このメールアドレスはすでに使用されています。')
      throw new Error('このメールアドレスはすでに使用されています。')
    } else {
      console.error('Error registering user:', error)
      throw error
    }
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password)
  } catch (error) {
    console.error('Error signing in user:', error)
    throw error
  }
}

export const logout = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error('Error logging out user:', error)
    throw error
  }
}

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  try {
    return await signInWithPopup(auth, provider)
  } catch (error) {
    console.error('Error signing in with Google:', error)
    throw error
  }
}

export const deleteUser = async () => {
  const user = auth.currentUser
  if (user) {
    try {
      await user.delete()
      console.log('User deleted successfully')
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  } else {
    console.error('No user is currently signed in.')
    throw new Error('No user is currently signed in.')
  }
}

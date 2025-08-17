import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app'
import { getAuth, Auth, browserSessionPersistence, setPersistence } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
}

// 初期化を一度だけ実行するための記述
const app: FirebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp()


const auth: Auth = getAuth(app)

// セッション永続性を明示的に設定（クライアントサイドのみ）
if (typeof window !== 'undefined') {
  setPersistence(auth, browserSessionPersistence)
}

export { app, auth }

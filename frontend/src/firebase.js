import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

// Prefer environment variables for config (Vite). If not provided, fall back to the supplied static config.
const envConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

const fallbackConfig = {
  apiKey: "AIzaSyBGdaM0R8wx7picy9d2D2mgx7T4Mxjl1so",
  authDomain: "notice-board-ec16c.firebaseapp.com",
  projectId: "notice-board-ec16c",
  storageBucket: "notice-board-ec16c.firebasestorage.app",
  messagingSenderId: "998887742705",
  appId: "1:998887742705:web:68fabdc3820c13ba4d5d50",
  measurementId: "G-9031XXY38W"
}

const firebaseConfig = {
  apiKey: envConfig.apiKey || fallbackConfig.apiKey,
  authDomain: envConfig.authDomain || fallbackConfig.authDomain,
  projectId: envConfig.projectId || fallbackConfig.projectId,
  storageBucket: envConfig.storageBucket || fallbackConfig.storageBucket,
  messagingSenderId: envConfig.messagingSenderId || fallbackConfig.messagingSenderId,
  appId: envConfig.appId || fallbackConfig.appId,
  measurementId: envConfig.measurementId || fallbackConfig.measurementId
}

const app = initializeApp(firebaseConfig)

let analytics
try {
  analytics = getAnalytics(app)
} catch (e) {
  // analytics may fail in non-browser environments or when blocked
  console.warn('Firebase analytics not available', e.message)
}

export const auth = getAuth(app)
export const db = getFirestore(app)
export default app

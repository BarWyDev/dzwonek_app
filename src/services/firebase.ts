import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getMessaging } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const messaging = getMessaging(app)

// Połącz z emulatorami jeśli jesteśmy w środowisku development
if (import.meta.env.VITE_ENV === 'development' && typeof window !== 'undefined') {
  // Sprawdź czy emulatory są dostępne
  if (window.location.hostname === 'localhost') {
    try {
      connectFirestoreEmulator(db, 'localhost', 8080)
      console.log('🔧 Połączono z Firestore Emulator')
    } catch (error) {
      console.warn('⚠️ Nie można połączyć z Firestore Emulator:', error)
    }
  }
}

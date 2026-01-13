import { getToken } from 'firebase/messaging'
import { messaging } from './firebase'
import { Duty } from '../types'
import { saveToFirestore } from './firestore'

export async function registerFCMToken(teacherName: string, schedule: Duty[]) {
  try {
    if (!('Notification' in window)) {
      throw new Error('Twoja przeglądarka nie obsługuje powiadomień systemowych.')
    }

    if (Notification.permission === 'denied') {
      throw new Error('Powiadomienia zostały zablokowane w ustawieniach przeglądarki. Kliknij kłódkę przy adresie URL, aby je odblokować.')
    }

    // Prośba o uprawnienia do powiadomień
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      throw new Error('Nie wyrażono zgody na powiadomienia. Bez tego aplikacja nie będzie mogła wysyłać przypomnień.')
    }

    // Pobranie tokenu FCM
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    })

    // Zapisanie w Firestore
    await saveToFirestore(token, teacherName, schedule)

    // Zapisanie w LocalStorage (backup)
    localStorage.setItem('fcmToken', token)

    return token
  } catch (error) {
    console.error('Błąd rejestracji FCM:', error)
    throw error
  }
}

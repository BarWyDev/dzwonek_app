import { doc, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import { Duty } from '../types'

export async function saveToFirestore(
  fcmToken: string,
  teacherName: string,
  schedule: Duty[]
) {
  try {
    // Używamy token jako ID użytkownika (anonimowy)
    const userId = fcmToken
    await setDoc(doc(db, 'users', userId), {
      fcmToken,
      teacherName,
      schedule,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    console.log('Dane zapisane w Firestore')
  } catch (error) {
    console.error('Błąd zapisu do Firestore:', error)
    throw error
  }
}

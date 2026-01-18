import { onSchedule } from 'firebase-functions/v2/scheduler'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import { logger } from 'firebase-functions/v2'

const db = getFirestore()

/**
 * Automatyczne czyszczenie starych danych z Firestore
 * Uruchamiane codziennie o 3:00 (mało aktywny czas)
 */
export const cleanupOldData = onSchedule(
  {
    schedule: 'every day 03:00',
    timeZone: 'Europe/Warsaw',
    memory: '256MiB',
  },
  async () => {
    logger.info('🧹 Starting cleanup job...')

    try {
      // 1. Usuń stare tokeny FCM (starsze niż 90 dni)
      await cleanupOldFCMTokens()

      // 2. Usuń stare harmonogramy (starsze niż 1 rok)
      await cleanupOldSchedules()

      logger.info('✅ Cleanup job completed successfully')
    } catch (error) {
      logger.error('❌ Cleanup job failed:', error)
      throw error
    }
  }
)

/**
 * Usuń tokeny FCM starsze niż 90 dni
 */
async function cleanupOldFCMTokens() {
  const ninetyDaysAgo = Timestamp.fromDate(
    new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
  )

  const usersRef = db.collection('users')
  const snapshot = await usersRef
    .where('createdAt', '<', ninetyDaysAgo)
    .get()

  if (snapshot.empty) {
    logger.info('No old FCM tokens to clean')
    return
  }

  const batch = db.batch()
  let deleteCount = 0

  snapshot.docs.forEach((doc) => {
    // Usuń cały dokument użytkownika jeśli jest stary
    batch.delete(doc.ref)
    deleteCount++
  })

  await batch.commit()
  logger.info(`🗑️ Deleted ${deleteCount} old user documents with FCM tokens`)
}

/**
 * Usuń harmonogramy starsze niż 1 rok (365 dni)
 */
async function cleanupOldSchedules() {
  const oneYearAgo = Timestamp.fromDate(
    new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
  )

  const usersRef = db.collection('users')
  const snapshot = await usersRef.get()

  if (snapshot.empty) {
    logger.info('No users to check for old schedules')
    return
  }

  let updateCount = 0
  const batch = db.batch()

  snapshot.docs.forEach((doc) => {
    const data = doc.data()
    
    if (!data.schedule || !Array.isArray(data.schedule)) {
      return
    }

    // Filtruj harmonogram - zostaw tylko dyżury z ostatniego roku
    const recentSchedule = data.schedule.filter((duty: any) => {
      // Sprawdź czy dyżur ma datę
      if (!duty.date) return true // Zachowaj jeśli brak daty (na wszelki wypadek)
      
      try {
        const dutyDate = new Date(duty.date)
        return dutyDate >= oneYearAgo.toDate()
      } catch {
        return true // Zachowaj jeśli nieprawidłowa data
      }
    })

    // Jeśli coś zostało usunięte, zaktualizuj dokument
    if (recentSchedule.length < data.schedule.length) {
      if (recentSchedule.length === 0) {
        // Jeśli wszystkie dyżury są stare, usuń cały harmonogram
        batch.update(doc.ref, { schedule: [] })
      } else {
        // Zaktualizuj harmonogram
        batch.update(doc.ref, { schedule: recentSchedule })
      }
      updateCount++
    }
  })

  if (updateCount > 0) {
    await batch.commit()
    logger.info(`🗑️ Cleaned up old schedules for ${updateCount} users`)
  } else {
    logger.info('No old schedules to clean')
  }
}

/**
 * Usuń nieaktywne tokeny FCM (tokeny które zwracają błąd)
 * Wywołaj tę funkcję po próbie wysłania powiadomienia
 */
export async function removeInvalidFCMToken(token: string) {
  try {
    const usersRef = db.collection('users')
    const snapshot = await usersRef.where('fcmToken', '==', token).get()

    if (snapshot.empty) {
      return
    }

    const batch = db.batch()
    snapshot.docs.forEach((doc) => {
      // Usuń token (możesz też usunąć cały dokument)
      batch.update(doc.ref, { fcmToken: null })
    })

    await batch.commit()
    logger.info(`🗑️ Removed invalid FCM token: ${token.substring(0, 20)}...`)
  } catch (error) {
    logger.error('Error removing invalid token:', error)
  }
}

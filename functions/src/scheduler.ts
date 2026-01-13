import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { Duty } from './types'
import { getTargetTime, getDayName } from './utils/dateTime'

// Funkcja wywoływana co 1 minutę przez Cloud Scheduler
export const checkUpcomingDuties = functions.pubsub
  .schedule('every 1 minutes')
  .timeZone('Europe/Warsaw')
  .onRun(async (context) => {
    const now = new Date()
    const currentDay = getDayName(now)
    
    // Oblicz czas za 10 minut w strefie PL
    const notificationTime = new Date(now.getTime() + 10 * 60 * 1000)
    const targetTime = getTargetTime(notificationTime)

    console.log(`Checking duties for ${currentDay} at target time: ${targetTime} (now: ${now.toISOString()})`)

    // Pobierz wszystkich użytkowników
    const usersSnapshot = await admin.firestore().collection('users').get()

    // Zabezpieczenie: jeśli liczba użytkowników przekracza 500, zatrzymaj działanie
    if (usersSnapshot.size > 500) {
      console.error(`ALERT: Wykryto ${usersSnapshot.size} użytkowników (max: 500). Funkcja wstrzymana.`)
      return null
    }

    const notifications: Promise<any>[] = []

    // Funkcja do normalizacji czasu (usuwa wiodące zero dla porównania)
    const normalizeTime = (time: string) => {
      if (!time) return ''
      return time.replace(/^0/, '')
    }

    usersSnapshot.forEach((userDoc) => {
      const userData = userDoc.data()
      const { fcmToken, teacherName, schedule } = userData

      if (!fcmToken || !teacherName || !schedule) {
        return
      }

      // Sprawdź, czy nauczyciel ma dyżur za 10 minut
      const upcomingDuty = schedule.find(
        (duty: Duty) =>
          duty.teacher === teacherName &&
          duty.day.toLowerCase() === currentDay.toLowerCase() &&
          normalizeTime(duty.time) === normalizeTime(targetTime)
      )

      if (upcomingDuty) {
        // Wyślij powiadomienie
        const message = {
          notification: {
            title: 'Przypomnienie o dyżurze',
            body: `Za 10 min: dyżur ${upcomingDuty.location}`,
          },
          token: fcmToken,
          webpush: {
            fcmOptions: {
              link: '/', // Otwiera stronę główną aplikacji
            },
          },
        }

        notifications.push(
          admin
            .messaging()
            .send(message)
            .then(() => console.log(`Powiadomienie wysłane do ${teacherName}`))
            .catch((error) =>
              console.error(`Błąd wysyłania do ${teacherName}:`, error)
            )
        )
      }
    })

    await Promise.all(notifications)
    console.log(`Sprawdzono ${usersSnapshot.size} użytkowników, wysłano ${notifications.length} powiadomień`)

    return null
  })

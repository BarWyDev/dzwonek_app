import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { Duty } from './types'

// Funkcja HTTP do testowania powiadomień lokalnie
// Wywołanie: POST http://localhost:5001/dzwonek-app/us-central1/testNotification
// Body: { "teacherName": "Jan Kowalski", "minutesOffset": 10 }
export const testNotification = functions.https.onRequest(async (req, res) => {
  // CORS dla lokalnego testowania
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.set('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(204).send('')
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed. Use POST.' })
    return
  }

  try {
    const { teacherName, minutesOffset = 10 } = req.body

    if (!teacherName) {
      res.status(400).json({ error: 'teacherName is required' })
      return
    }

    // Znajdź użytkownika po nazwisku
    const usersSnapshot = await admin
      .firestore()
      .collection('users')
      .where('teacherName', '==', teacherName)
      .limit(1)
      .get()

    if (usersSnapshot.empty) {
      res.status(404).json({
        error: `Nie znaleziono użytkownika: ${teacherName}`,
        hint: 'Upewnij się, że nauczyciel wybrał swoje nazwisko i załadował plan w aplikacji'
      })
      return
    }

    const userDoc = usersSnapshot.docs[0]
    const userData = userDoc.data()
    const { fcmToken, schedule } = userData

    if (!fcmToken) {
      res.status(400).json({ error: 'Użytkownik nie ma zarejestrowanego FCM tokenu' })
      return
    }

    if (!schedule || schedule.length === 0) {
      res.status(400).json({ error: 'Użytkownik nie ma załadowanego planu dyżurów' })
      return
    }

    // Znajdź pierwszy dyżur dla tego nauczyciela
    const duty = schedule.find((d: Duty) => d.teacher === teacherName)

    if (!duty) {
      res.status(404).json({
        error: `Nie znaleziono dyżuru dla ${teacherName}`,
        availableDuties: schedule.length
      })
      return
    }

    // Wyślij testowe powiadomienie
    const message = {
      notification: {
        title: 'TEST: Przypomnienie o dyżurze',
        body: `Za ${minutesOffset} min: dyżur ${duty.location} (${duty.day} ${duty.time})`,
      },
      token: fcmToken,
      webpush: {
        notification: {
          title: 'TEST: Przypomnienie o dyżurze',
          body: `Za ${minutesOffset} min: dyżur ${duty.location} (${duty.day} ${duty.time})`,
          icon: '/icons/icon-192x192.png',
        },
        fcmOptions: {
          link: 'https://dzwonek.byst.re/',
        },
      },
    }

    const response = await admin.messaging().send(message)

    res.status(200).json({
      success: true,
      messageId: response,
      sentTo: teacherName,
      duty: {
        day: duty.day,
        time: duty.time,
        location: duty.location,
      },
      message: `Powiadomienie testowe wysłane do ${teacherName}`,
    })
  } catch (error: any) {
    console.error('Błąd wysyłania testowego powiadomienia:', error)

    // Sprawdź czy błąd związany z nieprawidłowym tokenem
    const errorCode = error?.code || error?.errorInfo?.code
    const isTokenError =
      errorCode === 'messaging/invalid-registration-token' ||
      errorCode === 'messaging/registration-token-not-registered' ||
      errorCode === 'messaging/invalid-argument'

    res.status(500).json({
      error: 'Internal server error',
      details: error.message,
      errorCode,
      isTokenError,
      hint: isTokenError ? 'Token FCM jest nieprawidłowy. Użytkownik musi ponownie włączyć powiadomienia w aplikacji.' : undefined,
    })
  }
})

// Funkcja do listowania wszystkich użytkowników (pomocnicza do debugowania)
export const listUsers = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')

  try {
    const usersSnapshot = await admin.firestore().collection('users').get()

    const users = usersSnapshot.docs.map((doc) => {
      const token = doc.data().fcmToken || ''
      return {
        teacherName: doc.data().teacherName,
        hasToken: !!token,
        tokenLength: token.length,
        tokenPrefix: token.substring(0, 30) + '...',
        dutiesCount: doc.data().schedule?.length || 0,
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || 'unknown',
      }
    })

    res.status(200).json({
      count: users.length,
      users,
    })
  } catch (error: any) {
    res.status(500).json({
      error: 'Internal server error',
      details: error.message,
    })
  }
})

// Debug endpoint - pokazuje szczegóły dyżurów użytkownika
export const debugSchedule = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')

  try {
    const teacherName = req.query.teacher as string

    const usersSnapshot = await admin.firestore().collection('users').get()

    if (usersSnapshot.empty) {
      res.status(404).json({ error: 'Brak użytkowników' })
      return
    }

    // Znajdź użytkownika po nazwisku lub weź pierwszego
    let userDoc = usersSnapshot.docs[0]
    if (teacherName) {
      const found = usersSnapshot.docs.find(doc => doc.data().teacherName === teacherName)
      if (found) userDoc = found
    }

    const userData = userDoc.data()
    const schedule = userData.schedule || []

    // Grupuj dyżury po dniu
    const byDay: Record<string, any[]> = {}
    schedule.forEach((duty: Duty) => {
      const day = duty.day || 'unknown'
      if (!byDay[day]) byDay[day] = []
      byDay[day].push({
        time: duty.time,
        location: duty.location,
        teacher: duty.teacher,
      })
    })

    // Posortuj dyżury według czasu w każdym dniu
    Object.keys(byDay).forEach(day => {
      byDay[day].sort((a, b) => (a.time || '').localeCompare(b.time || ''))
    })

    // Pokaż unikalne czasy
    const uniqueTimes = [...new Set(schedule.map((d: Duty) => d.time))].sort()

    // Pokaż dyżury dla wybranego nauczyciela
    const teacherDuties = schedule.filter((d: Duty) => d.teacher === userData.teacherName)
    const mondayDuties = teacherDuties.filter((d: Duty) => d.day?.toLowerCase() === 'poniedziałek')

    res.status(200).json({
      teacherName: userData.teacherName,
      totalDuties: schedule.length,
      teacherDutiesCount: teacherDuties.length,
      uniqueTimes,
      mondayDuties: mondayDuties.map((d: Duty) => ({
        time: d.time,
        location: d.location,
        day: d.day,
      })),
      sampleDuties: schedule.slice(0, 10).map((d: Duty) => ({
        day: d.day,
        time: d.time,
        location: d.location,
        teacher: d.teacher,
      })),
    })
  } catch (error: any) {
    res.status(500).json({
      error: 'Internal server error',
      details: error.message,
    })
  }
})

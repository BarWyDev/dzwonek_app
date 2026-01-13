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
        fcmOptions: {
          link: '/',
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
    res.status(500).json({
      error: 'Internal server error',
      details: error.message,
    })
  }
})

// Funkcja do listowania wszystkich użytkowników (pomocnicza do debugowania)
export const listUsers = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')

  try {
    const usersSnapshot = await admin.firestore().collection('users').get()

    const users = usersSnapshot.docs.map((doc) => ({
      teacherName: doc.data().teacherName,
      hasToken: !!doc.data().fcmToken,
      dutiesCount: doc.data().schedule?.length || 0,
    }))

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

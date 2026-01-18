import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { removeInvalidFCMToken } from './cleanup'

interface NotificationRequest {
  fcmToken: string
  title: string
  body: string
  link?: string
}

// Funkcja pomocnicza do wysyłania pojedynczego powiadomienia
export const sendNotification = functions.https.onCall(
  async (data: NotificationRequest, context) => {
    const { fcmToken, title, body, link } = data

    if (!fcmToken || !title || !body) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing required fields: fcmToken, title, body'
      )
    }

    try {
      const message = {
        notification: {
          title,
          body,
        },
        token: fcmToken,
        webpush: link
          ? {
              fcmOptions: {
                link,
              },
            }
          : undefined,
      }

      const response = await admin.messaging().send(message)
      console.log('Successfully sent message:', response)

      return { success: true, messageId: response }
    } catch (error: any) {
      console.error('Error sending message:', error)

      // Usuń nieaktywny token jeśli błąd związany z tokenem
      const errorCode = error?.code || error?.errorInfo?.code
      if (
        errorCode === 'messaging/invalid-registration-token' ||
        errorCode === 'messaging/registration-token-not-registered' ||
        errorCode === 'messaging/invalid-argument'
      ) {
        console.log(`🗑️ Removing invalid FCM token: ${fcmToken.substring(0, 20)}...`)
        await removeInvalidFCMToken(fcmToken)
      }

      throw new functions.https.HttpsError(
        'internal',
        'Failed to send notification'
      )
    }
  }
)

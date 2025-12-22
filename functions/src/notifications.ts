import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

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
    } catch (error) {
      console.error('Error sending message:', error)
      throw new functions.https.HttpsError(
        'internal',
        'Failed to send notification'
      )
    }
  }
)

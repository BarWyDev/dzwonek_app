import { useEffect } from 'react'
import { onMessage } from 'firebase/messaging'
import { messaging } from '../services/firebase'
import toast from 'react-hot-toast'

export function useNotifications() {
  useEffect(() => {
    // Nasłuchiwanie powiadomień w foreground
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Received foreground message:', payload)

      if (payload.notification) {
        toast(payload.notification.body || 'Nowe powiadomienie', {
          icon: '🔔',
          duration: 5000,
        })

        // Pokaż również natywne powiadomienie (jeśli permissions są przyznane)
        if (Notification.permission === 'granted') {
          new Notification(payload.notification.title || 'Dzwonek App', {
            body: payload.notification.body,
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-192x192.png',
          })
        }
      }
    })

    return () => unsubscribe()
  }, [])
}

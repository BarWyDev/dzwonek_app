import { NotificationPayload } from '../types'

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  return false
}

export function showNotification(payload: NotificationPayload): void {
  if (Notification.permission !== 'granted') {
    console.warn('Notification permission not granted')
    return
  }

  new Notification(payload.title, {
    body: payload.body,
    icon: payload.icon || '/icons/icon-192x192.png',
    badge: payload.badge || '/icons/icon-192x192.png',
    tag: payload.tag,
  })
}

export function isNotificationSupported(): boolean {
  return 'Notification' in window && 'serviceWorker' in navigator
}

import * as admin from 'firebase-admin'

admin.initializeApp()

export { checkUpcomingDuties } from './scheduler'
export { sendNotification } from './notifications'
export { testNotification, listUsers } from './testNotifications'
export { cleanupOldData } from './cleanup'

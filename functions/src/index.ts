import * as admin from 'firebase-admin'

admin.initializeApp()

export { checkUpcomingDuties } from './scheduler'
export { sendNotification } from './notifications'

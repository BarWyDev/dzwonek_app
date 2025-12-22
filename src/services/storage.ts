import { Duty } from '../types'

const STORAGE_KEYS = {
  TEACHER_NAME: 'teacherName',
  SCHEDULE: 'schedule',
  FCM_TOKEN: 'fcmToken',
  LAST_UPDATE: 'lastUpdate',
}

export function saveTeacherName(name: string): void {
  localStorage.setItem(STORAGE_KEYS.TEACHER_NAME, name)
}

export function getTeacherName(): string | null {
  return localStorage.getItem(STORAGE_KEYS.TEACHER_NAME)
}

export function saveSchedule(schedule: Duty[]): void {
  localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(schedule))
  localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, new Date().toISOString())
}

export function getSchedule(): Duty[] {
  const data = localStorage.getItem(STORAGE_KEYS.SCHEDULE)
  if (!data) return []

  try {
    return JSON.parse(data)
  } catch {
    return []
  }
}

export function getFCMToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.FCM_TOKEN)
}

export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key)
  })
}

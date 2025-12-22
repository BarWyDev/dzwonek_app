export interface Duty {
  id: string
  day: string          // "Poniedziałek", "Wtorek", etc.
  break: string        // "Przerwa 1", "Przerwa 2", etc.
  location: string     // "Korytarz 1. piętro", "Stołówka", etc.
  teacher: string      // "Kowalski Jan"
  time: string         // "08:50" (format HH:MM)
  date?: Date          // Obliczona data następnego dyżuru
}

export interface Teacher {
  name: string
  dutyCount: number
}

export interface AppConfig {
  teacherName: string | null
  schedule: Duty[]
  fcmToken: string | null
  lastUpdate: Date | null
}

export interface NotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
}

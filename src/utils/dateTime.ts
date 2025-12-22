const DAYS_OF_WEEK = [
  'Niedziela',
  'Poniedziałek',
  'Wtorek',
  'Środa',
  'Czwartek',
  'Piątek',
  'Sobota',
]

export function getDayIndex(dayName: string): number {
  const normalized = dayName.trim()
  const index = DAYS_OF_WEEK.findIndex(
    (d) => d.toLowerCase() === normalized.toLowerCase()
  )
  return index === -1 ? 1 : index // Default to Monday if not found
}

export function getNextDutyTime(dayName: string, time: string): Date {
  const now = new Date()
  const targetDayIndex = getDayIndex(dayName)
  const currentDayIndex = now.getDay()

  // Oblicz różnicę dni
  let daysUntilTarget = targetDayIndex - currentDayIndex
  if (daysUntilTarget < 0) {
    daysUntilTarget += 7
  }

  // Jeśli to dzisiaj, sprawdź czy godzina już minęła
  if (daysUntilTarget === 0) {
    const [hours, minutes] = time.split(':').map(Number)
    const targetTime = new Date(now)
    targetTime.setHours(hours, minutes, 0, 0)

    if (targetTime <= now) {
      daysUntilTarget = 7 // Następny tydzień
    }
  }

  // Utwórz datę docelową
  const targetDate = new Date(now)
  targetDate.setDate(now.getDate() + daysUntilTarget)

  const [hours, minutes] = time.split(':').map(Number)
  targetDate.setHours(hours, minutes, 0, 0)

  return targetDate
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('pl-PL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

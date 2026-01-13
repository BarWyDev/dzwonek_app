export function getCurrentTime(date: Date): string {
  return date.toLocaleTimeString('pl-PL', {
    timeZone: 'Europe/Warsaw',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

export function getTargetTime(date: Date): string {
  return date.toLocaleTimeString('pl-PL', {
    timeZone: 'Europe/Warsaw',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

export function getDayName(date: Date): string {
  const dayName = date.toLocaleDateString('pl-PL', {
    timeZone: 'Europe/Warsaw',
    weekday: 'long'
  })
  return dayName.charAt(0).toUpperCase() + dayName.slice(1)
}

export function formatDateTime(date: Date): string {
  return date.toLocaleString('pl-PL', {
    timeZone: 'Europe/Warsaw',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

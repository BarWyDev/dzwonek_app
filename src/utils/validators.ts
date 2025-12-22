import { Duty } from '../types'

export function validateDuty(duty: Partial<Duty>): boolean {
  return !!(
    duty.day &&
    duty.break &&
    duty.location &&
    duty.teacher &&
    duty.time &&
    isValidTime(duty.time)
  )
}

export function isValidTime(time: string): boolean {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  return timeRegex.test(time)
}

export function validateExcelFile(file: File): boolean {
  const validExtensions = ['.xlsx', '.xls']
  const fileName = file.name.toLowerCase()
  return validExtensions.some((ext) => fileName.endsWith(ext))
}

export function sanitizeTeacherName(name: string): string {
  return name.trim().replace(/\s+/g, ' ')
}

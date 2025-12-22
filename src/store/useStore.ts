import { create } from 'zustand'
import { Duty } from '../types'
import { saveTeacherName, saveSchedule, getTeacherName, getSchedule, clearAllData } from '../services/storage'

interface AppState {
  teacherName: string | null
  schedule: Duty[]
  teachers: string[]
  fcmToken: string | null

  setTeacherName: (name: string) => void
  setSchedule: (schedule: Duty[]) => void
  setTeachers: (teachers: string[]) => void
  setFCMToken: (token: string) => void
  reset: () => void
  loadFromStorage: () => void
}

export const useStore = create<AppState>((set) => ({
  teacherName: null,
  schedule: [],
  teachers: [],
  fcmToken: null,

  setTeacherName: (name) => {
    saveTeacherName(name)
    set({ teacherName: name })
  },

  setSchedule: (schedule) => {
    saveSchedule(schedule)
    set({ schedule })
  },

  setTeachers: (teachers) => {
    set({ teachers })
  },

  setFCMToken: (token) => {
    set({ fcmToken: token })
  },

  reset: () => {
    clearAllData()
    set({
      teacherName: null,
      schedule: [],
      teachers: [],
      fcmToken: null,
    })
  },

  loadFromStorage: () => {
    const teacherName = getTeacherName()
    const schedule = getSchedule()
    set({ teacherName, schedule })
  },
}))

// Load from storage on initialization
useStore.getState().loadFromStorage()

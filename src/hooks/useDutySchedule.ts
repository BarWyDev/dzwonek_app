import { useMemo, useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { isSameDay, getNextDutyTime } from '../utils/dateTime'

export function useDutySchedule() {
  const { teacherName, schedule } = useStore()
  // Dodajemy timestamp, który będzie aktualizowany co minutę
  // aby wymusić przeliczenie nextDuty i todayDuties
  const [currentTime, setCurrentTime] = useState(Date.now())

  useEffect(() => {
    // Aktualizuj co 60 sekund
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const myDuties = useMemo(() => {
    if (!teacherName) return []
    return schedule.filter((duty) => duty.teacher === teacherName)
  }, [teacherName, schedule])

  const todayDuties = useMemo(() => {
    const today = new Date()
    return myDuties.filter((duty) => {
      // Znajdź następne wystąpienie tego dyżuru
      const dutyDate = getNextDutyTime(duty.day, duty.time)
      return isSameDay(dutyDate, today)
    })
  }, [myDuties, currentTime]) // Dodano currentTime do dependencies

  const nextDuty = useMemo(() => {
    const now = new Date()
    const upcomingDuties = myDuties
      .map((duty) => ({
        ...duty,
        date: getNextDutyTime(duty.day, duty.time),
      }))
      .filter((duty) => duty.date > now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())

    return upcomingDuties[0] || null
  }, [myDuties, currentTime]) // Dodano currentTime do dependencies

  const timeUntilNext = () => {
    if (!nextDuty) return 0
    const now = new Date()
    return Math.max(0, nextDuty.date!.getTime() - now.getTime())
  }

  return {
    myDuties,
    todayDuties,
    nextDuty,
    timeUntilNext,
  }
}

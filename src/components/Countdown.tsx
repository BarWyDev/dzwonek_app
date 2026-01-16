import { useState, useEffect } from 'react'
import { Clock, Bell } from 'lucide-react'
import { useDutySchedule } from '../hooks/useDutySchedule'

export default function Countdown() {
  const { nextDuty, timeUntilNext } = useDutySchedule()
  const [timeLeft, setTimeLeft] = useState(timeUntilNext())

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(timeUntilNext())
    }, 1000)

    return () => clearInterval(interval)
  }, [timeUntilNext])

  if (!nextDuty) {
    return (
      <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="flex items-center gap-3">
          <Bell className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Brak nadchodzących dyżurów</h2>
            <p className="opacity-90">Ciesz się wolnym czasem!</p>
          </div>
        </div>
      </div>
    )
  }

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((ms % (1000 * 60)) / 1000)

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    }
    return `${seconds}s`
  }

  return (
    <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Następny dyżur</h2>
            <p className="opacity-90">{nextDuty.location} • {nextDuty.time}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-6 h-6" />
          <span className="text-3xl font-bold">{formatTime(timeLeft)}</span>
        </div>
      </div>
    </div>
  )
}

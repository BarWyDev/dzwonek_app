import { Clock, MapPin } from 'lucide-react'
import { useStore } from '../store/useStore'
import { useDutySchedule } from '../hooks/useDutySchedule'

export default function DutyList() {
  const { teacherName } = useStore()
  const { todayDuties } = useDutySchedule()

  if (!teacherName) {
    return null
  }

  if (todayDuties.length === 0) {
    return (
      <div className="card">
        <p className="text-gray-500 text-center py-8">
          Dzisiaj nie masz żadnych dyżurów 🎉
        </p>
      </div>
    )
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Dzisiejsze dyżury</h2>
      <div className="space-y-3">
        {todayDuties.map((duty) => (
          <div
            key={duty.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary-500" />
              <div>
                <p className="font-medium">{duty.location}</p>
                <p className="text-sm text-gray-600">{duty.break}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{duty.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

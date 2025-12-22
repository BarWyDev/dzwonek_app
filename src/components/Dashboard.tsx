import { useState, useEffect } from 'react'
import FileUpload from './FileUpload'
import TeacherSelect from './TeacherSelect'
import DutyList from './DutyList'
import Countdown from './Countdown'
import ResetButton from './ResetButton'
import IOSInstallPrompt from './IOSInstallPrompt'
import { useStore } from '../store/useStore'

export default function Dashboard() {
  const { teacherName, schedule } = useStore()
  const [showUpload, setShowUpload] = useState(!teacherName || schedule.length === 0)

  useEffect(() => {
    setShowUpload(!teacherName || schedule.length === 0)
  }, [teacherName, schedule])

  return (
    <div className="space-y-6">
      <IOSInstallPrompt />

      {showUpload ? (
        <div className="space-y-4">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Witaj!</h2>
            <p className="text-gray-600 mb-4">
              Zacznij od wgrania pliku Excel z planem dyżurów.
            </p>
            <FileUpload />
          </div>

          {schedule.length > 0 && !teacherName && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Wybierz swoje nazwisko</h2>
              <TeacherSelect />
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <Countdown />
          <DutyList />
          <div className="flex justify-end">
            <ResetButton />
          </div>
        </div>
      )}
    </div>
  )
}

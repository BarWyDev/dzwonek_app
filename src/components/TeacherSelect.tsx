import { useState } from 'react'
import { useStore } from '../store/useStore'
import toast from 'react-hot-toast'
import { registerFCMToken } from '../services/fcm'

export default function TeacherSelect() {
  const { teachers, teacherName, setTeacherName, schedule, setFCMToken } = useStore()
  const [isConsentGiven, setIsConsentGiven] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)

  const handleSelect = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const name = event.target.value
    if (!name) return

    if (!isConsentGiven) {
      toast.error('Musisz wyrazić zgodę na przetwarzanie danych, aby otrzymywać powiadomienia.')
      return
    }

    setIsRegistering(true)
    const loadingToast = toast.loading('Rejestrowanie powiadomień...')

    try {
      // Najpierw ustaw nazwisko, aby registerFCMToken miało dostęp do aktualnego stanu (opcjonalnie)
      setTeacherName(name)
      
      // Rejestracja w FCM i Firestore
      const token = await registerFCMToken(name, schedule)
      setFCMToken(token)
      
      toast.success(`Zarejestrowano pomyślnie: ${name}`, { id: loadingToast })
    } catch (error) {
      console.error('Błąd rejestracji:', error)
      toast.error('Nie udało się zarejestrować powiadomień. Spróbuj ponownie.', { id: loadingToast })
    } finally {
      setIsRegistering(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
        <input
          type="checkbox"
          id="consent"
          checked={isConsentGiven}
          onChange={(e) => setIsConsentGiven(e.target.checked)}
          className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="consent" className="text-sm text-gray-700">
          Zgadzam się na przetwarzanie mojego harmonogramu w celu realizacji powiadomień Push (RODO).
        </label>
      </div>

      <select
        value={teacherName || ''}
        onChange={handleSelect}
        disabled={isRegistering}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
      >
        <option value="">-- Wybierz nauczyciela --</option>
        {teachers.map((teacher) => (
          <option key={teacher} value={teacher}>
            {teacher}
          </option>
        ))}
      </select>
      
      {isRegistering && (
        <p className="text-xs text-center text-gray-500 animate-pulse">
          Trwa konfiguracja powiadomień...
        </p>
      )}
    </div>
  )
}

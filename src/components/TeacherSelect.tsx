import { useStore } from '../store/useStore'
import toast from 'react-hot-toast'

export default function TeacherSelect() {
  const { teachers, teacherName, setTeacherName } = useStore()

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const name = event.target.value
    setTeacherName(name)
    toast.success(`Wybrano: ${name}`)
  }

  return (
    <div>
      <select
        value={teacherName || ''}
        onChange={handleSelect}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        <option value="">-- Wybierz nauczyciela --</option>
        {teachers.map((teacher) => (
          <option key={teacher} value={teacher}>
            {teacher}
          </option>
        ))}
      </select>
    </div>
  )
}

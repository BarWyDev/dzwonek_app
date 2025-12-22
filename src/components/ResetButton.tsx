import { RotateCcw } from 'lucide-react'
import { useStore } from '../store/useStore'
import toast from 'react-hot-toast'

export default function ResetButton() {
  const { reset } = useStore()

  const handleReset = () => {
    if (confirm('Czy na pewno chcesz wyczyścić wszystkie dane?')) {
      reset()
      toast.success('Dane zostały wyczyszczone')
    }
  }

  return (
    <button
      onClick={handleReset}
      className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
    >
      <RotateCcw className="w-4 h-4" />
      Wyczyść dane
    </button>
  )
}

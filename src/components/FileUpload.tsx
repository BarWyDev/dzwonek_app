import { useRef } from 'react'
import { Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { parseExcel, getUniqueTeachers } from '../services/excelParser'
import { useStore } from '../store/useStore'

export default function FileUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { setSchedule, setTeachers } = useStore()

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      toast.loading('Przetwarzanie pliku...', { id: 'parse' })

      const duties = await parseExcel(file)
      const teachers = getUniqueTeachers(duties)

      setSchedule(duties)
      setTeachers(teachers)

      toast.success(`Wczytano ${duties.length} dyżurów`, { id: 'parse' })
    } catch (error) {
      console.error('Error parsing file:', error)
      toast.error('Błąd podczas przetwarzania pliku', { id: 'parse' })
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="btn-primary cursor-pointer inline-flex items-center gap-2"
      >
        <Upload className="w-5 h-5" />
        Wgraj plik Excel
      </label>
    </div>
  )
}

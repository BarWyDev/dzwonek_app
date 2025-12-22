import * as XLSX from 'xlsx'
import { Duty } from '../types'

export async function parseExcel(file: File): Promise<Duty[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })

        // Zakładając, że dane są w pierwszym arkuszu
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]

        // Konwersja do JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet)

        // Parsowanie według szablonu (DO DOSTOSOWANIA!)
        const duties: Duty[] = []

        // PRZYKŁAD: iteracja po wierszach i kolumnach
        // Struktura będzie zależeć od rzeczywistego szablonu Excel
        jsonData.forEach((row: any, index: number) => {
          // Logika parsowania zależna od struktury pliku
          // Np. jeśli kolumny to: Dzień | Przerwa | Lokalizacja | Nauczyciel | Godzina
          if (row['Nauczyciel'] && row['Dzień'] && row['Przerwa']) {
            duties.push({
              id: `duty-${index}`,
              day: row['Dzień'] || '',
              break: row['Przerwa'] || '',
              location: row['Lokalizacja'] || row['Miejsce'] || '',
              teacher: row['Nauczyciel'] || '',
              time: row['Godzina'] || row['Czas'] || '',
            })
          }
        })

        if (duties.length === 0) {
          reject(new Error('Nie znaleziono dyżurów w pliku'))
        }

        resolve(duties)
      } catch (error) {
        reject(new Error('Błąd parsowania pliku Excel'))
      }
    }

    reader.onerror = () => reject(new Error('Błąd odczytu pliku'))
    reader.readAsBinaryString(file)
  })
}

// Ekstrakcja unikalnych nazwisk
export function getUniqueTeachers(duties: Duty[]): string[] {
  const teachers = duties.map((d) => d.teacher)
  return [...new Set(teachers)].sort()
}

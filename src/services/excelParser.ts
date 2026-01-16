import * as XLSX from 'xlsx'
import { Duty } from '../types'

/**
 * Parser dla pliku Excel z dyżurami w formacie:
 * - Dni tygodnia w kolumnach (Poniedziałek, Wtorek, Środa, Czwartek, Piątek)
 * - Każdy wiersz = jedna przerwa z godziną i lokalizacją
 * - Nauczyciele dla każdego dnia w odpowiednich kolumnach
 */

// Mapowanie dni tygodnia do indeksów kolumn (bazując na analizie pliku)
const DAY_COLUMNS = {
  'Poniedziałek': [4, 5, 6],  // Kolumny dla nauczycieli w poniedziałek
  'Wtorek': [7, 8, 9],
  'Środa': [10, 11, 12],
  'Czwartek': [13, 14, 15],
  'Piątek': [16, 17, 18],
}

/**
 * Normalizuje nazwisko:
 * - usuwa nadmiarowe spacje
 * - ujednolica spacje wokół myślników (usuwa spacje)
 * - zamienia wielokrotne spacje na pojedyncze
 */
export function normalizeTeacherName(name: string): string {
  return name
    .trim()
    // Zamień myślniki ze spacjami na myślnik bez spacji
    .replace(/\s*-\s*/g, '-')
    // Usuń wielokrotne spacje
    .replace(/\s+/g, ' ')
    .trim()
}

export async function parseExcel(file: File): Promise<Duty[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })

        // Znajdź arkusz "DYŻURY" lub użyj pierwszego
        const sheetName = workbook.SheetNames.find(name => name === 'DYŻURY') || workbook.SheetNames[0]

        if (!sheetName) {
          reject(new Error('Plik Excel nie zawiera żadnych arkuszy'))
          return
        }

        const sheet = workbook.Sheets[sheetName]

        // Konwersja do surowej tablicy (bez nagłówków)
        const rawData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' })

        const duties: Duty[] = []
        let dutyIdCounter = 0
        
        let currentBreakNumber = ''
        let currentStartTime = ''

        // Iteruj przez wiersze zaczynając od wiersza 2 (indeks 2)
        // Wiersz 0 i 1 to nagłówki
        for (let rowIndex = 2; rowIndex < rawData.length; rowIndex++) {
          const row = rawData[rowIndex]

          // Kolumna 1: numer przerwy (może być pusta jeśli to kolejna lokalizacja dla tej samej przerwy)
          // Kolumna 2: godzina (np. "7:00-7:30")
          // Kolumna 3: lokalizacja (np. "s.3,4" lub "0" dla piętra)
          const breakNumber = row[1]
          const timeRange = row[2]
          let location = row[3]

          // Aktualizuj bieżącą przerwę i czas jeśli są podane
          if (breakNumber && breakNumber !== '') {
            currentBreakNumber = breakNumber.toString()
          }
          
          if (timeRange && typeof timeRange === 'string') {
            const match = timeRange.match(/(\d{1,2}:\d{2})/)
            if (match) {
              currentStartTime = match[1]
            }
          }

          // Jeśli nie mamy jeszcze przerwy ani czasu, pomiń
          if (!currentBreakNumber || !currentStartTime) continue

          // Jeśli lokalizacja to liczba (0, 1, 2), oznacza to piętro
          if (location === 0 || location === 1 || location === 2 || location === '0' || location === '1' || location === '2') {
            location = `Piętro ${location}`
          }

          // Sprawdź czy mamy jakąkolwiek lokalizację
          const finalLocation = location || 'Nieznana lokalizacja'

          // Dla każdego dnia tygodnia
          for (const [day, columns] of Object.entries(DAY_COLUMNS)) {
            // Sprawdź nauczycieli w kolumnach tego dnia
            const teachers = columns
              .map(colIndex => row[colIndex])
              .filter(teacher => teacher && teacher !== '' && typeof teacher === 'string')

            // Dla każdego nauczyciela utwórz osobny wpis dyżuru
            teachers.forEach(teacher => {
              const normalizedTeacher = normalizeTeacherName(teacher)
              
              // Sprawdź czy już nie mamy identycznego dyżuru (duplikat w Excel)
              const isDuplicate = duties.some(
                d => d.day === day && 
                     d.time === currentStartTime && 
                     d.location === finalLocation && 
                     d.teacher === normalizedTeacher
              )
              
              if (!isDuplicate) {
                duties.push({
                  id: `duty-${dutyIdCounter++}`,
                  day,
                  break: `Przerwa ${currentBreakNumber}`,
                  location: finalLocation,
                  teacher: normalizedTeacher,
                  time: currentStartTime,
                })
              }
            })
          }
        }

        console.log(`Sparsowano ${duties.length} dyżurów`)

        if (duties.length === 0) {
          reject(new Error('Nie znaleziono dyżurów w pliku. Sprawdź czy to właściwy plik Excel.'))
          return
        }

        resolve(duties)
      } catch (error) {
        console.error('Błąd parsowania pliku Excel:', error)
        reject(new Error(`Błąd parsowania pliku Excel: ${error instanceof Error ? error.message : 'Nieznany błąd'}`))
      }
    }

    reader.onerror = () => reject(new Error('Błąd odczytu pliku'))
    reader.readAsBinaryString(file)
  })
}

// Ekstrakcja unikalnych nazwisk
export function getUniqueTeachers(duties: Duty[]): string[] {
  const normalizedMap = new Map<string, string>()
  
  // Dla każdego nauczyciela znajdź znormalizowaną wersję
  duties.forEach((duty) => {
    const normalized = normalizeTeacherName(duty.teacher)
    // Zachowaj pierwszą wersję jako kanoniczną
    if (!normalizedMap.has(normalized)) {
      normalizedMap.set(normalized, duty.teacher)
    }
  })
  
  // Zwróć posortowane unikalne nazwiska
  return Array.from(normalizedMap.values())
    .map(normalizeTeacherName)
    .sort()
}

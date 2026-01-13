const XLSX = require('xlsx');
const path = require('path');

// Przygotowanie danych w formacie identycznym z oryginałem
// Kolumny: 0: pusty, 1: PRZERWA, 2: GODZINA, 3: lokalizacja, 4-6: Poniedziałek, 7-9: Wtorek, itd.
const data = [
  // Wiersz 0: Nagłówek wizualny (pusty)
  [],
  // Wiersz 1: Nagłówki kolumn
  ['', 'PRZERWA', '', 'piętro', 'Poniedziałek', '', '', 'Wtorek', '', '', 'Środa', '', '', 'Czwartek', '', '', 'Piątek'],
];

// Pobieramy aktualną godzinę i dodajemy 10-15 minut, aby test był "na teraz"
const now = new Date();
const testMinutes = now.getMinutes() + 11; // Za 11 minut (powiadomienie przychodzi na 10 min przed)
const testHours = now.getHours() + Math.floor(testMinutes / 60);
const displayMinutes = (testMinutes % 60).toString().padStart(2, '0');
const displayHours = testHours.toString().padStart(2, '0');
const timeStr = `${displayHours}:${displayMinutes}`;

// Wiersz 2: Dane dyżuru
data.push([
  '', 
  1,               // Nr przerwy
  `${timeStr}-15:00`, // Godzina rozpoczęcia i zakończenia
  '0',             // Lokalizacja (Piętro 0)
  'Testowy',       // Nauczyciel (Poniedziałek, kolumna 4)
  '',              // (Puste kolumny dla Poniedziałku)
  '',
  '',              // Wtorek
  '',
  '',
  '',              // Środa
  '',
  '',
  '',              // Czwartek
  '',
  '',
  ''               // Piątek
]);

// Dodatkowy wiersz dla innego nauczyciela
data.push([
  '', 
  2, 
  '15:10-15:20', 
  's.3,4', 
  'Wysocka', 
  '', 
  '', 
  '', 
  '', 
  '', 
  '', 
  '', 
  '', 
  '', 
  '', 
  '', 
  ''
]);

const ws = XLSX.utils.aoa_to_sheet(data);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "DYŻURY");

const fileName = 'test-dyzury.xlsx';
XLSX.writeFile(wb, fileName);

console.log(`Pomyślnie wygenerowano plik: ${fileName}`);
console.log(`Dodano dyżur dla "Testowy" na godzinę: ${timeStr} (Poniedziałek)`);

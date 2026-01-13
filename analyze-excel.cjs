const XLSX = require('xlsx');

// Wczytaj plik
const workbook = XLSX.readFile('plan-dyzurow.xlsx');

console.log('=== ANALIZA PLIKU EXCEL ===\n');
console.log('Arkusze w pliku:', workbook.SheetNames);
console.log('\n');

// Analizuj pierwszy arkusz
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

console.log(`Analizuję arkusz: "${sheetName}"\n`);

// Konwertuj do JSON
const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

console.log('Pierwsze 10 wierszy:');
console.log('='.repeat(80));
jsonData.slice(0, 10).forEach((row, i) => {
  console.log(`Wiersz ${i}:`, row);
});

console.log('\n');
console.log('Konwersja do JSON z nagłówkami (pierwsze 5 rekordów):');
console.log('='.repeat(80));
const jsonWithHeaders = XLSX.utils.sheet_to_json(sheet);
console.log(JSON.stringify(jsonWithHeaders.slice(0, 5), null, 2));

console.log('\n');
console.log('Nazwy kolumn (z pierwszego wiersza z danymi):');
if (jsonWithHeaders[0]) {
  console.log(Object.keys(jsonWithHeaders[0]));
}

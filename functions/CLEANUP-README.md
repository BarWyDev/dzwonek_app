# Automatyczne czyszczenie danych Firebase

## 📋 Co jest czyszczone?

### 1. Stare tokeny FCM (Firebase Cloud Messaging)
- **Kryteria:** Starsze niż 90 dni
- **Powód:** Użytkownicy mogli odinstalować aplikację, tokeny mogą wygasnąć
- **Akcja:** Usuwa cały dokument użytkownika

### 2. Stare harmonogramy dyżurów
- **Kryteria:** Dyżury starsze niż 1 rok (365 dni)
- **Powód:** Rok szkolny się skończył, stare dyżury są bezużyteczne
- **Akcja:** Usuwa tylko stare wpisy z `schedule[]`, zachowuje resztę

### 3. Nieaktywne tokeny FCM (automatycznie)
- **Kryteria:** Token zwrócił błąd przy wysyłaniu powiadomienia
- **Kody błędów:**
  - `messaging/invalid-registration-token`
  - `messaging/registration-token-not-registered`
  - `messaging/invalid-argument`
- **Akcja:** Usuwa token z dokumentu użytkownika

---

## ⏰ Harmonogram automatyczny

**Funkcja:** `cleanupOldData`  
**Harmonogram:** Codziennie o 3:00 rano (Europe/Warsaw)  
**Dlaczego 3:00?** Mało aktywny czas, nikt nie korzysta z aplikacji

---

## 🚀 Wdrożenie

### 1. Deploy funkcji na Firebase

```bash
cd functions
firebase deploy --only functions:cleanupOldData
```

### 2. Sprawdź czy funkcja jest wdrożona

Wejdź na:
- https://console.firebase.google.com/
- Wybierz projekt → Functions
- Powinieneś zobaczyć: `cleanupOldData (scheduled)`

### 3. Sprawdź logi

```bash
firebase functions:log --only cleanupOldData
```

---

## 🧪 Testowanie

### Ręczne uruchomienie funkcji (lokalnie)

Nie możesz uruchomić scheduled function ręcznie z konsoli, ale możesz:

1. **Zmienić harmonogram tymczasowo:**

```typescript
// W cleanup.ts zmień:
schedule: 'every 5 minutes',  // Zamiast 'every day 03:00'
```

2. **Deploy i poczekaj 5 minut**

```bash
firebase deploy --only functions:cleanupOldData
# Poczekaj 5 minut, sprawdź logi
firebase functions:log --only cleanupOldData
```

3. **Przywróć harmonogram:**

```typescript
schedule: 'every day 03:00',
```

```bash
firebase deploy --only functions:cleanupOldData
```

### Test nieaktywnych tokenów

Nieaktywne tokeny są automatycznie usuwane przy każdej próbie wysłania powiadomienia do nieistniejącego tokena.

**Test:**
1. Skopiuj token FCM z Firestore
2. Usuń aplikację z urządzenia (token stanie się nieaktywny)
3. Spróbuj wysłać powiadomienie przez `testNotification`
4. Sprawdź logi - powinien być komunikat: `🗑️ Removing invalid FCM token`

---

## 📊 Statystyki

Po każdym uruchomieniu funkcja loguje:

```
🧹 Starting cleanup job...
🗑️ Deleted X old user documents with FCM tokens
🗑️ Cleaned up old schedules for Y users
✅ Cleanup job completed successfully
```

**Gdzie zobaczyć?**
```bash
firebase functions:log --only cleanupOldData --lines 50
```

Lub w Firebase Console → Functions → cleanupOldData → Logs

---

## ⚙️ Konfiguracja

### Zmiana czasu czyszczenia

Edytuj `functions/src/cleanup.ts`:

```typescript
// FCM Tokens - domyślnie 90 dni
const ninetyDaysAgo = Timestamp.fromDate(
  new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // 👈 Zmień 90 na inną liczbę
)

// Harmonogramy - domyślnie 365 dni (1 rok)
const oneYearAgo = Timestamp.fromDate(
  new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // 👈 Zmień 365 na inną liczbę
)
```

### Zmiana harmonogramu uruchomienia

```typescript
export const cleanupOldData = onSchedule(
  {
    schedule: 'every day 03:00',  // 👈 Zmień godzinę lub częstotliwość
    timeZone: 'Europe/Warsaw',
    memory: '256MiB',
  },
  // ...
)
```

**Przykłady harmonogramów:**
- `every day 03:00` - codziennie o 3:00
- `every sunday 02:00` - co niedzielę o 2:00
- `every 6 hours` - co 6 godzin
- `0 3 * * *` - cron expression (codziennie o 3:00)

---

## 💰 Koszty

**Cloud Functions (scheduled):**
- Free tier: 3M wywołań/miesiąc
- Ta funkcja: ~30 wywołań/miesiąc (1x dziennie)
- **Koszt: 0 zł** (mieści się w darmowym tierze)

**Firestore operacje:**
- Każde czyszczenie to kilka read + kilka delete/update
- Przy ~50 użytkownikach: ~100 operacji/dzień
- Free tier: 50k read, 20k write/dzień
- **Koszt: 0 zł** (mieści się w darmowym tierze)

---

## ⚠️ Uwagi

### Bezpieczeństwo

- ✅ Funkcja NIE usuwa harmonogramów młodszych niż 1 rok
- ✅ Jeśli użytkownik wgra nowy plik Excel, jego dane zostaną zachowane
- ✅ Usuwane są tylko dokumenty starsze niż 90 dni BEZ aktualizacji

### Przywracanie danych

**Nie ma automatycznego backup!** Jeśli chcesz zachować historię:

1. **Eksportuj dane przed cleanupem:**
```bash
gcloud firestore export gs://twoj-bucket/backup-$(date +%Y%m%d)
```

2. **Lub wyłącz cleanup harmonogramów**, usuń z `cleanup.ts`:
```typescript
await cleanupOldSchedules()  // 👈 Wykomentuj lub usuń tę linię
```

---

## 🐛 Troubleshooting

### Funkcja się nie uruchamia

1. Sprawdź czy jest wdrożona:
```bash
firebase functions:list
```

2. Sprawdź logi błędów:
```bash
firebase functions:log
```

3. Sprawdź uprawnienia Cloud Scheduler w Google Cloud Console

### Funkcja działa, ale nic nie usuwa

1. Sprawdź logi - czy są dane do usunięcia?
```bash
firebase functions:log --only cleanupOldData
```

2. Może po prostu nie ma starych danych (wszystko jest świeże!)

3. Sprawdź daty w Firestore - może `createdAt` nie jest ustawione?

---

## 📚 Dodatkowe zasoby

- [Firebase Scheduled Functions](https://firebase.google.com/docs/functions/schedule-functions)
- [Cloud Scheduler cron syntax](https://cloud.google.com/scheduler/docs/configuring/cron-job-schedules)
- [Firestore batch operations](https://firebase.google.com/docs/firestore/manage-data/transactions)

# Instrukcja testowania lokalnego powiadomień

## Przegląd

Ten dokument opisuje jak przetestować system powiadomień lokalnie. **WAŻNE:** Firebase Cloud Messaging (FCM) **NIE działa** w emulatorach - powiadomienia muszą przechodzić przez prawdziwy FCM, ale możesz używać lokalnego Firestore i funkcji.

## Opcje testowania

### Opcja 1: Testowanie z prawdziwym FCM (ZALECANE)

To najlepszy sposób na pełne przetestowanie systemu lokalnie.

#### Krok 1: Zainstaluj zależności

```bash
# Frontend
pnpm install

# Backend (funkcje)
cd functions
npm install
cd ..
```

#### Krok 2: Uruchom emulatory Firebase

```bash
# Terminal 1 - uruchom emulatory
pnpm emulator
```

To uruchomi:
- Firestore Emulator: `http://localhost:8080`
- Functions Emulator: `http://localhost:5001`
- Emulator UI: `http://localhost:4000`

#### Krok 3: Uruchom frontend w trybie dev

```bash
# Terminal 2 - uruchom frontend
pnpm dev
```

Aplikacja będzie dostępna pod `http://localhost:3000`

#### Krok 4: Wgraj plan i wybierz nauczyciela

1. Otwórz `http://localhost:3000` w przeglądarce
2. Kliknij "Wybierz plik Excel" i wgraj plik `test-dyzury.xlsx`
3. Wybierz nazwisko nauczyciela z listy
4. Kliknij "Zapisz i włącz powiadomienia"
5. Zaakceptuj prośbę o uprawnienia do powiadomień w przeglądarce

**UWAGA:** Dane zapisują się do lokalnego Firestore Emulator (nie produkcyjnej bazy).

#### Krok 5: Sprawdź czy dane zapisały się

Otwórz Emulator UI: `http://localhost:4000`

1. Kliknij "Firestore" w menu po lewej
2. Sprawdź kolekcję `users`
3. Powinieneś zobaczyć dokument z:
   - `teacherName`: wybrane nazwisko
   - `fcmToken`: token FCM
   - `schedule`: tablica dyżurów

**LUB** użyj funkcji pomocniczej:

```bash
curl http://localhost:5001/dzwonek-app/us-central1/listUsers
```

#### Krok 6: Wyślij testowe powiadomienie

Użyj funkcji HTTP `testNotification`:

```bash
curl -X POST http://localhost:5001/dzwonek-app/us-central1/testNotification \
  -H "Content-Type: application/json" \
  -d '{"teacherName": "Jan Kowalski", "minutesOffset": 10}'
```

Zamień "Jan Kowalski" na nazwisko które wybrałeś w aplikacji.

**Odpowiedź sukcesu:**
```json
{
  "success": true,
  "messageId": "projects/dzwonek-app/messages/...",
  "sentTo": "Jan Kowalski",
  "duty": {
    "day": "Poniedziałek",
    "time": "7:00",
    "location": "parter"
  },
  "message": "Powiadomienie testowe wysłane do Jan Kowalski"
}
```

**Powinieneś teraz otrzymać powiadomienie push w przeglądarce!**

#### Krok 7 (opcjonalny): Przetestuj prawdziwy scheduler

Jeśli chcesz przetestować automatyczne powiadomienia:

1. Wdróż funkcje do Firebase:
```bash
cd functions
npm run build
cd ..
firebase deploy --only functions
```

2. Poczekaj aż scheduler wykryje dyżur za 10 minut
3. Scheduler działa co 1 minutę i sprawdza czy są dyżury za 10 minut

**UWAGA:** Scheduler musi być wdrożony na prawdziwym Firebase - nie działa w emulatorach.

---

### Opcja 2: Testowanie z produkcyjnym Firestore

Jeśli chcesz testować z prawdziwą bazą danych (np. żeby scheduler działał):

#### Krok 1: Zmień .env

Ustaw środowisko na `production`:

```env
VITE_ENV=production
```

#### Krok 2: Uruchom frontend

```bash
pnpm dev
```

Teraz aplikacja łączy się z **prawdziwym** Firestore (nie emulatorem).

#### Krok 3: Wgraj plan i czekaj

1. Wgraj plan i wybierz nauczyciela
2. Dane zapiszą się do produkcyjnego Firestore
3. Wdrożony scheduler automatycznie wykryje dyżury i wyśle powiadomienia

---

## Debugowanie

### Problem: Nie przychodzą powiadomienia

1. **Sprawdź czy FCM token został zapisany:**
   ```bash
   curl http://localhost:5001/dzwonek-app/us-central1/listUsers
   ```

2. **Sprawdź logi funkcji:**
   - Dla emulatorów: sprawdź terminal gdzie uruchomiłeś `pnpm emulator`
   - Dla produkcji: `firebase functions:log`

3. **Sprawdź uprawnienia przeglądarki:**
   - Kliknij ikonę kłódki przy adresie URL
   - Sprawdź czy powiadomienia są dozwolone

4. **Sprawdź console w przeglądarce (F12):**
   - Powinno być: "🔧 Połączono z Firestore Emulator" (w dev mode)
   - Sprawdź czy są błędy związane z FCM

### Problem: "Nie znaleziono użytkownika"

To znaczy że dane nie zapisały się do bazy. Sprawdź:

1. Czy aplikacja działa na `localhost:3000`?
2. Czy emulator Firestore działa? (`http://localhost:4000`)
3. Czy w konsoli jest błąd zapisywania?

### Problem: Emulatory nie startują

```bash
# Sprawdź czy porty są wolne
netstat -ano | findstr "8080"  # Firestore
netstat -ano | findstr "5001"  # Functions
netstat -ano | findstr "4000"  # UI

# Jeśli porty zajęte, zabij proces lub zmień porty w firebase.json
```

---

## Kluczowe różnice: Emulator vs Produkcja

| Cecha | Emulator | Produkcja |
|-------|----------|-----------|
| Firestore | Lokalny, dane w pamięci | Prawdziwa chmura Google |
| Functions | Lokalne, wywoływane ręcznie | Automatyczny scheduler co 1 min |
| FCM | **Prawdziwy** (wymaga połączenia) | Prawdziwy |
| Dane | Znikają po restarcie | Trwałe |
| Koszty | Darmowe | Płatne (plan Blaze) |

---

## Najczęstsze pytania

**Q: Czy mogę testować powiadomienia całkowicie offline?**
A: NIE. FCM wymaga połączenia z internetem, nawet w emulatorze.

**Q: Czy scheduler działa w emulatorze?**
A: NIE. Cloud Scheduler (cron) działa tylko w produkcji. W emulatorze możesz tylko ręcznie wywołać funkcję HTTP.

**Q: Czy testowe powiadomienia wpływają na produkcyjnych użytkowników?**
A: NIE, jeśli używasz emulatora Firestore (VITE_ENV=development). Wtedy dane są tylko w lokalnej bazie.

**Q: Jak wyczyścić dane z emulatora?**
A: Wystarczy zrestartować emulator (`Ctrl+C` i ponownie `pnpm emulator`).

---

## Szybki test end-to-end

```bash
# Terminal 1
pnpm emulator

# Terminal 2
pnpm dev

# Przeglądarka
# 1. Otwórz http://localhost:3000
# 2. Wgraj test-dyzury.xlsx
# 3. Wybierz nauczyciela
# 4. Zaakceptuj powiadomienia

# Terminal 3 - wyślij test
curl -X POST http://localhost:5001/dzwonek-app/us-central1/testNotification \
  -H "Content-Type: application/json" \
  -d '{"teacherName": "WPISZ_NAZWISKO"}'

# Powinieneś otrzymać powiadomienie! ✅
```

---

## Problemy?

Sprawdź:
1. `firebase.json` - czy ma sekcję `emulators`? ✅
2. `public/firebase-messaging-sw.js` - czy ma prawdziwe wartości? ✅
3. `.env` - czy ma `VITE_ENV=development`? ✅
4. Czy porty 3000, 4000, 5001, 8080 są wolne?
5. Czy jesteś zalogowany do Firebase CLI? (`firebase login`)

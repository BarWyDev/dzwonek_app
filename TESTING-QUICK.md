# Szybkie testowanie BEZ emulatorów (bez Javy)

Jeśli nie chcesz instalować Javy, możesz testować bezpośrednio z prawdziwym Firebase.

## Krok 1: Upewnij się że .env jest poprawny

Sprawdź plik `.env` - powinien mieć prawdziwe wartości Firebase:

```env
VITE_FIREBASE_API_KEY=AIzaSyAWkv4e7wnAB3GZuUf11JiOr8Rpf8Szx-Q
VITE_FIREBASE_AUTH_DOMAIN=dzwonek-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=dzwonek-app
VITE_FIREBASE_STORAGE_BUCKET=dzwonek-app.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=135918257462
VITE_FIREBASE_APP_ID=1:135918257462:web:bc60ca0a1e92b453261f97
VITE_FIREBASE_VAPID_KEY=BNQcPDSIhgURi0-V1rbVC5C0MkK5YcljAWeJPNeOhZ6lvXraWfuvcE3ceUuvTlLegA9ubAGrWS8aKDDmPbiNgoc
VITE_ENV=production
```

**WAŻNE:** `VITE_ENV=production` żeby łączyło się z prawdziwym Firestore.

## Krok 2: Wdróż funkcje testowe do Firebase

```powershell
cd functions
npm install
npm run build
cd ..
firebase deploy --only functions
```

To wdroży funkcje (w tym `testNotification` i `listUsers`) do prawdziwego Firebase.

## Krok 3: Uruchom frontend lokalnie

```powershell
pnpm dev
```

Aplikacja będzie na `http://localhost:3000`

## Krok 4: Wgraj plan i wybierz nauczyciela

1. Otwórz `http://localhost:3000`
2. Kliknij "Wybierz plik Excel" i wgraj `test-dyzury.xlsx`
3. Wybierz nauczyciela z listy
4. Kliknij "Zapisz i włącz powiadomienia"
5. Zaakceptuj uprawnienia do powiadomień

**Dane zapisują się teraz do PRAWDZIWEGO Firestore!**

## Krok 5: Sprawdź czy dane zapisały się

### Opcja A: Przez Firebase Console

1. Wejdź na https://console.firebase.google.com
2. Wybierz projekt "dzwonek-app"
3. Kliknij "Firestore Database" w menu po lewej
4. Sprawdź kolekcję `users`
5. Powinieneś zobaczyć dokument z Twoim nauczycielem

### Opcja B: Przez API funkcji

```powershell
# Znajdź swoją region i project ID
# Format: https://REGION-PROJECT_ID.cloudfunctions.net/listUsers

# Przykład dla us-central1:
curl https://us-central1-dzwonek-app.cloudfunctions.net/listUsers
```

Powinieneś zobaczyć listę użytkowników z nauczycielem którego dodałeś.

## Krok 6: Wyślij testowe powiadomienie

```powershell
# Zamień NAZWISKO na nazwisko które wybrałeś w aplikacji
$body = @{
    teacherName = "Jan Kowalski"
    minutesOffset = 10
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "https://us-central1-dzwonek-app.cloudfunctions.net/testNotification" `
  -Method POST `
  -Body $body `
  -ContentType "application/json"
```

**LUB przez curl (jeśli masz zainstalowany):**

```bash
curl -X POST https://us-central1-dzwonek-app.cloudfunctions.net/testNotification \
  -H "Content-Type: application/json" \
  -d "{\"teacherName\": \"Jan Kowalski\"}"
```

## Krok 7: Sprawdź powiadomienie

Powinieneś otrzymać powiadomienie push w przeglądarce:

```
TEST: Przypomnienie o dyżurze
Za 10 min: dyżur parter (Poniedziałek 7:00)
```

---

## Debugowanie

### Problem: "Nie znaleziono użytkownika"

Sprawdź czy nauczyciel zapisał się w bazie:

1. Firebase Console → Firestore → kolekcja `users`
2. Lub wywołaj: `curl https://us-central1-dzwonek-app.cloudfunctions.net/listUsers`

### Problem: Nie przychodzi powiadomienie

1. Sprawdź czy uprawnienia do powiadomień są włączone (kłódka przy URL)
2. Sprawdź konsolę przeglądarki (F12) - czy są błędy?
3. Sprawdź logi funkcji: `firebase functions:log`

### Problem: 404 Not Found przy wywoływaniu funkcji

Funkcje mogły wdrożyć się w innym regionie. Sprawdź:

```powershell
firebase functions:list
```

I użyj poprawnego URL z listy.

---

## Czyszczenie danych testowych

Jeśli chcesz wyczyścić testowe dane:

1. Wejdź na Firebase Console
2. Firestore Database → kolekcja `users`
3. Usuń dokumenty testowe ręcznie

---

## Następny krok: Automatyczne powiadomienia

Jeśli testowe powiadomienie działa, możesz przetestować automatyczny scheduler:

1. Funkcja `checkUpcomingDuties` już jest wdrożona (działa co 1 minutę)
2. Wgraj plan z dyżurem za 10-15 minut
3. Poczekaj - powiadomienie przyjdzie automatycznie 10 minut przed dyżurem

**UWAGA:** Scheduler działa w strefie czasowej `Europe/Warsaw` (Polska).

---

## Porównanie: Emulatory vs Produkcja

| Co? | Z emulatorami (wymaga Java) | Bez emulatorów (produkcja) |
|-----|----------------------------|----------------------------|
| Instalacja | Wymaga Java 11+ | Tylko Node.js i Firebase CLI |
| Dane | Lokalne, znikają po restarcie | W prawdziwej bazie (trwałe) |
| Koszty | Darmowe | Minimalne (Firebase Spark plan) |
| Testowanie | Trzeba ręcznie wywoływać funkcje | Scheduler działa automatycznie |
| Setup | Bardziej skomplikowany | Prostszy |

Dla szybkiego testowania powiadomień **polecam opcję bez emulatorów** (ta instrukcja).

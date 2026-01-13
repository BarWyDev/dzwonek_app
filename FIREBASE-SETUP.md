# 🔥 Firebase Setup - Krok po kroku (5 minut)

## Krok 1: Utwórz projekt Firebase (2 min)

### 1.1 Otwórz Firebase Console
👉 https://console.firebase.google.com/

### 1.2 Kliknij "Add project" (lub "Utwórz projekt")

### 1.3 Wypełnij formularz:
```
Nazwa projektu: dzwonek-app
```
- Kliknij **Continue**

### 1.4 Google Analytics
```
❌ WYŁĄCZ Google Analytics (nie jest potrzebny dla MVP)
```
- Odznacz checkbox "Enable Google Analytics"
- Kliknij **Create project**

### 1.5 Poczekaj ~30 sekund
- Firebase tworzy projekt...
- Gdy gotowe: kliknij **Continue**

✅ **ZAPISZ:** Twój **Project ID** (np. `dzwonek-app-a1b2c3`)

---

## Krok 2: Dodaj Web App (1 min)

### 2.1 W Firebase Console kliknij ikonę Web
```
</> (ikona code w okręgu)
```

### 2.2 Zarejestruj aplikację
```
App nickname: dzwonek-app-web
```

```
☑️ ZAZNACZ: "Also set up Firebase Hosting"
```
- Kliknij **Register app**

### 2.3 Skopiuj Firebase Config
Zobaczysz kod JavaScript:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",           ← SKOPIUJ TO
  authDomain: "...",            ← I TO
  projectId: "...",             ← I TO
  storageBucket: "...",         ← I TO
  messagingSenderId: "...",     ← I TO
  appId: "...",                 ← I TO
  measurementId: "..."          ← I TO (jeśli jest)
};
```

📋 **SKOPIUJ wszystkie wartości** - zaraz będą potrzebne!

- Kliknij **Continue to console**

---

## Krok 3: Włącz Firestore Database (1 min)

### 3.1 W lewym menu:
```
Build → Firestore Database
```

### 3.2 Kliknij "Create database"

### 3.3 Wybierz tryb:
```
✅ Start in production mode
```
- Kliknij **Next**

### 3.4 Wybierz region:
```
europe-west3 (Frankfurt)  ← NAJLEPSZY dla Polski
```
- Kliknij **Enable**

⏳ Poczekaj ~30 sekund (Firestore się tworzy)

✅ Gotowe! Zobaczysz pustą bazę danych

---

## Krok 4: Wygeneruj VAPID Key (1 min)

### 4.1 Otwórz Settings
```
⚙️ (ikona zębatki u góry) → Project settings
```

### 4.2 Przejdź do Cloud Messaging
```
Cloud Messaging (zakładka u góry)
```

### 4.3 Web Push certificates
```
Scroll w dół → Web Push certificates
```

### 4.4 Wygeneruj klucz
```
Kliknij: Generate key pair
```

📋 **SKOPIUJ** długi string (zaczyna się od `B...`)
```
Przykład: BNdX1234567890abcdefghijklmnopqrstuvwxyz...
```

---

## Krok 5: Zaktualizuj pliki lokalne (2 min)

### 5.1 Otwórz plik `.env`

Zamień placeholdery na wartości z Firebase:

```env
# Z Step 2.3 (firebaseConfig)
VITE_FIREBASE_API_KEY=AIza...........................
VITE_FIREBASE_AUTH_DOMAIN=dzwonek-app-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=dzwonek-app-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=dzwonek-app-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123def456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Z Step 4.4 (VAPID Key)
VITE_FIREBASE_VAPID_KEY=BNdX1234567890abcdefgh.................

# Zostaw bez zmian
VITE_ENV=development
```

### 5.2 Otwórz plik `.firebaserc`

Zamień Project ID:

```json
{
  "projects": {
    "default": "dzwonek-app-xxxxx"  ← Twój Project ID z Step 1.5
  }
}
```

---

## Krok 6: Zainstaluj Firebase CLI (1 min)

Otwórz terminal:

```bash
npm install -g firebase-tools
```

⏳ Poczekaj ~30 sekund

### Zaloguj się:
```bash
firebase login
```

- Otworzy się przeglądarka
- Zaloguj się kontem Google
- Zezwól na dostęp

✅ Zobaczysz: "Success! Logged in as ..."

---

## Krok 7: Deploy Firestore Rules (1 min)

```bash
firebase deploy --only firestore
```

✅ Zobaczysz:
```
✔  Deploy complete!
```

---

## ✅ GOTOWE! Sprawdź czy działa

### Test 1: Uruchom dev server
```bash
pnpm dev
```

Otwórz: http://localhost:3000

### Test 2: Wgraj Excel
1. Kliknij "Wybierz plik"
2. Wybierz `Dyżury 2025-2026 (2).xlsx`
3. Wybierz nauczyciela z listy
4. Kliknij "Zezwól" na powiadomienia (popup przeglądarki)

### Test 3: Sprawdź Firestore
Wróć do Firebase Console:
```
Firestore Database → Data
```

✅ Powinna być kolekcja `users` z dokumentem (Twój FCM token)

---

## 🎉 SUKCES!

Jeśli widzisz dane w Firestore - **wszystko działa!**

### Co teraz?
1. ✅ Firebase skonfigurowany
2. ✅ Firestore działa
3. ⏳ **Następny krok:** Deploy Functions (powiadomienia)

---

## 🆘 Problemy?

### "Permission denied" przy deploy
```bash
firebase logout
firebase login
firebase use dzwonek-app-xxxxx
```

### "Invalid API key"
- Sprawdź `.env` - brak spacji przed/po wartościach
- Restart dev server: `Ctrl+C` → `pnpm dev`

### "Project not found"
```bash
firebase projects:list
```
Sprawdź czy Twój projekt jest na liście

### Firestore pusty mimo wyboru nauczyciela
- Otwórz Console przeglądarki (F12)
- Sprawdź zakładkę Console - szukaj błędów
- Upewnij się że zezwoliłeś na powiadomienia

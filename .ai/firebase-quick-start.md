# Firebase Quick Start - Szybki start (10 minut)

## ⚡ Najszybsza ścieżka do działających powiadomień

### Wymagania
- [ ] Konto Google
- [ ] 10 minut czasu
- [ ] Projekt dzwonek_app już pobrany

---

## 🚀 5 kroków do sukcesu

### 1️⃣ Utwórz projekt Firebase (2 min)

```
1. Otwórz: https://console.firebase.google.com/
2. Kliknij: "Add project"
3. Nazwa: dzwonek-app
4. Google Analytics: WYŁĄCZ (nie potrzebny)
5. Create project → Continue
```

📝 Zapisz **Project ID** (np. `dzwonek-app-a1b2c3`)

---

### 2️⃣ Dodaj Web App (1 min)

```
1. Kliknij ikonę Web (</>) u góry
2. Nazwa: dzwonek-app-web
3. Firebase Hosting: NIE zaznaczaj ❌
4. Register app
5. SKOPIUJ firebaseConfig (wszystkie wartości)
6. Continue to console
```

---

### 3️⃣ Włącz Firestore i Cloud Messaging (2 min)

**Firestore:**
```
1. Build → Firestore Database
2. Create database
3. Production mode
4. Region: europe-west3 (Frankfurt)
5. Enable
```

**VAPID Key:**
```
1. ⚙️ Settings → Project settings
2. Cloud Messaging tab
3. Web Push certificates
4. Generate key pair
5. SKOPIUJ Key pair (długi string)
```

---

### 4️⃣ Zaktualizuj pliki lokalne (2 min)

**Plik `.firebaserc`:**
```json
{
  "projects": {
    "default": "dzwonek-app-a1b2c3"  ← TWÓJ Project ID
  }
}
```

**Plik `.env`:**
```env
VITE_FIREBASE_API_KEY=AIza...          ← z firebaseConfig
VITE_FIREBASE_AUTH_DOMAIN=...          ← z firebaseConfig
VITE_FIREBASE_PROJECT_ID=dzwonek...    ← z firebaseConfig
VITE_FIREBASE_STORAGE_BUCKET=...       ← z firebaseConfig
VITE_FIREBASE_MESSAGING_SENDER_ID=...  ← z firebaseConfig
VITE_FIREBASE_APP_ID=1:...             ← z firebaseConfig
VITE_FIREBASE_MEASUREMENT_ID=G-...     ← z firebaseConfig
VITE_FIREBASE_VAPID_KEY=BNdX...        ← VAPID Key
VITE_ENV=development
```

---

### 5️⃣ Deploy i test (3 min)

**Terminal:**
```bash
# 1. Login do Firebase
firebase login

# 2. Deploy Firestore rules
firebase deploy --only firestore

# 3. Uruchom dev server
pnpm dev
```

**Przeglądarka (http://localhost:3000):**
```
1. Otwórz aplikację
2. Wgraj plik Excel (Dyżury 2025-2026 (2).xlsx)
3. Wybierz nauczyciela
4. Zezwól na powiadomienia (popup przeglądarki)
```

**Sprawdź w Firebase Console:**
```
Firestore Database → Data
Powinna być kolekcja "users" z Twoim tokenem FCM ✅
```

---

## ✅ Checklist - czy wszystko działa?

- [ ] Projekt Firebase utworzony
- [ ] Web App dodana
- [ ] Firestore włączony (region: europe-west3)
- [ ] VAPID key wygenerowany
- [ ] `.firebaserc` zaktualizowany
- [ ] `.env` wypełniony
- [ ] `firebase deploy --only firestore` wykonany bez błędów
- [ ] Dev server działa (http://localhost:3000)
- [ ] Plik Excel parsuje się poprawnie
- [ ] Po wyborze nauczyciela token pojawia się w Firestore
- [ ] Console przeglądarki nie pokazuje błędów Firebase

---

## 🎯 Następne kroki

Po wykonaniu powyższego masz:
- ✅ Firebase w pełni skonfigurowany
- ✅ Aplikacja łączy się z Firebase
- ✅ Firestore zapisuje dane użytkowników
- ⏳ **Powiadomienia jeszcze nie działają** (trzeba zdeployować Functions)

### Aby uruchomić powiadomienia:

```bash
# 1. Build Functions
cd functions
npm run build
cd ..

# 2. Deploy Functions
firebase deploy --only functions

# 3. Sprawdź w Firebase Console
Functions → checkUpcomingDuties → powinien być aktywny
```

**Powiadomienia będą wysyłane co 1 minutę** sprawdzając nadchodzące dyżury (10 minut przed).

---

## 🆘 Najczęstsze problemy

### Błąd: "Permission denied" przy deploy
```bash
firebase logout
firebase login
firebase use dzwonek-app-xxxxx
```

### Błąd: "Invalid API key"
- Sprawdź `.env` - klucze muszą być dokładnie takie jak w Firebase Console
- Nie może być spacji na początku/końcu
- Restart dev server: Ctrl+C → `pnpm dev`

### Błąd: "Project not found"
- Sprawdź `.firebaserc` - Project ID musi się zgadzać z Firebase Console
- `firebase projects:list` - czy projekt jest na liście?

### Firestore pusty mimo wyboru nauczyciela
- Otwórz Console przeglądarki (F12) → sprawdź błędy
- Czy zezwoliłeś na powiadomienia? (popup przeglądarki)
- Sprawdź czy `.env` jest poprawnie wypełniony

---

## 📖 Pełna dokumentacja

Jeśli coś nie działa lub chcesz szczegóły:
- Pełny guide: `.ai/firebase-setup-guide.md`
- Komendy CLI: `.ai/firebase-commands-cheatsheet.md`
- Szablon credentials: `.ai/firebase-credentials-template.md`

---

**Powodzenia!** 🚀

Jeśli wszystko działa, następny krok to implementacja powiadomień w tle (Service Worker) i deploy Functions.

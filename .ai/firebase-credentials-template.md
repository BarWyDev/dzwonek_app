# Firebase Credentials - Szablon do wypełnienia

## 📝 Wypełnij podczas konfiguracji Firebase

### KROK 1: Dane projektu Firebase
```
Data utworzenia: _______________
Project name: dzwonek-app
Project ID: _________________________  (np. dzwonek-app-a1b2c3)
Project number: _____________________  (liczba, np. 123456789)
Region: europe-west3 (Frankfurt)
```

---

### KROK 2: Firebase SDK Configuration
Skopiuj z Firebase Console → Project Settings → General → Your apps → Web app

```javascript
// firebaseConfig object
{
  apiKey: "_______________________________________",
  authDomain: "________________________________.firebaseapp.com",
  projectId: "_______________________________________",
  storageBucket: "________________________________.appspot.com",
  messagingSenderId: "_______________________________________",
  appId: "_______________________________________",
  measurementId: "_______________________________________"
}
```

---

### KROK 3: VAPID Key (Web Push)
Skopiuj z Firebase Console → Project Settings → Cloud Messaging → Web Push certificates

```
VAPID Key pair:
_______________________________________________________________________________
_______________________________________________________________________________
(bardzo długi string zaczynający się od "B", około 88 znaków)
```

---

### KROK 4: Gotowy plik .env

Po wypełnieniu powyższych danych, skopiuj je tutaj:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=

# FCM VAPID Key (Web Push)
VITE_FIREBASE_VAPID_KEY=

# Environment
VITE_ENV=development
```

---

### KROK 5: Gotowy plik .firebaserc

```json
{
  "projects": {
    "default": "___________________________"  ← Project ID tutaj
  }
}
```

---

## ✅ Checklist po konfiguracji

Zaznacz po wykonaniu każdego kroku:

- [ ] Projekt Firebase utworzony
- [ ] Web App dodana do projektu
- [ ] Cloud Firestore włączony (europe-west3)
- [ ] VAPID key wygenerowany
- [ ] Firebase CLI zainstalowany (`npm install -g firebase-tools`)
- [ ] Zalogowano do Firebase CLI (`firebase login`)
- [ ] Plik `.firebaserc` zaktualizowany
- [ ] Plik `.env` wypełniony
- [ ] Firestore rules wdrożone (`firebase deploy --only firestore`)
- [ ] Dev server uruchomiony bez błędów (`pnpm dev`)
- [ ] Firebase inicjalizuje się poprawnie (sprawdzone w Console przeglądarki)

---

## 🔒 BEZPIECZEŃSTWO

**UWAGA**: Ten plik może zawierać poufne dane!

- ❌ **NIE COMMITUJ** tego pliku do Git
- ❌ **NIE UDOSTĘPNIAJ** nikomu tych kluczy
- ✅ Przechowuj lokalnie w bezpiecznym miejscu
- ✅ W razie wyceku kluczy - regeneruj je w Firebase Console

Plik `.env` jest już dodany do `.gitignore` i nie zostanie wysłany do repozytorium.

---

**Ostatnia aktualizacja**: 2025-12-22

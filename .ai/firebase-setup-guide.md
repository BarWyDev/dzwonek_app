# Przewodnik konfiguracji Firebase dla dzwonek_app

## 🎯 Cel
Skonfigurować projekt Firebase z wszystkimi wymaganymi usługami:
- Firebase Web App
- Cloud Firestore (baza danych)
- Cloud Messaging (powiadomienia push)
- Cloud Functions (backend serverless)
- VAPID keys (Web Push)

---

## KROK 1: Utworzenie projektu Firebase

### 1.1 Przejdź do Firebase Console
```
URL: https://console.firebase.google.com/
```

### 1.2 Zaloguj się kontem Google
- Użyj konta Gmail
- Jeśli to pierwsze użycie Firebase, zaakceptuj warunki

### 1.3 Utwórz nowy projekt
1. Kliknij przycisk **"Add project"** / **"Dodaj projekt"**
2. Podaj nazwę projektu:
   ```
   Nazwa: dzwonek-app
   ```
   (lub `dzwonek-app-[twoje-inicjaly]` jeśli nazwa jest zajęta)

3. **Project ID** zostanie wygenerowany automatycznie, np:
   ```
   dzwonek-app-a1b2c3
   ```
   📝 **ZAPISZ TO!** Będzie potrzebne później

4. **Google Analytics**:
   - Możesz **wyłączyć** (nie jest potrzebny dla tego projektu)
   - Lub zostaw włączony (default account)

5. Kliknij **"Create project"** / **"Utwórz projekt"**

6. Poczekaj ~30 sekund aż projekt się utworzy

7. Kliknij **"Continue"**

### 1.4 Zapisz dane projektu
Zapisz następujące informacje (znajdziesz je w "Project settings"):

```
Project name: dzwonek-app
Project ID: ________________  ← Uzupełnij
Project number: ____________  ← Uzupełnij (liczba, np. 123456789)
```

---

## KROK 2: Dodanie Web App do projektu

### 2.1 W Firebase Console
1. Jesteś na stronie projektu
2. U góry zobaczysz 4 ikony: iOS, Android, **Web** (`</>`), Unity
3. Kliknij ikonę **Web** (`</>`)

### 2.2 Zarejestruj aplikację
1. **App nickname** (nazwa wyświetlana):
   ```
   dzwonek-app-web
   ```

2. **Firebase Hosting**:
   - ❌ **NIE ZAZNACZAJ** "Also set up Firebase Hosting"
   - (Będziemy hostować na mikr.us, nie na Firebase)

3. Kliknij **"Register app"** / **"Zarejestruj aplikację"**

### 2.3 Skopiuj konfigurację Firebase SDK
Po rejestracji zobaczysz kod podobny do:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "dzwonek-app-xxxxx.firebaseapp.com",
  projectId: "dzwonek-app-xxxxx",
  storageBucket: "dzwonek-app-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

📝 **SKOPIUJ WSZYSTKIE WARTOŚCI** i zapisz je tutaj:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

### 2.4 Zakończ setup
- Kliknij **"Continue to console"**

---

## KROK 3: Włączenie Cloud Firestore (Baza danych)

### 3.1 Przejdź do Firestore
1. W lewym menu Firebase Console
2. Kliknij **"Build"** (Twórz)
3. Kliknij **"Firestore Database"**

### 3.2 Create Database
1. Kliknij przycisk **"Create database"** / **"Utwórz bazę danych"**

2. **Secure rules for Cloud Firestore**:
   - Wybierz: ✅ **"Start in production mode"**
   - (Mamy własne security rules w pliku `firebase/firestore.rules`)
   - Kliknij **"Next"**

3. **Cloud Firestore location**:
   - Wybierz: **`europe-west3 (Frankfurt)`**
   - (Najbliżej Polski, najmniejsze opóźnienia)
   - **UWAGA**: Lokalizacji **NIE MOŻNA ZMIENIĆ** później!
   - Kliknij **"Enable"**

4. Poczekaj ~30-60 sekund aż Firestore się utworzy

### 3.3 Sprawdź status
- Po utworzeniu zobaczysz pustą bazę danych
- Kolekcje pojawią się automatycznie gdy aplikacja zacznie zapisywać dane

✅ Firestore Database jest gotowy!

---

## KROK 4: Konfiguracja Cloud Messaging (Powiadomienia Push)

### 4.1 Przejdź do Cloud Messaging
1. W lewym menu Firebase Console
2. Kliknij **"Build"** → **"Cloud Messaging"**

### 4.2 Cloud Messaging jest automatycznie włączony
- Nie musisz nic konfigurować na tym etapie
- Przejdź do następnego kroku (VAPID keys)

---

## KROK 5: Wygenerowanie VAPID Keys (Web Push)

### 5.1 Przejdź do Project Settings
1. Kliknij ikonę **⚙️ (Settings)** obok "Project Overview" u góry
2. Wybierz **"Project settings"** / **"Ustawienia projektu"**

### 5.2 Zakładka Cloud Messaging
1. W górnym menu kliknij zakładkę **"Cloud Messaging"**
2. Przewiń w dół do sekcji **"Web configuration"**

### 5.3 Wygeneruj Web Push certificates (VAPID)
1. W sekcji "Web Push certificates" zobaczysz:
   - "Web Push certificates" (może być puste)
   - Przycisk **"Generate key pair"**

2. Kliknij **"Generate key pair"**

3. Po wygenerowaniu zobaczysz **Key pair** (długi string):
   ```
   Example: BNdX7Z8Y9A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D...
   ```

4. 📝 **SKOPIUJ TEN KLUCZ** - będzie potrzebny do pliku `.env`:
   ```
   VITE_FIREBASE_VAPID_KEY=
   ```

✅ VAPID key wygenerowany!

---

## KROK 6: Instalacja Firebase CLI (na swoim komputerze)

### 6.1 Zainstaluj Firebase Tools globalnie
Otwórz terminal i wykonaj:

```bash
npm install -g firebase-tools
```

### 6.2 Zaloguj się do Firebase
```bash
firebase login
```

- Otworzy się przeglądarka
- Zaloguj się kontem Google (tym samym co w Firebase Console)
- Zezwól na dostęp

### 6.3 Sprawdź czy działa
```bash
firebase projects:list
```

Powinieneś zobaczyć listę swoich projektów Firebase, w tym `dzwonek-app`.

✅ Firebase CLI skonfigurowany!

---

## KROK 7: Aktualizacja pliku .firebaserc

### 7.1 Otwórz plik .firebaserc
```bash
# W projekcie dzwonek_app
code .firebaserc
```

### 7.2 Zamień Project ID
Zmień `dzwonek-app-xxxxx` na swój **rzeczywisty Project ID**:

```json
{
  "projects": {
    "default": "dzwonek-app-a1b2c3"  ← TUTAJ wpisz swój Project ID
  }
}
```

### 7.3 Zapisz plik
Ctrl+S (Windows) lub Cmd+S (Mac)

---

## KROK 8: Aktualizacja pliku .env

### 8.1 Otwórz plik .env
```bash
code .env
```

### 8.2 Wypełnij WSZYSTKIE wartości
Użyj danych zapisanych w KROK 2.3 i KROK 5.3:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=dzwonek-app-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=dzwonek-app-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=dzwonek-app-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# FCM VAPID Key (Web Push)
VITE_FIREBASE_VAPID_KEY=BNdX7Z8Y9A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T...

# Environment
VITE_ENV=development
```

### 8.3 Zapisz plik
**BARDZO WAŻNE**: Plik `.env` zawiera poufne klucze!
- Jest już w `.gitignore` (nie zostanie wysłany do Git)
- Nie udostępniaj nikomu tych kluczy

---

## KROK 9: Deploy Firestore Security Rules

### 9.1 Wykonaj deploy rules
W terminalu (w folderze projektu):

```bash
firebase deploy --only firestore
```

### 9.2 Sprawdź wynik
Powinieneś zobaczyć:

```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/dzwonek-app-xxxxx/overview
```

### 9.3 Sprawdź w Firebase Console
1. Firestore Database → Rules (zakładka)
2. Powinieneś zobaczyć reguły z pliku `firebase/firestore.rules`

✅ Security rules wdrożone!

---

## KROK 10: Weryfikacja konfiguracji

### 10.1 Checklist ✅

Upewnij się, że masz wszystko:

- ✅ Projekt Firebase utworzony
- ✅ Web App dodana do projektu
- ✅ Cloud Firestore włączony (region: europe-west3)
- ✅ VAPID key wygenerowany
- ✅ Firebase CLI zainstalowany i zalogowany
- ✅ Plik `.firebaserc` zaktualizowany (Project ID)
- ✅ Plik `.env` wypełniony wszystkimi kluczami
- ✅ Firestore Rules wdrożone (`firebase deploy --only firestore`)

### 10.2 Test połączenia
Uruchom dev server:

```bash
pnpm dev
```

Otwórz http://localhost:3000

**Otwórz DevTools (F12) → Console**

Powinieneś zobaczyć logi Firebase (brak błędów inicjalizacji):
```
Firebase initialized successfully
```

Jeśli zobaczysz błąd typu:
```
Firebase: Error (auth/invalid-api-key)
```

To znaczy że klucze w `.env` są niepoprawne - sprawdź ponownie.

---

## 🎉 GRATULACJE!

Firebase jest w pełni skonfigurowany!

## 📋 Podsumowanie co masz teraz:

| Usługa | Status | Region/Lokalizacja |
|--------|--------|-------------------|
| Firebase Project | ✅ Utworzony | - |
| Web App | ✅ Zarejestrowana | - |
| Cloud Firestore | ✅ Włączony | europe-west3 (Frankfurt) |
| Cloud Messaging | ✅ Włączony | - |
| VAPID Keys | ✅ Wygenerowane | - |
| Firebase CLI | ✅ Zainstalowany | Lokalne |
| Security Rules | ✅ Wdrożone | Firestore |

---

## 🔜 Następne kroki:

1. **Implementacja rejestracji FCM** w aplikacji
   - Dodanie Service Worker dla powiadomień w tle
   - Wywołanie `registerFCMToken()` po wyborze nauczyciela

2. **Deploy Firebase Functions**
   - Build backendu TypeScript
   - Wdrożenie funkcji `checkUpcomingDuties` i `sendNotification`

3. **Testowanie powiadomień**
   - Wgranie pliku Excel
   - Wybór nauczyciela
   - Sprawdzenie czy token zapisał się w Firestore
   - Test powiadomienia

4. **Generowanie ikon PWA**
   - Utworzenie ikon 192x192, 512x512
   - Dodanie do `public/icons/`

5. **Deploy na produkcję (mikr.us)**
   - Build produkcyjny
   - Konfiguracja nginx
   - Certyfikat SSL

---

## 🆘 Troubleshooting

### Problem: "Permission denied" przy deploy
**Rozwiązanie:**
```bash
firebase logout
firebase login
firebase use --add  # wybierz swój projekt
```

### Problem: Firestore rules nie działają
**Rozwiązanie:**
- Sprawdź czy plik `firebase/firestore.rules` istnieje
- Deploy ponownie: `firebase deploy --only firestore`

### Problem: VAPID key nie działa
**Rozwiązanie:**
- Upewnij się że skopiowałeś CAŁY klucz (bardzo długi string)
- Nie dodawaj spacji ani nowych linii
- Klucz powinien zaczynać się od "B" i mieć ~88 znaków

### Problem: "Project not found"
**Rozwiązanie:**
- Sprawdź `.firebaserc` - Project ID musi być **dokładnie** taki jak w Firebase Console
- Sprawdź `firebase projects:list` - czy projekt jest na liście

---

## 📚 Przydatne linki:

- Firebase Console: https://console.firebase.google.com/
- Firestore Documentation: https://firebase.google.com/docs/firestore
- Cloud Messaging Docs: https://firebase.google.com/docs/cloud-messaging
- Firebase CLI Reference: https://firebase.google.com/docs/cli

---

**Data utworzenia**: 2025-12-22
**Wersja**: 1.0
**Projekt**: dzwonek_app

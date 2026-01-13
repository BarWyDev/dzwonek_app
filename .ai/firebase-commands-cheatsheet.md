# Firebase CLI - Ściągawka komend

## 🚀 Podstawowe komendy Firebase

### Instalacja i logowanie

```bash
# Instalacja Firebase CLI (globalnie)
npm install -g firebase-tools

# Logowanie do Firebase
firebase login

# Wylogowanie
firebase logout

# Sprawdzenie wersji
firebase --version
```

---

## 📋 Zarządzanie projektami

```bash
# Lista projektów Firebase
firebase projects:list

# Dodanie/wybór projektu do aktualnego katalogu
firebase use --add

# Sprawdzenie aktualnego projektu
firebase use

# Zmiana projektu
firebase use <project-id>
```

---

## 🔥 Firestore (Baza danych)

```bash
# Deploy Firestore rules i indexes
firebase deploy --only firestore

# Tylko rules
firebase deploy --only firestore:rules

# Tylko indexes
firebase deploy --only firestore:indexes

# Backup danych Firestore (export)
gcloud firestore export gs://[BUCKET_NAME]
```

---

## ⚡ Cloud Functions (Backend)

```bash
# Deploy wszystkich functions
firebase deploy --only functions

# Deploy konkretnej funkcji
firebase deploy --only functions:checkUpcomingDuties

# Deploy wielu funkcji
firebase deploy --only functions:checkUpcomingDuties,functions:sendNotification

# Build functions (TypeScript → JavaScript)
cd functions
npm run build

# Uruchomienie emulatorów lokalnie
firebase emulators:start

# Tylko Functions emulator
firebase emulators:start --only functions

# Logi z Cloud Functions (produkcja)
firebase functions:log

# Logi konkretnej funkcji
firebase functions:log --only checkUpcomingDuties

# Logi z ostatniej godziny
firebase functions:log --since 1h
```

---

## 🌐 Hosting (jeśli używasz Firebase Hosting)

```bash
# Deploy frontendu
firebase deploy --only hosting

# Preview przed deploy
firebase hosting:channel:deploy preview

# Lista kanałów preview
firebase hosting:channel:list
```

---

## 🎮 Firebase Emulators (lokalne testowanie)

```bash
# Uruchomienie wszystkich emulatorów
firebase emulators:start

# Konkretne emulatory
firebase emulators:start --only firestore,functions

# Export danych z emulatora
firebase emulators:export ./emulator-data

# Import danych do emulatora
firebase emulators:start --import=./emulator-data
```

**Emulatory URLs (default)**:
- Firestore: http://localhost:8080
- Functions: http://localhost:5001
- Auth: http://localhost:9099
- Emulator UI: http://localhost:4000

---

## 🔄 Deploy wszystkiego naraz

```bash
# Deploy Firestore + Functions
firebase deploy --only firestore,functions

# Deploy wszystkiego (Firestore, Functions, Hosting)
firebase deploy

# Deploy z konkretnym message
firebase deploy -m "Updated notification logic"
```

---

## 📊 Monitorowanie i diagnostyka

```bash
# Status projektu
firebase projects:list

# Informacje o projekcie
firebase apps:list

# Lista funkcji
firebase functions:list

# Config projektu
firebase functions:config:get
```

---

## 🛠️ Narzędzia developerskie

```bash
# Inicjalizacja nowego projektu Firebase
firebase init

# Co można zainicjalizować:
# - Firestore
# - Functions
# - Hosting
# - Storage
# - Emulators

# Sprawdzenie health projektu
firebase projects:get <project-id>

# Otwarcie Firebase Console w przeglądarce
firebase open
```

---

## 🧪 Testowanie Functions lokalnie

### Metoda 1: Emulatory
```bash
# 1. Start emulatorów
firebase emulators:start

# 2. Wywołaj funkcję HTTP przez curl
curl http://localhost:5001/<project-id>/us-central1/sendNotification \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "fcmToken": "test-token",
      "title": "Test",
      "body": "Test notification"
    }
  }'
```

### Metoda 2: Functions shell
```bash
cd functions
npm run shell

# W shellu:
> checkUpcomingDuties()
> sendNotification({fcmToken: "test", title: "Test", body: "Body"})
```

---

## 🚨 Najczęstsze komendy dla dzwonek_app

### Setup początkowy
```bash
# 1. Login
firebase login

# 2. Wybór projektu
firebase use --add
# Wybierz dzwonek-app z listy

# 3. Deploy rules
firebase deploy --only firestore
```

### Development workflow
```bash
# Terminal 1: Frontend dev server
pnpm dev

# Terminal 2: Functions emulator
firebase emulators:start --only functions,firestore

# Terminal 3: Functions build watch mode
cd functions
npm run build:watch
```

### Deploy do produkcji
```bash
# 1. Build functions
cd functions
npm run build
cd ..

# 2. Deploy functions + firestore
firebase deploy --only functions,firestore

# 3. Sprawdź logi
firebase functions:log --since 5m
```

---

## ⚠️ Troubleshooting

### Problem: "Error: HTTP Error: 403, Permission denied"
```bash
firebase logout
firebase login
firebase use --add
```

### Problem: Functions nie deployują się
```bash
# Sprawdź czy build działa
cd functions
npm run build

# Sprawdź czy zalogowany
firebase login --reauth

# Spróbuj konkretnej funkcji
firebase deploy --only functions:checkUpcomingDuties
```

### Problem: Emulatory nie startują
```bash
# Sprawdź porty (może coś już działa)
# Windows:
netstat -ano | findstr :5001

# Zabij proces jeśli trzeba
taskkill /PID <pid> /F

# Zmień port emulatora
firebase emulators:start --only functions --port 5002
```

### Problem: "Cannot find module"
```bash
# Zainstaluj zależności
cd functions
npm install
cd ..
```

---

## 📚 Przydatne aliasy (opcjonalnie)

Dodaj do `.bashrc` lub `.zshrc`:

```bash
alias fb="firebase"
alias fbl="firebase login"
alias fbd="firebase deploy"
alias fbf="firebase deploy --only functions"
alias fbe="firebase emulators:start"
alias fblog="firebase functions:log"
```

Po dodaniu:
```bash
source ~/.bashrc  # lub ~/.zshrc

# Teraz możesz używać:
fbf  # zamiast firebase deploy --only functions
```

---

## 🎯 Najważniejsze dla dzwonek_app

```bash
# Development
pnpm dev                              # Frontend
firebase emulators:start              # Backend (lokalne)

# Deploy
firebase deploy --only firestore      # Security rules
firebase deploy --only functions      # Backend (produkcja)

# Monitoring
firebase functions:log                # Logi z produkcji
```

---

**Ostatnia aktualizacja**: 2025-12-22
**Projekt**: dzwonek_app

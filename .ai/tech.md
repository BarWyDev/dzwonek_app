# Dokument techniczny – dzwonek_app

## 1. Rekomendowany stos technologiczny

### 1.1 Frontend (hostowany na mikr.us)

#### Framework i narzędzia deweloperskie
- **React 18+** z **TypeScript**
- **Vite** - build tool i dev server
- **pnpm** lub **npm** - package manager

#### Styling i UI
- **Tailwind CSS** - utility-first CSS framework
- **React Hot Toast** - biblioteka do toastów/notyfikacji w UI
- **Lucide React** - zestaw ikon (opcjonalnie)

#### PWA i offline
- **Vite Plugin PWA** (`vite-plugin-pwa`) - automatyczna konfiguracja PWA
- **Workbox** - Service Worker, precaching, offline strategies
- **Web Manifest** - generowany automatycznie przez plugin

#### Zarządzanie stanem
- **Zustand** - lekka biblioteka do state management (prostsza niż Redux)
- Alternatywnie: **React Context API** dla prostych przypadków

#### Parsing Excel
- **SheetJS (xlsx)** - Community Edition (Apache 2.0 license)
  - Wersja: `^0.18.5` lub nowsza
  - Client-side parsing plików .xlsx

#### Web APIs
- **Web Notifications API** - natywne powiadomienia przeglądarki
- **Service Worker API** - offline functionality
- **LocalStorage API** - przechowywanie harmonogramu i ustawień
- **Firebase SDK** - integracja z FCM i Firestore

### 1.2 Backend (Firebase - Google Cloud)

#### Serverless Functions
- **Firebase Cloud Functions** (Node.js 18+ / TypeScript)
- **Firebase Admin SDK** - zarządzanie FCM i Firestore po stronie serwera

#### Baza danych
- **Firebase Firestore** - NoSQL database
  - Kolekcje:
    - `users` - tokeny FCM, wybrane nazwisko nauczyciela
    - `schedules` - harmonogramy dyżurów
    - `notifications` - historia wysłanych powiadomień (opcjonalnie)

#### Powiadomienia push
- **Firebase Cloud Messaging (FCM)** - Web Push Notifications
  - VAPID keys dla Web Push
  - Automatyczne wysyłanie powiadomień

#### Scheduler
- **Cloud Scheduler** - cron jobs w Google Cloud
  - Alternatywnie: Cloud Functions triggered by PubSub

### 1.3 Hosting i deployment

#### Frontend hosting (mikr.us)
- **nginx** - serwer HTTP
- **Let's Encrypt** (via Certbot) - darmowy certyfikat SSL/TLS
- **VPS Linux** (Ubuntu/Debian preferowane)

#### Backend hosting (Firebase)
- **Google Cloud Platform** - Firebase hosting
- Automatyczne HTTPS i CDN
- Zarządzane przez Google (zero maintenance)

### 1.4 Narzędzia deweloperskie

#### Development
- **VS Code** - IDE
- **Firebase Emulator Suite** - lokalne testowanie Functions i Firestore
- **Firebase CLI** - deployment backendu
- **Git** - kontrola wersji

#### Testing (opcjonalnie dla MVP)
- **Vitest** - test runner (kompatybilny z Vite)
- **React Testing Library** - testy komponentów
- **Playwright** - testy E2E (dla przyszłości)

#### Monitoring
- **Firebase Console** - monitoring Functions, Firestore, FCM
- **Lighthouse** - audyt PWA i performance

---

## 2. Uzasadnienie wyborów technologicznych

### 2.1 Dlaczego React + TypeScript?

**Zalety:**
- ✅ Najpopularniejszy framework frontendowy - ogromna społeczność i zasoby
- ✅ TypeScript dodaje bezpieczeństwo typów i lepsze DX (autocomplete, refactoring)
- ✅ Doskonała obsługa PWA i Service Workers
- ✅ Kompatybilność z Firebase SDK
- ✅ Znajomy ekosystem dla frontend developera

**Alternatywy:**
- **Vue.js** - prostszy w nauce, ale mniejsza społeczność
- **Svelte** - mniejszy bundle size, ale mniej zasobów do nauki
- **Vanilla JS** - najtrudniejsze w utrzymaniu dla rozbudowanych aplikacji

**Rekomendacja:** React + TypeScript to złoty standard dla tego typu projektów.

### 2.2 Dlaczego Vite zamiast Create React App?

**Zalety:**
- ✅ Błyskawiczny dev server (HMR w <100ms)
- ✅ Nowoczesny bundler (esbuild + Rollup)
- ✅ Świetna obsługa TypeScript out-of-the-box
- ✅ Plugin ecosystem (vite-plugin-pwa)
- ✅ Mniejszy bundle size w production

**Create React App** jest przestarzały i wolniejszy - React team już go nie poleca.

### 2.3 Dlaczego Firebase zamiast własnego backendu?

**KLUCZOWY WYBÓR dla osoby bez backend experience:**

**Firebase Functions:**
- ✅ JavaScript/TypeScript - **ten sam język co frontend**
- ✅ Serverless - zero zarządzania serwerami, PM2, restart policy
- ✅ Automatyczne skalowanie i load balancing
- ✅ Built-in monitoring, logging, error tracking
- ✅ Natywna integracja z FCM i Firestore
- ✅ Deploy jedną komendą: `firebase deploy`

**Porównanie z Node.js/Express na mikr.us:**

| Aspekt | Firebase Functions | Node.js/Express na mikr.us |
|--------|-------------------|----------------------------|
| Krzywa uczenia się | Niska (znany JS/TS) | Średnia-wysoka (Express, DB, deployment) |
| Zarządzanie serwerem | Zero (serverless) | Wymaga PM2, monitoring, restarty |
| Skalowanie | Automatyczne | Manualne (trzeba zwiększyć VPS) |
| Koszt dla hobby project | 0 zł (free tier) | 0 zł (już opłacony VPS) |
| Czas implementacji | 1-2 dni | 5-7 dni |
| Bezpieczeństwo | Zarządzane przez Google | Trzeba samemu zadbać o CORS, rate limiting, itp. |
| Push notifications | FCM out-of-the-box | Web Push API od zera (VAPID keys, subscription) |
| Scheduler | Cloud Scheduler | node-cron (może zawodzić) |

**Werdykt:** Dla osoby bez backend experience Firebase oszczędzi **tygodnie** nauki i debugowania.

### 2.4 Dlaczego Firestore zamiast PostgreSQL?

**Zalety dla frontend developera:**
- ✅ NoSQL - struktura jak JSON (obiekty JavaScript)
- ✅ Brak SQL queries - dokumenty i kolekcje
- ✅ Realtime listeners - automatyczna synchronizacja z UI
- ✅ Offline support - built-in cache
- ✅ Security Rules - prosta składnia podobna do JavaScript
- ✅ Integracja z Firebase Functions

**PostgreSQL na mikr.us wymagałby:**
- ❌ Nauki SQL (SELECT, JOIN, migrations)
- ❌ ORM (Prisma, TypeORM) - dodatkowa warstwa abstrakcji
- ❌ Connection pooling, transaction management
- ❌ Backup strategy, migrations

**Dla tego projektu:** Firestore jest znacznie prostszy i wystarczający.

### 2.5 Dlaczego Tailwind CSS?

**Zalety:**
- ✅ Utility-first - szybki development
- ✅ Nie trzeba pisać osobnych plików CSS
- ✅ Responsywność built-in (`sm:`, `md:`, `lg:`)
- ✅ Świetny DX z autocomplete (Tailwind CSS IntelliSense w VS Code)
- ✅ Mały bundle size (PurgeCSS usuwa nieużywane klasy)
- ✅ **Wskazany w PRD**

**Alternatywy:**
- CSS Modules - więcej boilerplate
- Styled Components - runtime overhead
- Bootstrap - przestarzały, ciężki

### 2.6 Dlaczego Zustand zamiast Redux?

**Zalety:**
- ✅ Minimalistyczny API - łatwy do nauki
- ✅ Mały bundle size (~1KB)
- ✅ Brak boilerplate (actions, reducers, dispatch)
- ✅ TypeScript support out-of-the-box
- ✅ Wystarczający dla prostej aplikacji

**Przykład użycia:**
```typescript
// store.ts
import create from 'zustand'

interface AppState {
  teacherName: string | null
  schedule: DutySchedule[]
  setTeacherName: (name: string) => void
  setSchedule: (schedule: DutySchedule[]) => void
}

export const useStore = create<AppState>((set) => ({
  teacherName: null,
  schedule: [],
  setTeacherName: (name) => set({ teacherName: name }),
  setSchedule: (schedule) => set({ schedule }),
}))
```

**Dla małej aplikacji:** Zustand lub nawet Context API wystarczy.

---

## 3. Architektura aplikacji

### 3.1 Przepływ danych

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND (mikr.us)                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  React App (PWA)                                       │ │
│  │  ├─ Upload Excel (.xlsx)                              │ │
│  │  │  └─ SheetJS parsing (client-side)                  │ │
│  │  ├─ LocalStorage (harmonogram + nazwisko)             │ │
│  │  ├─ Service Worker (offline cache)                    │ │
│  │  └─ FCM Token registration                            │ │
│  └─────────────────┬──────────────────────────────────────┘ │
└────────────────────┼────────────────────────────────────────┘
                     │
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   FIREBASE (Google Cloud)                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Firestore                                             │ │
│  │  ├─ users/{userId} → { fcmToken, teacherName }        │ │
│  │  └─ schedules/{scheduleId} → { duties[], uploadDate } │ │
│  └─────────────────┬──────────────────────────────────────┘ │
│                    │                                         │
│  ┌─────────────────▼──────────────────────────────────────┐ │
│  │  Cloud Functions                                       │ │
│  │  ├─ registerUser(fcmToken, teacherName, schedule)     │ │
│  │  ├─ checkUpcomingDuties() [co 1 min]                  │ │
│  │  └─ sendNotification(fcmToken, message)               │ │
│  └─────────────────┬──────────────────────────────────────┘ │
│                    │                                         │
│  ┌─────────────────▼──────────────────────────────────────┐ │
│  │  Cloud Messaging (FCM)                                 │ │
│  │  └─ Push notification do urządzenia użytkownika       │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                     │
                     ▼
              ┌─────────────┐
              │  Urządzenie │
              │  (PWA)      │
              │  🔔 "Za 10  │
              │  min: dyżur"│
              └─────────────┘
```

### 3.2 Struktura projektu (frontend)

```
dzwonek_app/
├── public/
│   ├── icons/           # PWA icons (192x192, 512x512)
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx
│   │   ├── FileUpload.tsx
│   │   ├── TeacherSelect.tsx
│   │   ├── DutyList.tsx
│   │   ├── Countdown.tsx
│   │   └── ResetButton.tsx
│   ├── services/
│   │   ├── excelParser.ts      # SheetJS logic
│   │   ├── firebase.ts         # Firebase config
│   │   ├── fcm.ts              # FCM token registration
│   │   └── storage.ts          # LocalStorage helpers
│   ├── store/
│   │   └── useStore.ts         # Zustand store
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   ├── utils/
│   │   ├── dateTime.ts
│   │   └── notifications.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css               # Tailwind imports
├── .firebaserc
├── firebase.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

### 3.3 Struktura Firebase Functions

```
functions/
├── src/
│   ├── index.ts                    # Entry point
│   ├── notifications.ts            # Logika powiadomień
│   ├── scheduler.ts                # Sprawdzanie nadchodzących dyżurów
│   └── types.ts                    # TypeScript interfaces
├── package.json
└── tsconfig.json
```

---

## 4. Kluczowe funkcje i implementacja

### 4.1 Upload i parsing Excel (frontend)

**Biblioteka:** SheetJS (xlsx)

**Przykładowa implementacja:**
```typescript
import * as XLSX from 'xlsx';

interface Duty {
  day: string;        // "Poniedziałek"
  break: string;      // "Przerwa 1"
  location: string;   // "Korytarz 1. piętro"
  teacher: string;    // "Kowalski"
  time: string;       // "08:50"
}

export function parseExcel(file: File): Promise<Duty[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        // Zakładając, że dane są w pierwszym arkuszu
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Konwersja do JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // Parsowanie według szablonu (DO DOSTOSOWANIA!)
        const duties: Duty[] = [];

        // PRZYKŁAD: iteracja po wierszach i kolumnach
        // Struktura będzie zależeć od rzeczywistego szablonu Excel
        jsonData.forEach((row: any) => {
          // Logika parsowania zależna od struktury pliku
          // Np. jeśli kolumny to: Dzień | Przerwa | Lokalizacja | Nauczyciel
          if (row['Nauczyciel']) {
            duties.push({
              day: row['Dzień'] || '',
              break: row['Przerwa'] || '',
              location: row['Lokalizacja'] || '',
              teacher: row['Nauczyciel'],
              time: row['Godzina'] || '',
            });
          }
        });

        resolve(duties);
      } catch (error) {
        reject(new Error('Błąd parsowania pliku Excel'));
      }
    };

    reader.onerror = () => reject(new Error('Błąd odczytu pliku'));
    reader.readAsBinaryString(file);
  });
}

// Ekstrakcja unikalnych nazwisk
export function getUniqueTeachers(duties: Duty[]): string[] {
  const teachers = duties.map(d => d.teacher);
  return [...new Set(teachers)].sort();
}
```

**Uwaga:** Parser będzie wymagał dostosowania do **rzeczywistej struktury** pliku Excel z PRD.

### 4.2 Rejestracja FCM Token (frontend)

```typescript
// src/services/fcm.ts
import { getMessaging, getToken } from 'firebase/messaging';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function registerFCMToken(teacherName: string, schedule: Duty[]) {
  try {
    const messaging = getMessaging();

    // Prośba o uprawnienia do powiadomień
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Brak uprawnień do powiadomień');
    }

    // Pobranie tokenu FCM
    const token = await getToken(messaging, {
      vapidKey: 'YOUR_VAPID_PUBLIC_KEY', // Z Firebase Console
    });

    // Zapisanie w Firestore
    const userId = token; // Używamy token jako ID (anonimowy)
    await setDoc(doc(db, 'users', userId), {
      fcmToken: token,
      teacherName,
      schedule,
      createdAt: new Date(),
    });

    // Zapisanie w LocalStorage (backup)
    localStorage.setItem('fcmToken', token);
    localStorage.setItem('teacherName', teacherName);
    localStorage.setItem('schedule', JSON.stringify(schedule));

    return token;
  } catch (error) {
    console.error('Błąd rejestracji FCM:', error);
    throw error;
  }
}
```

### 4.3 Wysyłanie powiadomień (backend - Firebase Functions)

```typescript
// functions/src/notifications.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

interface Duty {
  day: string;
  break: string;
  location: string;
  teacher: string;
  time: string; // Format: "HH:MM"
}

// Funkcja wywoływana co 1 minutę przez Cloud Scheduler
export const checkUpcomingDuties = functions.pubsub
  .schedule('every 1 minutes')
  .onRun(async (context) => {
    const now = new Date();
    const currentDay = now.toLocaleDateString('pl-PL', { weekday: 'long' });
    const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"

    // Oblicz czas za 10 minut
    const notificationTime = new Date(now.getTime() + 10 * 60 * 1000);
    const targetTime = notificationTime.toTimeString().slice(0, 5);

    // Pobierz wszystkich użytkowników
    const usersSnapshot = await admin.firestore().collection('users').get();

    const notifications: Promise<any>[] = [];

    usersSnapshot.forEach((userDoc) => {
      const userData = userDoc.data();
      const { fcmToken, teacherName, schedule } = userData;

      // Sprawdź, czy nauczyciel ma dyżur za 10 minut
      const upcomingDuty = schedule.find((duty: Duty) =>
        duty.teacher === teacherName &&
        duty.day === currentDay &&
        duty.time === targetTime
      );

      if (upcomingDuty) {
        // Wyślij powiadomienie
        const message = {
          notification: {
            title: 'Przypomnienie o dyżurze',
            body: `Za 10 min: dyżur ${upcomingDuty.location}`,
          },
          token: fcmToken,
          webpush: {
            fcmOptions: {
              link: 'https://dzwonek.twoja-domena.pl', // URL aplikacji
            },
          },
        };

        notifications.push(
          admin.messaging().send(message)
            .then(() => console.log(`Powiadomienie wysłane do ${teacherName}`))
            .catch((error) => console.error('Błąd wysyłania:', error))
        );
      }
    });

    await Promise.all(notifications);
    console.log(`Sprawdzono ${usersSnapshot.size} użytkowników`);
  });
```

### 4.4 Service Worker (PWA)

**Vite Plugin PWA** automatycznie wygeneruje Service Worker. Konfiguracja:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'icons/*.png'],
      manifest: {
        name: 'Dzwonek App',
        short_name: 'Dzwonek',
        description: 'Przypomnienia o dyżurach dla nauczycieli',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'firestore-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24, // 24h
              },
            },
          },
        ],
      },
    }),
  ],
});
```

---

## 5. Deployment

### 5.1 Frontend na mikr.us

**Krok 1: Build produkcyjny**
```bash
npm run build
# lub
pnpm build
```

**Krok 2: Upload na VPS**
```bash
# Skopiuj build na serwer
scp -r dist/* user@your-mikrus-ip:/var/www/dzwonek-app/
```

**Krok 3: Konfiguracja nginx**
```nginx
server {
    listen 80;
    server_name dzwonek.twoja-domena.pl;

    root /var/www/dzwonek-app;
    index index.html;

    # Service Worker - brak cache
    location /sw.js {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }

    # Manifest
    location /manifest.webmanifest {
        add_header Content-Type "application/manifest+json";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_types text/css application/javascript application/json;
}
```

**Krok 4: HTTPS (Certbot)**
```bash
sudo certbot --nginx -d dzwonek.twoja-domena.pl
```

### 5.2 Backend (Firebase)

**Krok 1: Zainstaluj Firebase CLI**
```bash
npm install -g firebase-tools
```

**Krok 2: Login i inicjalizacja**
```bash
firebase login
firebase init functions
# Wybierz TypeScript, ESLint
```

**Krok 3: Deploy**
```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

**Krok 4: Konfiguracja Cloud Scheduler**
W Firebase Console:
- Functions → checkUpcomingDuties
- Cloud Scheduler automatycznie utworzy job dla `schedule('every 1 minutes')`

---

## 6. Bezpieczeństwo

### 6.1 Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Użytkownicy mogą tylko odczytać i zapisać swoje dane
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Harmonogramy - tylko właściciel
    match /schedules/{scheduleId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Uwaga:** Aplikacja używa anonimowej autentykacji przez FCM token. Dla lepszego bezpieczeństwa można dodać Firebase Anonymous Authentication.

### 6.2 HTTPS

- ✅ mikr.us: Certbot (Let's Encrypt)
- ✅ Firebase: Automatyczne HTTPS

### 6.3 CORS

Firebase Functions automatycznie obsługują CORS dla określonych domen. Konfiguracja:

```typescript
import * as cors from 'cors';
const corsHandler = cors({ origin: 'https://dzwonek.twoja-domena.pl' });
```

---

## 7. Koszty i limity (Firebase Free Tier)

### 7.1 Cloud Functions
- **Wywołania:** 2,000,000/miesiąc
- **Czas wykonania:** 400,000 GB-sekundy/miesiąc
- **Wychodzący ruch:** 5 GB/miesiąc

**Szacunek dla 50 nauczycieli:**
- `checkUpcomingDuties` wywołana co 1 min = 43,200/miesiąc
- ✅ Wystarczy (tylko 2% limitu)

### 7.2 Firestore
- **Odczyty:** 50,000/dzień
- **Zapisy:** 20,000/dzień
- **Storage:** 1 GB

**Szacunek:**
- 50 nauczycieli × 1 dokument = 50 dokumentów
- ✅ Wystarczy

### 7.3 Cloud Messaging
- **Wiadomości:** Unlimited (darmowe)

### 7.4 Cloud Scheduler
- **Jobs:** 3 darmowe (dla regionu us-central1)

**Werdykt:** Dla projektu hobbystycznego (do ~100 użytkowników) **darmowy tier wystarczy**.

---

## 8. Potencjalne wyzwania i rozwiązania

### 8.1 iOS Safari - powiadomienia PWA

**Problem:** iOS wymaga dodania PWA do ekranu głównego, aby działały powiadomienia.

**Rozwiązanie:**
- Wyświetl banner z instrukcją (PRD US-006)
- Wykryj iOS Safari: `navigator.userAgent.includes('iPhone')`
- Pokaż krok po kroku: "Kliknij Udostępnij → Dodaj do ekranu głównego"

### 8.2 Parsing Excel - różne formaty

**Problem:** Struktura pliku może się różnić.

**Rozwiązanie:**
- Sztywny parser dla MVP (jeden szablon)
- Dokładna walidacja struktury przed parsowaniem
- Komunikaty błędów dla użytkownika

### 8.3 Powiadomienia w tle

**Problem:** Niektóre przeglądarki blokują powiadomienia, gdy karta jest zamknięta.

**Rozwiązanie:**
- Service Worker handle `push` event
- Background Sync API (fallback)
- Instrukcja dla użytkownika: "Nie zamykaj aplikacji całkowicie"

### 8.4 Timezone i czas letni

**Problem:** Dyżury mogą być w różnych strefach czasowych.

**Rozwiązanie:**
- Użyj `Intl.DateTimeFormat` z lokalizacją 'pl-PL'
- Firebase Functions: ustaw timezone na 'Europe/Warsaw'
- Testowanie przed zmianą czasu (marzec/październik)

---

## 9. Roadmap implementacji (MVP)

### Tydzień 1: Setup i podstawy
- [ ] Inicjalizacja projektu Vite + React + TypeScript
- [ ] Konfiguracja Tailwind CSS
- [ ] Setup Firebase (projekt, Firestore, Functions)
- [ ] Podstawowy layout i routing

### Tydzień 2: Core features (frontend)
- [ ] Komponent FileUpload + SheetJS integration
- [ ] Parser Excel (dostosowany do szablonu)
- [ ] Ekstrakcja nazwisk + TeacherSelect component
- [ ] LocalStorage persistence
- [ ] Dashboard z listą dyżurów

### Tydzień 3: Powiadomienia i PWA
- [ ] Rejestracja FCM token
- [ ] Konfiguracja Service Worker (vite-plugin-pwa)
- [ ] Offline functionality
- [ ] iOS Safari banner z instrukcją

### Tydzień 4: Backend i deployment
- [ ] Firebase Functions: checkUpcomingDuties
- [ ] Cloud Scheduler configuration
- [ ] Testowanie powiadomień
- [ ] Deploy na mikr.us (frontend)
- [ ] Deploy Firebase Functions
- [ ] Konfiguracja HTTPS (Certbot)

### Tydzień 5: Testy i polish
- [ ] Testowanie z prawdziwym plikiem Excel
- [ ] Walidacja metryk sukcesu (PRD sekcja 6)
- [ ] Lighthouse audit (performance ≥ 90)
- [ ] Bug fixing
- [ ] Dokumentacja użytkownika

---

## 10. Zasoby i dokumentacja

### Oficjalne dokumentacje
- **React:** https://react.dev/
- **TypeScript:** https://www.typescriptlang.org/docs/
- **Vite:** https://vitejs.dev/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Firebase:** https://firebase.google.com/docs
- **SheetJS:** https://docs.sheetjs.com/

### Tutoriale i przykłady
- **PWA z Vite:** https://vite-pwa-org.netlify.app/
- **Firebase Cloud Functions:** https://firebase.google.com/docs/functions/get-started
- **FCM Web Push:** https://firebase.google.com/docs/cloud-messaging/js/client

### Narzędzia
- **Firebase Emulator Suite:** https://firebase.google.com/docs/emulator-suite
- **PWA Builder:** https://www.pwabuilder.com/ (do testowania PWA)
- **Lighthouse:** https://developers.google.com/web/tools/lighthouse

---

## 11. Alternatywne podejście (100% na mikr.us)

Jeśli chcesz **całkowicie** uniknąć Firebase i hostować wszystko na mikr.us:

### Stack
- Frontend: React + Tailwind (jak wyżej)
- Backend: **Node.js + Express**
- Database: **PostgreSQL** (shared DB na mikr.us)
- Push: **web-push** library
- Scheduler: **node-cron**
- Process manager: **PM2**

### Struktura
```
backend/
├── src/
│   ├── routes/
│   │   ├── users.ts
│   │   └── notifications.ts
│   ├── services/
│   │   ├── scheduler.ts    # node-cron jobs
│   │   └── webPush.ts      # web-push logic
│   ├── db/
│   │   └── queries.ts      # PostgreSQL queries
│   └── server.ts
└── package.json
```

### Plusy
- ✅ Wszystko w jednym miejscu (mikr.us)
- ✅ Pełna kontrola nad kodem

### Minusy
- ❌ **Znacznie więcej pracy:**
  - Nauka Express.js, routing, middleware
  - PostgreSQL: schema design, migrations, queries
  - Web Push API: VAPID keys, subscription management
  - PM2: zarządzanie procesami, auto-restart
  - Monitoring, logging, error handling samodzielnie
- ❌ Brak automatycznego skalowania
- ❌ Trudniejszy deployment i maintenance
- ❌ Szacowany czas: **+2-3 tygodnie** w porównaniu z Firebase

**Rekomendacja:** Dla osoby **bez backend experience** zdecydowanie **Firebase**.

---

## 12. Podsumowanie

### Rekomendowany stack (podsumowanie):

```
┌─────────────────────────────────────────┐
│  Frontend (mikr.us VPS)                 │
│  • React + TypeScript + Vite            │
│  • Tailwind CSS                         │
│  • Workbox (Service Worker)             │
│  • SheetJS (Excel parsing)              │
│  • Zustand (state)                      │
└─────────────────────────────────────────┘
              │
              │ HTTPS
              ▼
┌─────────────────────────────────────────┐
│  Backend (Firebase - Google Cloud)      │
│  • Cloud Functions (TypeScript)         │
│  • Firestore (NoSQL DB)                 │
│  • Cloud Messaging (Push)               │
│  • Cloud Scheduler (Cron)               │
└─────────────────────────────────────────┘
```

### Kluczowe zalety tego podejścia:
1. ✅ **Minimalna krzywa uczenia się** - TypeScript wszędzie
2. ✅ **Serverless** - zero zarządzania infrastrukturą
3. ✅ **Darmowe** - Firebase free tier wystarczy
4. ✅ **Szybka implementacja** - MVP w 3-4 tygodnie
5. ✅ **Kompatybilne z mikr.us** - frontend hostowany tam
6. ✅ **Skalowalne** - automatyczne skalowanie Firebase
7. ✅ **Bezpieczne** - HTTPS, Security Rules, zarządzane przez Google

### Szacowany czas implementacji:
- Dla doświadczonego frontend developera: **3-4 tygodnie**
- Z nauką Firebase: **+1 tydzień**

### Koszt:
- **0 zł** (Firebase free tier + istniejący mikr.us VPS)

---

**Powodzenia z projektem dzwonek_app!** 🚀

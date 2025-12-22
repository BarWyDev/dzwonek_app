# Szkielet projektu dzwonek_app

## 1. Struktura katalogów i plików

```
dzwonek_app/
│
├── .ai/                                  # Dokumentacja projektu
│   ├── prd.md                           # Product Requirements Document
│   └── tech.md                          # Dokument techniczny
│
├── docs/                                 # Dodatkowa dokumentacja
│   └── prd.md                           # Backup PRD
│
├── public/                               # Statyczne zasoby (nie przetwarzane przez Vite)
│   ├── icons/                           # Ikony PWA
│   │   ├── icon-192x192.png            # PWA icon (Android)
│   │   ├── icon-512x512.png            # PWA icon (Android, splash screen)
│   │   └── apple-touch-icon.png        # iOS icon (180x180)
│   ├── favicon.ico                      # Favicon
│   └── robots.txt                       # SEO robots file
│
├── src/                                  # Kod źródłowy frontend
│   │
│   ├── components/                       # Komponenty React
│   │   ├── Dashboard.tsx                # Główny dashboard z harmonogramem
│   │   ├── FileUpload.tsx               # Upload pliku Excel
│   │   ├── TeacherSelect.tsx            # Wybór nazwiska nauczyciela
│   │   ├── DutyList.tsx                 # Lista dzisiejszych dyżurów
│   │   ├── Countdown.tsx                # Odliczanie do najbliższego dyżuru
│   │   ├── ResetButton.tsx              # Przycisk resetowania danych
│   │   ├── IOSInstallPrompt.tsx         # Banner instrukcji dla iOS
│   │   └── Layout.tsx                   # Layout wrapper z nawigacją
│   │
│   ├── services/                         # Logika biznesowa i integracje
│   │   ├── excelParser.ts               # Parsing pliku Excel (SheetJS)
│   │   ├── firebase.ts                  # Konfiguracja Firebase (inicjalizacja)
│   │   ├── fcm.ts                       # Rejestracja tokenu FCM
│   │   ├── storage.ts                   # LocalStorage helpers
│   │   └── firestore.ts                 # Operacje Firestore
│   │
│   ├── store/                            # Zarządzanie stanem (Zustand)
│   │   └── useStore.ts                  # Główny store aplikacji
│   │
│   ├── types/                            # TypeScript types/interfaces
│   │   └── index.ts                     # Centralne typy (Duty, Teacher, etc.)
│   │
│   ├── utils/                            # Utility functions
│   │   ├── dateTime.ts                  # Formatowanie dat, timezone
│   │   ├── notifications.ts             # Helpers dla Web Notifications API
│   │   └── validators.ts                # Walidacja danych Excel
│   │
│   ├── hooks/                            # Custom React hooks
│   │   ├── useNotifications.ts          # Hook do zarządzania powiadomieniami
│   │   └── useDutySchedule.ts           # Hook do obliczania nadchodzących dyżurów
│   │
│   ├── App.tsx                           # Główny komponent App
│   ├── main.tsx                          # Entry point aplikacji
│   ├── index.css                         # Global CSS + Tailwind imports
│   └── vite-env.d.ts                    # Vite TypeScript declarations
│
├── functions/                            # Firebase Cloud Functions (backend)
│   │
│   ├── src/                              # Kod źródłowy functions
│   │   ├── index.ts                     # Entry point (export wszystkich functions)
│   │   ├── notifications.ts             # Logika wysyłania powiadomień
│   │   ├── scheduler.ts                 # Sprawdzanie nadchodzących dyżurów
│   │   ├── types.ts                     # TypeScript interfaces dla backend
│   │   └── utils/                       # Backend utilities
│   │       └── dateTime.ts              # Date/time helpers dla backend
│   │
│   ├── package.json                      # Dependencies dla Firebase Functions
│   ├── tsconfig.json                     # TypeScript config dla functions
│   └── .eslintrc.js                      # ESLint config (generowane przez Firebase)
│
├── firebase/                             # Firebase configuration files
│   ├── firestore.rules                  # Firestore Security Rules
│   ├── firestore.indexes.json           # Firestore indexes (opcjonalnie)
│   └── storage.rules                    # Cloud Storage rules (na przyszłość)
│
├── deployment/                           # Skrypty deployment
│   ├── deploy-frontend.sh               # Deploy frontend na mikr.us
│   └── nginx.conf                       # Przykładowa konfiguracja nginx
│
├── .env.example                          # Przykład zmiennych środowiskowych
├── .env                                  # Zmienne środowiskowe (gitignored)
├── .gitignore                            # Git ignore rules
├── .firebaserc                           # Firebase project configuration
├── firebase.json                         # Firebase config (hosting, functions)
│
├── package.json                          # Frontend dependencies
├── pnpm-lock.yaml                        # Lock file (lub package-lock.json)
├── tsconfig.json                         # TypeScript config (frontend)
├── tsconfig.node.json                    # TypeScript config dla Vite
│
├── vite.config.ts                        # Vite configuration + PWA plugin
├── tailwind.config.js                    # Tailwind CSS configuration
├── postcss.config.js                     # PostCSS config (dla Tailwind)
│
└── README.md                             # Dokumentacja projektu
```

---

## 2. Zależności Frontend (package.json)

```json
{
  "name": "dzwonek-app",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "description": "PWA do przypomnień o dyżurach dla nauczycieli",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "emulator": "firebase emulators:start",
    "deploy:frontend": "pnpm build && sh deployment/deploy-frontend.sh",
    "deploy:functions": "firebase deploy --only functions",
    "deploy:all": "pnpm build && firebase deploy"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "firebase": "^10.13.0",
    "zustand": "^4.5.2",
    "xlsx": "^0.18.5",
    "react-hot-toast": "^2.4.1",
    "lucide-react": "^0.408.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.5.3",
    "vite": "^5.3.4",
    "vite-plugin-pwa": "^0.20.0",
    "workbox-window": "^7.1.0",
    "tailwindcss": "^3.4.6",
    "postcss": "^8.4.39",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-plugin-react-hooks": "^4.6.2",
    "eslint-plugin-react-refresh": "^0.4.7",
    "@typescript-eslint/eslint-plugin": "^7.15.0",
    "@typescript-eslint/parser": "^7.15.0"
  }
}
```

**Kluczowe zależności:**

### Produkcyjne:
- **react** + **react-dom** (^18.3.1) - Framework UI
- **firebase** (^10.13.0) - SDK Firebase (FCM, Firestore, Authentication)
- **zustand** (^4.5.2) - State management
- **xlsx** (^0.18.5) - Parsing plików Excel (SheetJS Community Edition)
- **react-hot-toast** (^2.4.1) - Komponenty toastów/notyfikacji
- **lucide-react** (^0.408.0) - Zestaw ikon SVG

### Deweloperskie:
- **@vitejs/plugin-react** - Plugin React dla Vite
- **typescript** + **@types/*** - TypeScript support
- **vite** (^5.3.4) - Build tool i dev server
- **vite-plugin-pwa** (^0.20.0) - Automatyczna generacja Service Worker
- **workbox-window** (^7.1.0) - Service Worker runtime (używane przez vite-plugin-pwa)
- **tailwindcss** + **postcss** + **autoprefixer** - Styling framework
- **eslint** + plugins - Linting

---

## 3. Zależności Backend (functions/package.json)

```json
{
  "name": "dzwonek-app-functions",
  "version": "1.0.0",
  "description": "Firebase Cloud Functions dla dzwonek_app",
  "main": "lib/index.js",
  "scripts": {
    "build": "tsc",
    "build:watch": "tsc --watch",
    "serve": "npm run build && firebase emulators:start --only functions",
    "shell": "npm run build && firebase functions:shell",
    "start": "npm run shell",
    "deploy": "firebase deploy --only functions",
    "logs": "firebase functions:log"
  },
  "engines": {
    "node": "18"
  },
  "dependencies": {
    "firebase-admin": "^12.3.0",
    "firebase-functions": "^5.0.1"
  },
  "devDependencies": {
    "@types/node": "^20.14.11",
    "typescript": "^5.5.3",
    "eslint": "^8.57.0",
    "eslint-config-google": "^0.14.0",
    "eslint-plugin-import": "^2.29.1",
    "@typescript-eslint/eslint-plugin": "^7.15.0",
    "@typescript-eslint/parser": "^7.15.0"
  },
  "private": true
}
```

**Kluczowe zależności:**

### Produkcyjne:
- **firebase-admin** (^12.3.0) - Admin SDK (dostęp do Firestore, FCM z backendu)
- **firebase-functions** (^5.0.1) - SDK do tworzenia Cloud Functions

### Deweloperskie:
- **typescript** (^5.5.3) - TypeScript compiler
- **@types/node** - Type definitions dla Node.js
- **eslint** + plugins - Linting (zgodny z Firebase best practices)

---

## 4. Pliki konfiguracyjne

### 4.1 vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'icons/*.png'],
      manifest: {
        name: 'Dzwonek App - Przypomnienia o dyżurach',
        short_name: 'Dzwonek',
        description: 'Aplikacja do przypomnień o dyżurach dla nauczycieli',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'firestore-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              }
            }
          },
          {
            urlPattern: /^https:\/\/fcm\.googleapis\.com\/.*/i,
            handler: 'NetworkOnly' // FCM zawsze wymaga sieci
          }
        ]
      },
      devOptions: {
        enabled: true // PWA w trybie development
      }
    })
  ],
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
```

**Cel:** Konfiguracja Vite z pluginem PWA, automatyczna generacja Service Worker i Web Manifest.

---

### 4.2 tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Główny kolor
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
```

**Cel:** Konfiguracja Tailwind CSS z custom kolorami i fontami.

---

### 4.3 postcss.config.js

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**Cel:** PostCSS configuration dla Tailwind i autoprefixer.

---

### 4.4 tsconfig.json (Frontend)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable", "WebWorker"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**Cel:** TypeScript configuration dla frontendu z strict mode.

---

### 4.5 tsconfig.node.json

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

**Cel:** TypeScript config dla plików Vite config.

---

### 4.6 functions/tsconfig.json (Backend)

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "outDir": "lib",
    "sourceMap": true,
    "strict": true,
    "target": "es2017",
    "esModuleInterop": true,
    "resolveJsonModule": true
  },
  "compileOnSave": true,
  "include": [
    "src"
  ]
}
```

**Cel:** TypeScript config dla Firebase Functions (CommonJS).

---

### 4.7 firebase.json

```json
{
  "functions": {
    "source": "functions",
    "predeploy": [
      "npm --prefix \"$RESOURCE_DIR\" run build"
    ],
    "runtime": "nodejs18"
  },
  "firestore": {
    "rules": "firebase/firestore.rules",
    "indexes": "firebase/firestore.indexes.json"
  },
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/sw.js",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache, no-store, must-revalidate"
          }
        ]
      }
    ]
  }
}
```

**Cel:** Główna konfiguracja Firebase (Functions, Firestore, Hosting).

---

### 4.8 .firebaserc

```json
{
  "projects": {
    "default": "dzwonek-app-xxxxx"
  }
}
```

**Cel:** Definicja projektu Firebase (ID projektu z Firebase Console).

**Uwaga:** Plik generowany przez `firebase init`, należy zastąpić `dzwonek-app-xxxxx` rzeczywistym ID projektu.

---

### 4.9 firebase/firestore.rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Kolekcja users - każdy użytkownik ma dostęp tylko do swoich danych
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      // Alternatywnie dla anonimowych użytkowników (tylko FCM token)
      // allow read, write: if true; // Uwaga: niezabezpieczone dla MVP
    }

    // Kolekcja schedules - tylko właściciel może czytać/zapisywać
    match /schedules/{scheduleId} {
      allow read, write: if request.auth != null;
    }

    // Kolekcja notifications (opcjonalna) - tylko odczyt dla właściciela
    match /notifications/{notificationId} {
      allow read: if request.auth != null;
      allow write: if false; // Tylko backend może zapisywać
    }
  }
}
```

**Cel:** Security rules dla Firestore (kontrola dostępu).

**Uwaga:** MVP może używać `allow read, write: if true;` dla prostoty (niezabezpieczone), ale w produkcji należy dodać Firebase Anonymous Authentication.

---

### 4.10 .env.example

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# FCM VAPID Key (Web Push)
VITE_FIREBASE_VAPID_KEY=your_vapid_public_key

# Environment
VITE_ENV=development
```

**Cel:** Szablon zmiennych środowiskowych. Użytkownik kopiuje do `.env` i wypełnia prawdziwymi wartościami z Firebase Console.

---

### 4.11 .gitignore

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Production builds
dist/
build/
functions/lib/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*
*.log

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Firebase
.firebase/
firebase-debug.log
firestore-debug.log
ui-debug.log

# PWA
sw.js
workbox-*.js

# Testing
coverage/
*.test.ts.snap

# Temporary files
*.tmp
.cache/
```

**Cel:** Ignorowanie plików niepotrzebnych w repo (node_modules, buildy, .env, logi).

---

## 5. Kluczowe pliki źródłowe (przykłady)

### 5.1 src/main.tsx (Entry point)

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Rejestracja Service Worker (dla PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered:', registration)
      })
      .catch(error => {
        console.log('SW registration failed:', error)
      })
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**Cel:** Entry point aplikacji React z rejestracją Service Worker.

---

### 5.2 src/index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900 antialiased;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors;
  }

  .card {
    @apply bg-white rounded-xl shadow-md p-6;
  }
}
```

**Cel:** Import Tailwind CSS i podstawowe style globalne.

---

### 5.3 src/types/index.ts

```typescript
export interface Duty {
  id: string
  day: string          // "Poniedziałek", "Wtorek", etc.
  break: string        // "Przerwa 1", "Przerwa 2", etc.
  location: string     // "Korytarz 1. piętro", "Stołówka", etc.
  teacher: string      // "Kowalski Jan"
  time: string         // "08:50" (format HH:MM)
  date?: Date          // Obliczona data następnego dyżuru
}

export interface Teacher {
  name: string
  dutyCount: number
}

export interface AppConfig {
  teacherName: string | null
  schedule: Duty[]
  fcmToken: string | null
  lastUpdate: Date | null
}

export interface NotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
}
```

**Cel:** Centralne definicje typów TypeScript używane w całej aplikacji.

---

### 5.4 src/services/firebase.ts

```typescript
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getMessaging } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const messaging = getMessaging(app)
```

**Cel:** Inicjalizacja Firebase SDK (Firestore, Messaging).

---

### 5.5 functions/src/index.ts (Backend entry point)

```typescript
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()

export { checkUpcomingDuties } from './scheduler'
export { sendNotification } from './notifications'
```

**Cel:** Entry point Firebase Functions - export wszystkich cloud functions.

---

### 5.6 deployment/deploy-frontend.sh

```bash
#!/bin/bash

# Deploy frontend na mikr.us VPS
# Wymagania: dostęp SSH do serwera

SERVER_USER="user"
SERVER_HOST="your-mikrus-ip"
SERVER_PATH="/var/www/dzwonek-app"

echo "Building frontend..."
pnpm build

echo "Deploying to mikr.us..."
scp -r dist/* $SERVER_USER@$SERVER_HOST:$SERVER_PATH/

echo "Restarting nginx..."
ssh $SERVER_USER@$SERVER_HOST "sudo systemctl reload nginx"

echo "Deployment complete!"
```

**Cel:** Automatyzacja deploymentu frontend na VPS mikr.us.

---

### 5.7 deployment/nginx.conf

```nginx
server {
    listen 80;
    server_name dzwonek.example.com;

    root /var/www/dzwonek-app;
    index index.html;

    # Service Worker - bez cache
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
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/css application/javascript application/json image/svg+xml;
}
```

**Cel:** Przykładowa konfiguracja nginx dla mikr.us (przed certyfikatem SSL).

---

## 6. Szczegółowe opisy głównych katalogów

### 6.1 `/src/components/`
Komponenty React - modułowe, reusable UI components. Każdy komponent odpowiada za jedną funkcjonalność (Dashboard, FileUpload, etc.). Używają Tailwind CSS do stylowania.

### 6.2 `/src/services/`
Warstwa logiki biznesowej i integracji zewnętrznych serwisów:
- `excelParser.ts` - parsing Excel z walidacją
- `firebase.ts` - inicjalizacja Firebase SDK
- `fcm.ts` - rejestracja tokenu FCM i handling powiadomień
- `storage.ts` - abstrakcja nad LocalStorage
- `firestore.ts` - operacje CRUD na Firestore

### 6.3 `/src/store/`
Zustand store - globalne zarządzanie stanem aplikacji (teacherName, schedule, tokens). Centralne miejsce dla stanu współdzielonego między komponentami.

### 6.4 `/src/types/`
TypeScript interfaces i typy używane w całej aplikacji. Zapewnia type safety i autocomplete.

### 6.5 `/src/utils/`
Utility functions - czyste funkcje pomocnicze (formatowanie dat, walidacja, itp.). Nie zawierają logiki biznesowej ani state.

### 6.6 `/src/hooks/`
Custom React hooks - reusable logic z użyciem useState, useEffect, etc. Np. `useNotifications` do zarządzania Web Notifications API.

### 6.7 `/functions/src/`
Backend logic w Firebase Cloud Functions:
- `index.ts` - entry point, export wszystkich functions
- `notifications.ts` - logika wysyłania powiadomień przez FCM
- `scheduler.ts` - Cloud Function wywoływana co 1 min (Cloud Scheduler)
- `types.ts` - typy TypeScript dla backend (mogą być współdzielone z frontend)

### 6.8 `/public/`
Statyczne zasoby (nie bundlowane przez Vite) - ikony PWA, favicon, robots.txt. Kopiowane 1:1 do folderu dist podczas buildu.

### 6.9 `/firebase/`
Konfiguracje Firebase:
- `firestore.rules` - Security Rules (kontrola dostępu)
- `firestore.indexes.json` - indexes dla złożonych queries (generowane automatycznie)

### 6.10 `/deployment/`
Skrypty i konfiguracje deployment:
- `deploy-frontend.sh` - automatyczny deploy na mikr.us
- `nginx.conf` - przykładowa konfiguracja nginx dla VPS

---

## 7. Komendy development workflow

### Inicjalizacja projektu:

```bash
# Klonuj repo (jeśli już istnieje) lub utwórz nowy projekt
git clone <repo-url>
cd dzwonek_app

# Zainstaluj dependencies (frontend)
pnpm install

# Zainstaluj dependencies (backend)
cd functions
npm install
cd ..

# Skopiuj .env.example do .env i wypełnij wartości
cp .env.example .env
# Edytuj .env w edytorze

# Zaloguj się do Firebase
firebase login

# Zainicjuj Firebase (jeśli nowy projekt)
firebase init
# Wybierz: Functions, Firestore, Hosting
```

### Development:

```bash
# Start dev server (frontend)
pnpm dev
# Aplikacja dostępna na http://localhost:3000

# Start Firebase Emulators (backend lokalnie)
firebase emulators:start
# Firestore Emulator: http://localhost:8080
# Functions Emulator: http://localhost:5001

# Watch mode dla Functions
cd functions
npm run build:watch
```

### Deployment:

```bash
# Build frontend
pnpm build

# Deploy frontend na mikr.us
pnpm deploy:frontend

# Deploy backend (Firebase Functions)
pnpm deploy:functions

# Deploy wszystko (frontend + backend)
pnpm deploy:all
```

---

## 8. Następne kroki (po utworzeniu szkieletu)

1. **Skonfiguruj Firebase Project** w Firebase Console
2. **Wygeneruj VAPID keys** dla FCM Web Push
3. **Utwórz ikony PWA** (192x192, 512x512, apple-touch-icon)
4. **Zaimplementuj komponenty** zgodnie ze szkieletem
5. **Przetestuj parsing Excel** z prawdziwym plikiem z PRD
6. **Skonfiguruj nginx na mikr.us** i ustaw certyfikat SSL
7. **Przetestuj powiadomienia** lokalnie (Firebase Emulator)
8. **Deploy do produkcji** i przetestuj end-to-end

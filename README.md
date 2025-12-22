# Dzwonek App

Progressive Web App (PWA) do przypomnień o dyżurach dla nauczycieli.

## Technologie

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- Zustand (state management)
- SheetJS/xlsx (parsing Excel)
- Firebase SDK (FCM, Firestore)
- React Hot Toast (notifications)
- Lucide React (icons)

### Backend
- Firebase Cloud Functions (Node.js 18 + TypeScript)
- Firebase Firestore (NoSQL database)
- Firebase Cloud Messaging (push notifications)
- Cloud Scheduler (cron jobs)

## Wymagania

- Node.js 18+ i pnpm (lub npm)
- Konto Firebase (darmowy tier wystarczy)
- Serwer mikr.us z nginx (do hostingu frontendu)

## Instalacja

### 1. Sklonuj repozytorium

```bash
git clone <repo-url>
cd dzwonek_app
```

### 2. Zainstaluj zależności

#### Frontend
```bash
pnpm install
```

#### Backend (Firebase Functions)
```bash
cd functions
npm install
cd ..
```

### 3. Konfiguracja Firebase

#### Utwórz projekt Firebase
1. Przejdź do [Firebase Console](https://console.firebase.google.com/)
2. Utwórz nowy projekt
3. Włącz Firestore Database (tryb production)
4. Włącz Cloud Messaging
5. Wygeneruj VAPID keys (Project Settings → Cloud Messaging → Web Push certificates)

#### Skopiuj konfigurację
```bash
cp .env.example .env
```

Wypełnij plik `.env` wartościami z Firebase Console:
- `VITE_FIREBASE_API_KEY` - API Key z Project Settings
- `VITE_FIREBASE_AUTH_DOMAIN` - Auth Domain
- `VITE_FIREBASE_PROJECT_ID` - Project ID
- `VITE_FIREBASE_STORAGE_BUCKET` - Storage Bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID` - Messaging Sender ID
- `VITE_FIREBASE_APP_ID` - App ID
- `VITE_FIREBASE_VAPID_KEY` - VAPID Public Key (z Cloud Messaging)

#### Zaktualizuj .firebaserc
Edytuj plik `.firebaserc` i zmień `dzwonek-app-xxxxx` na ID swojego projektu Firebase.

### 4. Zaloguj się do Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

### 5. Deploy Firebase Functions i Firestore Rules

```bash
firebase deploy --only functions,firestore
```

## Development

### Start dev server (frontend)
```bash
pnpm dev
```
Aplikacja będzie dostępna na http://localhost:3000

### Test Firebase Functions lokalnie
```bash
firebase emulators:start
```

### Watch mode dla Functions
```bash
cd functions
npm run build:watch
```

## Deployment

### Frontend (mikr.us)

#### 1. Build produkcyjny
```bash
pnpm build
```

#### 2. Konfiguracja nginx na VPS
Edytuj `deployment/nginx.conf` i zmień `dzwonek.example.com` na swoją domenę.

Skopiuj konfigurację na serwer:
```bash
sudo cp deployment/nginx.conf /etc/nginx/sites-available/dzwonek-app
sudo ln -s /etc/nginx/sites-available/dzwonek-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 3. Deploy plików
Edytuj `deployment/deploy-frontend.sh` i zmień wartości:
- `SERVER_USER` - użytkownik SSH
- `SERVER_HOST` - IP serwera mikr.us
- `SERVER_PATH` - ścieżka do folderu web

```bash
chmod +x deployment/deploy-frontend.sh
pnpm deploy:frontend
```

#### 4. Certyfikat SSL (Let's Encrypt)
```bash
ssh user@your-mikrus-ip
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d dzwonek.twoja-domena.pl
```

### Backend (Firebase)
```bash
pnpm deploy:functions
```

Lub deploy wszystkiego naraz:
```bash
pnpm deploy:all
```

## Struktura projektu

```
dzwonek_app/
├── public/                 # Statyczne zasoby PWA
├── src/                    # Kod źródłowy frontend
│   ├── components/        # Komponenty React
│   ├── services/          # Integracje (Firebase, Excel parser)
│   ├── store/             # Zustand store
│   ├── types/             # TypeScript interfaces
│   ├── utils/             # Utility functions
│   └── hooks/             # Custom React hooks
├── functions/              # Firebase Cloud Functions
│   └── src/               # Backend code
├── firebase/               # Firebase config (rules, indexes)
└── deployment/             # Deployment scripts
```

## Konfiguracja pliku Excel

Aplikacja oczekuje pliku `.xlsx` ze strukturą:

| Dzień       | Przerwa    | Lokalizacja         | Nauczyciel  | Godzina |
|-------------|------------|---------------------|-------------|---------|
| Poniedziałek| Przerwa 1  | Korytarz 1. piętro  | Kowalski    | 08:50   |
| Poniedziałek| Przerwa 2  | Stołówka            | Nowak       | 10:40   |

**Uwaga:** Parser w pliku `src/services/excelParser.ts` może wymagać dostosowania do rzeczywistej struktury pliku Excel.

## PWA - Instalacja na iOS

Na iOS (Safari) aplikacja musi być dodana do ekranu głównego, aby działały powiadomienia:

1. Otwórz aplikację w Safari
2. Kliknij przycisk "Udostępnij" (ikona kwadratu ze strzałką)
3. Przewiń w dół i wybierz "Dodaj do ekranu głównego"
4. Kliknij "Dodaj"

## Ikony PWA

Musisz wygenerować ikony PWA i umieścić je w folderze `public/icons/`:
- `icon-192x192.png` (192×192 px)
- `icon-512x512.png` (512×512 px)
- `apple-touch-icon.png` (180×180 px dla iOS)

Możesz użyć narzędzia [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator) do wygenerowania ikon.

## Monitoring

- **Frontend**: Lighthouse audits (Performance, PWA, Accessibility)
- **Backend**: Firebase Console → Functions → Logs
- **FCM**: Firebase Console → Cloud Messaging → Reports

## Bezpieczeństwo

### Firestore Security Rules
Domyślnie aplikacja używa Firebase Authentication dla zabezpieczenia danych. W pliku `firebase/firestore.rules` możesz dostosować reguły bezpieczeństwa.

Dla MVP możesz tymczasowo użyć:
```javascript
allow read, write: if true; // UWAGA: Niezabezpieczone!
```

Ale w produkcji zalecamy włączenie Firebase Anonymous Authentication.

### HTTPS
- Frontend na mikr.us: Certbot (Let's Encrypt)
- Backend (Firebase): Automatyczne HTTPS

## Troubleshooting

### Powiadomienia nie działają
1. Sprawdź czy nadałeś uprawnienia w przeglądarce
2. Sprawdź czy VAPID Key jest poprawny w `.env`
3. Sprawdź czy aplikacja jest zainstalowana jako PWA (na iOS)
4. Sprawdź logi w Firebase Console → Functions

### Excel parser nie działa
1. Sprawdź strukturę pliku Excel
2. Dostosuj parser w `src/services/excelParser.ts` do swojego szablonu
3. Sprawdź nazwy kolumn w pliku Excel

### Build fails
```bash
# Usuń node_modules i zainstaluj ponownie
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

## Licencja

MIT

## Kontakt

Masz pytania? Utwórz Issue w tym repozytorium.

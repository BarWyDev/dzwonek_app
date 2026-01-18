# Setup serwera mikr.us dla GitHub deployment

## WAŻNE: Rozwiązanie problemu Firebase "Missing projectId"

Problem pojawia się, gdy zmienne środowiskowe Firebase nie są dostępne podczas budowania aplikacji. Rozwiązanie: **buduj aplikację na serwerze** z lokalnym plikiem `.env`.

---

## Krok 1: Zaloguj się na serwer mikr.us

```bash
ssh root@florian114.mikr.us -p 10114
```

## Krok 2: Zainstaluj Node.js i pnpm (jeśli nie masz)

```bash
# Sprawdź czy masz Node.js
node --version

# Jeśli nie masz, zainstaluj (Alpine Linux)
apk add nodejs npm

# Zainstaluj pnpm globalnie
npm install -g pnpm

# Sprawdź
pnpm --version
```

## Krok 3: Sklonuj repozytorium GitHub

```bash
# Przejdź do katalogu domowego
cd ~

# Sklonuj repo (dla publicznego repo)
git clone https://github.com/BarWyDev/dzwonek_app.git dzwonek-app-repo

cd dzwonek-app-repo
```

**Jeśli repo jest prywatne:** Musisz skonfigurować SSH key lub Personal Access Token:

<details>
<summary>Konfiguracja dla prywatnego repo (kliknij, żeby rozwinąć)</summary>

### Opcja A: SSH Key (zalecane)

```bash
# Wygeneruj klucz SSH na serwerze
ssh-keygen -t ed25519 -C "twoj_email@example.com"

# Wyświetl klucz publiczny
cat ~/.ssh/id_ed25519.pub
```

1. Skopiuj wyświetlony klucz
2. Wejdź na GitHub → Settings → SSH and GPG keys → New SSH key
3. Wklej klucz

Potem sklonuj używając SSH:
```bash
git clone git@github.com:BarWyDev/dzwonek_app.git dzwonek-app-repo
```

### Opcja B: Personal Access Token

1. Wejdź na GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Zaznacz scope: `repo`
4. Skopiuj wygenerowany token

```bash
# Sklonuj z tokenem
git clone https://TOKEN@github.com/BarWyDev/dzwonek_app.git dzwonek-app-repo
```

</details>

## Krok 4: Utwórz plik .env z konfiguracją Firebase

**⚠️ TO NAJWAŻNIEJSZY KROK - rozwiązuje problem "Missing projectId"**

```bash
cd dzwonek-app-repo

# Utwórz plik .env
nano .env
```

**Wklej swoje dane Firebase** (pobierz je z Firebase Console):

```env
VITE_FIREBASE_API_KEY=twoja-wartość-api-key
VITE_FIREBASE_AUTH_DOMAIN=twoja-wartość.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=twoja-wartość-project-id
VITE_FIREBASE_STORAGE_BUCKET=twoja-wartość.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=twoja-wartość-sender-id
VITE_FIREBASE_APP_ID=1:twoja-wartość:web:twoja-wartość
VITE_FIREBASE_MEASUREMENT_ID=G-twoja-wartość
```

**Zapisz:** Ctrl+O, Enter, Ctrl+X

**Jak znaleźć dane Firebase:**
1. https://console.firebase.google.com/
2. Wybierz swój projekt
3. Settings (koło zębate) → Project settings
4. Przewiń do "Your apps" → Web app
5. Skopiuj wartości z `firebaseConfig`

## Krok 5: Zainstaluj zależności i zbuduj aplikację

```bash
# Zainstaluj dependencies
pnpm install

# Zbuduj aplikację (użyje .env z tego katalogu!)
pnpm build

# Powinien pojawić się katalog dist/
ls -la dist/
```

**Jeśli build się powiódł - widzisz pliki w `dist/`, to znaczy że zmienne środowiskowe są poprawnie wczytane!**

## Krok 6: Skopiuj build do katalogu web

```bash
# Utwórz katalog dla aplikacji (jeśli nie istnieje)
mkdir -p /var/www/dzwonek-app

# Skopiuj pliki
cp -r dist/* /var/www/dzwonek-app/

# Ustaw uprawnienia
chown -R nginx:nginx /var/www/dzwonek-app
chmod -R 755 /var/www/dzwonek-app
```

## Krok 7: Zrestartuj nginx

```bash
service nginx reload
```

## Krok 8: Testuj aplikację

Otwórz w przeglądarce:
```
https://dzwonek.byst.re
```

**Sprawdź konsolę (F12)** - nie powinno być błędu "Missing projectId"!

---

## 🔄 Aktualizacja aplikacji (po zmianach w kodzie)

Po każdej zmianie w kodzie (push do GitHub):

```bash
# Zaloguj się na serwer
ssh root@florian114.mikr.us -p 10114

# Przejdź do katalogu repo
cd ~/dzwonek-app-repo

# Pobierz zmiany
git pull origin main

# Zainstaluj nowe zależności (jeśli są)
pnpm install

# Zbuduj ponownie
pnpm build

# Skopiuj do web directory
rm -rf /var/www/dzwonek-app/*
cp -r dist/* /var/www/dzwonek-app/

# Przeładuj nginx
service nginx reload
```

**Możesz utworzyć skrypt deployment:**

```bash
# Utwórz skrypt
nano ~/deploy.sh
```

Wklej:
```bash
#!/bin/bash
set -e
cd ~/dzwonek-app-repo
git pull origin main
pnpm install
pnpm build
rm -rf /var/www/dzwonek-app/*
cp -r dist/* /var/www/dzwonek-app/
service nginx reload
echo "✅ Deployment complete!"
```

Zapisz i nadaj uprawnienia:
```bash
chmod +x ~/deploy.sh
```

Teraz możesz aktualizować aplikację jedną komendą:
```bash
~/deploy.sh
```

---

## 🔒 Bezpieczeństwo

**⚠️ WAŻNE:** Plik `.env` na serwerze zawiera poufne dane!

```bash
# Upewnij się, że .env NIE jest dostępny publicznie
chmod 600 ~/dzwonek-app-repo/.env

# .env NIE POWINIEN być w /var/www/dzwonek-app (tylko w repo!)
# Tylko zbudowane pliki (dist/) są kopiowane do web directory
```

---

## ✅ Checklist

- [ ] Node.js i pnpm zainstalowane
- [ ] Repozytorium sklonowane
- [ ] Plik `.env` utworzony z poprawnymi danymi Firebase
- [ ] `pnpm install` wykonane pomyślnie
- [ ] `pnpm build` wykonane pomyślnie (katalog `dist/` istnieje)
- [ ] Pliki skopiowane do `/var/www/dzwonek-app/`
- [ ] Nginx przeładowany
- [ ] Aplikacja działa na https://dzwonek.byst.re
- [ ] Brak błędu "Missing projectId" w konsoli

---

## 🆘 Troubleshooting

### Błąd "Missing projectId" nadal występuje

Sprawdź czy:
1. Plik `.env` istnieje w `~/dzwonek-app-repo/`
2. Zawiera poprawne dane (bez spacji, cudzysłowów)
3. Build był wykonany PO utworzeniu `.env`
4. Zmienne zaczynają się od `VITE_` (to ważne dla Vite!)

Testowy check:
```bash
cd ~/dzwonek-app-repo
cat .env  # Sprawdź czy plik istnieje
pnpm build  # Przebuduj
```

### Błąd przy `git pull`

```bash
# Reset lokalnych zmian (UWAGA: usunie lokalne modyfikacje!)
git reset --hard origin/main
git pull
```

### Brak miejsca na dysku

```bash
# Wyczyść node_modules i przeinstaluj
cd ~/dzwonek-app-repo
rm -rf node_modules
pnpm install
```


# Plan wdrożenia Dzwonek App na mikr.us

## 📋 Przegląd

Ten dokument opisuje krok po kroku wdrożenie aplikacji PWA "Dzwonek App" na serwer mikr.us VPS.

---

## 🌐 Rekomendacja dotycząca domeny

### Opcja 1: Darmowa subdomena mikr.us (ZALECANA NA START) ⭐

**Zalety:**
- ✅ **Całkowicie darmowa**
- ✅ **HTTPS już skonfigurowany** (certyfikat SSL z automatu)
- ✅ **Szybka konfiguracja** (5 minut)
- ✅ **Brak dodatkowych kosztów**

**Dostępne formaty:**
1. **wykr.es** - `serwer-port.wykr.es` (np. `frog01-20100.wykr.es`)
2. **byst.re** - własna subdomena (np. `dzwonek.byst.re`)
3. **Panel mikr.us** - subdomena w domenie mikrusa

**Rekomendacja:**
```
dzwonek.byst.re  👈 NAJLEPSZA OPCJA
```
- Krótka, łatwa do zapamiętania
- Profesjonalnie wygląda
- HTTPS z automatu

---

### Opcja 2: Własna domena (dla bardziej profesjonalnego wyglądu)

Jeśli chcesz mieć własną domenę typu `dzwonek.twoja-szkola.pl`:

**Gdzie kupić domenę .pl:**
1. **nazwa.pl** - od 29 zł/rok (popularny polski rejestrator)
2. **home.pl** - od 39 zł/rok
3. **ovh.pl** - od 35 zł/rok
4. **cloudflare.com** - tanie domeny + darmowy CDN

**Proces:**
1. Kup domenę (np. `dzwonek-szkola.pl`)
2. Ustaw rekord DNS A/AAAA na IP mikr.us
3. Skonfiguruj certyfikat SSL (Let's Encrypt)

**Koszt:**
- Domena .pl: ~30-40 zł/rok
- SSL: darmowe (Let's Encrypt)

**Rekomendacja:**
- Na start użyj **darmowej subdomeny byst.re**
- Jeśli aplikacja się sprawdzi - kup własną domenę później

---

## 🚀 Plan wdrożenia krok po kroku

### FAZA 1: Przygotowanie (jednorazowo)

#### Krok 1.1: Zbierz dane dostępowe do mikr.us

Potrzebujesz z emaila powitalnego od mikr.us:
- **Hostname**: np. `srv03.mikr.us`, `frog01.mikr.us`
- **Numer maszyny**: np. 123
- **Port SSH**: 10000 + numer maszyny (np. 10123)
- **Login**: zwykle `u{numer}` (np. `u123`)
- **Hasło**: z emaila lub zresetuj w https://mikr.us/panel/

**Przykład:**
```
Hostname: frog01.mikr.us
Port SSH: 10123
Login: u123
Hasło: twoje_haslo_z_emaila
```

#### Krok 1.2: Test połączenia SSH

**Windows PowerShell:**
```powershell
ssh u123@frog01.mikr.us -p 10123
```

**⚠️ UWAGA:** NIE używaj portu 22! Użyj swojego portu (10000+numer).

Po zalogowaniu powinieneś zobaczyć terminal serwera Alpine Linux.

---

#### Krok 1.3: Instalacja nginx (na serwerze)

```bash
# Zaloguj się przez SSH
ssh u123@frog01.mikr.us -p 10123

# Zainstaluj nginx (Alpine Linux)
apk add nginx

# Uruchom nginx przy starcie systemu
rc-update add nginx default

# Wystartuj nginx
service nginx start

# Sprawdź status
service nginx status
```

---

#### Krok 1.4: Utwórz katalog dla aplikacji

```bash
# Utwórz katalog
mkdir -p /var/www/dzwonek-app

# Ustaw uprawnienia (zamień u123 na swój login)
chown -R u123:u123 /var/www/dzwonek-app
chmod -R 755 /var/www/dzwonek-app
```

---

#### Krok 1.5: Konfiguracja nginx

**A) Znajdź swój port HTTP**

Na mikr.us masz przydzielony zakres portów. Sprawdź w panelu lub emailu.
Przykład: jeśli masz porty 20100-20199, użyj np. **20100** dla HTTP.

**B) Utwórz plik konfiguracyjny nginx**

```bash
# Utwórz plik konfiguracyjny
nano /etc/nginx/http.d/dzwonek-app.conf
```

**Wklej tę konfigurację** (dostosuj port i nazwę):

```nginx
server {
    # Słuchaj na IPv6 (wymagane dla darmowych subdomen mikr.us)
    listen [::]:20100;

    server_name dzwonek.byst.re;

    root /var/www/dzwonek-app;
    index index.html;

    # Service Worker - BEZ cache (KRYTYCZNE!)
    location /sw.js {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }

    location /firebase-messaging-sw.js {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }

    # Manifest PWA
    location /manifest.webmanifest {
        add_header Content-Type "application/manifest+json";
    }

    # SPA routing - React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Kompresja (opcjonalne, ale zalecane)
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/css application/javascript application/json image/svg+xml;
}
```

**Zapisz:** Ctrl+O, Enter, Ctrl+X

**C) Przetestuj konfigurację**

```bash
nginx -t
```

Jeśli OK, zrestartuj nginx:

```bash
service nginx restart
```

---

#### Krok 1.6: Konfiguracja darmowej subdomeny

**Opcja A: Komenda `domena` (najszybsza)**

Na serwerze mikr.us uruchom:

```bash
# Format: domena nazwa.byst.re PORT
domena dzwonek.byst.re 20100
```

Gdzie `20100` to port z konfiguracji nginx (listen [::]:20100).

**Opcja B: Panel mikr.us**

1. Wejdź na https://mikr.us/panel/
2. Znajdź sekcję "Domeny" lub "Subdomeny"
3. Wyklikaj subdomenę wskazującą na port 20100

**Sprawdź:**
Po chwili (1-5 minut) domena powinna być aktywna. Sprawdź:
```bash
curl https://dzwonek.byst.re
```

Jeśli widzisz "403 Forbidden" lub "404" - OK, nginx działa! (plików jeszcze nie ma)

---

### FAZA 2: Deployment aplikacji

#### Krok 2.1: Przygotuj klucz SSH (na swoim komputerze - jednorazowo)

**Windows PowerShell:**

```powershell
# Wygeneruj klucz SSH (jeśli nie masz)
ssh-keygen -t ed25519 -C "twoj_email@example.com"

# Domyślna ścieżka: C:\Users\bwysocki\.ssh\id_ed25519
# Wciśnij Enter 3 razy (bez hasła dla automatycznego deploy)

# Skopiuj klucz publiczny na serwer
type $env:USERPROFILE\.ssh\id_ed25519.pub | ssh u123@frog01.mikr.us -p 10123 "cat >> ~/.ssh/authorized_keys"
```

Teraz możesz logować się bez hasła!

---

#### Krok 2.2: Zaktualizuj skrypt deployment

Edytuj plik `deployment/deploy-frontend.sh`:

```bash
#!/bin/bash

# Konfiguracja mikr.us
SERVER_USER="u123"           # 👈 Twój login z mikr.us
SERVER_HOST="frog01.mikr.us" # 👈 Twój hostname z mikr.us
SERVER_PORT="10123"          # 👈 Twój port SSH (10000 + numer)
SERVER_PATH="/var/www/dzwonek-app"

echo "🔨 Building frontend..."
pnpm build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "📦 Deploying to mikr.us ($SERVER_HOST)..."
scp -P $SERVER_PORT -r dist/* $SERVER_USER@$SERVER_HOST:$SERVER_PATH/

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed!"
    exit 1
fi

echo "🔄 Reloading nginx..."
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "service nginx reload"

echo "✅ Deployment complete!"
echo "🌐 App available at: https://dzwonek.byst.re"
```

**Zapisz plik.**

---

#### Krok 2.3: Testowy deployment

Na swoim komputerze w PowerShell (w katalogu projektu):

```powershell
# Windows: użyj Git Bash lub WSL do uruchomienia .sh
# Alternatywnie możesz uruchomić komendy ręcznie:

# 1. Build
pnpm build

# 2. Upload (dostosuj dane)
scp -P 10123 -r dist/* u123@frog01.mikr.us:/var/www/dzwonek-app/

# 3. Reload nginx
ssh -p 10123 u123@frog01.mikr.us "service nginx reload"
```

---

#### Krok 2.4: Weryfikacja

Otwórz w przeglądarce:
```
https://dzwonek.byst.re
```

**Powinieneś zobaczyć aplikację Dzwonek App!** 🎉

**Sprawdź:**
1. ✅ Czy strona ładuje się przez HTTPS (kłódka w pasku adresu)
2. ✅ Czy możesz wgrać plik Excel
3. ✅ Czy możesz wybrać nauczyciela
4. ✅ Czy przychodzi prośba o uprawnienia do powiadomień
5. ✅ Czy w konsoli (F12) nie ma błędów

---

### FAZA 3: Automatyzacja (opcjonalne)

#### Opcja A: Skrypt PowerShell dla Windows

Utwórz plik `deploy.ps1`:

```powershell
# Konfiguracja
$SERVER_USER = "u123"
$SERVER_HOST = "frog01.mikr.us"
$SERVER_PORT = "10123"
$SERVER_PATH = "/var/www/dzwonek-app"

Write-Host "🔨 Building frontend..." -ForegroundColor Cyan
pnpm build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Deploying to mikr.us..." -ForegroundColor Cyan
scp -P $SERVER_PORT -r dist\* ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    exit 1
}

Write-Host "🔄 Reloading nginx..." -ForegroundColor Cyan
ssh -p $SERVER_PORT ${SERVER_USER}@${SERVER_HOST} "service nginx reload"

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🌐 App: https://dzwonek.byst.re" -ForegroundColor Yellow
```

**Użycie:**
```powershell
.\deploy.ps1
```

#### Opcja B: Dodaj do package.json

```json
"scripts": {
  "deploy": "pnpm build && scp -P 10123 -r dist/* u123@frog01.mikr.us:/var/www/dzwonek-app/ && ssh -p 10123 u123@frog01.mikr.us 'service nginx reload'"
}
```

**Użycie:**
```powershell
pnpm deploy
```

---

## 🔧 Troubleshooting

### Problem: "Connection refused" przy SSH

**Rozwiązanie:**
- Sprawdź czy używasz SWOJEGO portu (10000 + numer maszyny)
- NIE używaj portu 22!
- Sprawdź hostname w emailu od mikr.us

### Problem: "403 Forbidden" po deployment

**Rozwiązanie:**
```bash
# Na serwerze mikr.us
chown -R nginx:nginx /var/www/dzwonek-app
chmod -R 755 /var/www/dzwonek-app
service nginx restart
```

### Problem: "502 Bad Gateway"

**Rozwiązanie:**
```bash
# Sprawdź logi nginx
tail -f /var/log/nginx/error.log

# Sprawdź czy nginx działa
service nginx status

# Zrestartuj nginx
service nginx restart
```

### Problem: Service Worker nie działa

**Rozwiązanie:**
- Sprawdź czy masz HTTPS (kłódka w pasku)
- Sprawdź nagłówki Cache-Control dla sw.js:
  ```bash
  curl -I https://dzwonek.byst.re/sw.js
  ```
- Powinno być: `Cache-Control: no-cache, no-store, must-revalidate`

### Problem: React Router - 404 na podstronach

**Rozwiązanie:**
- Sprawdź czy masz `try_files $uri $uri/ /index.html;` w nginx
- Zrestartuj nginx

### Problem: Powiadomienia nie działają

**Rozwiązanie:**
1. Sprawdź czy domena ma HTTPS
2. Sprawdź w Firebase Console czy są błędy
3. Sprawdź logi funkcji: `firebase functions:log`

---

## 📊 Monitoring i konserwacja

### Sprawdź logi nginx

```bash
# Błędy
tail -f /var/log/nginx/error.log

# Access log
tail -f /var/log/nginx/access.log
```

### Sprawdź użycie zasobów

```bash
# CPU i pamięć
top

# Dysk
df -h

# Nginx status
service nginx status
```

### Aktualizacja aplikacji

Gdy wprowadzisz zmiany w kodzie:

```powershell
# Na swoim komputerze
pnpm deploy
# lub
.\deploy.ps1
```

---

## 💰 Koszty miesięczne (szacowane)

**mikr.us VPS:**
- Podstawowy plan: ~20-30 zł/miesiąc
- Subdomena byst.re: **darmowa**
- HTTPS (dla subdomeny): **darmowe** (automatyczne)

**Firebase:**
- Cloud Functions: ~0 zł (mieszczą się w darmowym tierze)
- Firestore: ~0 zł (minimalne użycie)
- Cloud Messaging: **darmowe**

**RAZEM: ~20-30 zł/miesiąc**

---

## ✅ Checklist wdrożenia

### Przed wdrożeniem:
- [ ] Mam dostęp do mikr.us (hostname, port, login, hasło)
- [ ] Mogę zalogować się przez SSH
- [ ] Nginx zainstalowany i działa
- [ ] Katalog /var/www/dzwonek-app utworzony
- [ ] Konfiguracja nginx gotowa
- [ ] Subdomena skonfigurowana (np. dzwonek.byst.re)

### Po wdrożeniu:
- [ ] Aplikacja ładuje się pod https://dzwonek.byst.re
- [ ] HTTPS działa (kłódka w pasku)
- [ ] Wgrywanie Excel działa
- [ ] Powiadomienia działają (test przez testNotification)
- [ ] Service Worker zarejestrowany (sprawdź w F12 → Application)
- [ ] Brak błędów w konsoli (F12 → Console)

### Testy końcowe:
- [ ] Wgraj prawdziwy plan dyżurów
- [ ] Wybierz nauczyciela
- [ ] Wyślij testowe powiadomienie
- [ ] Poczekaj na automatyczne powiadomienie (jeśli dyżur za <10 min)
- [ ] Sprawdź na telefonie (dodaj PWA do ekranu głównego)

---

## 🎓 Następne kroki

Po udanym wdrożeniu możesz:

1. **Podziel się linkiem** - wyślij https://dzwonek.byst.re nauczycielom
2. **Monitoruj** - sprawdzaj logi i Firebase Console
3. **Optymalizuj** - dodaj Google Analytics, monitoring błędów
4. **Rozwijaj** - dodaj nowe funkcje (powiadomienia email, SMS, etc.)

---

## 📞 Wsparcie

Jeśli coś nie działa:
1. Sprawdź sekcję **Troubleshooting** powyżej
2. Sprawdź logi nginx na serwerze
3. Sprawdź Firebase Functions logs: `firebase functions:log`
4. Sprawdź konsolę przeglądarki (F12)

---

**Powodzenia z wdrożeniem!** 🚀

Jeśli potrzebujesz pomocy na którymkolwiek etapie - daj znać!

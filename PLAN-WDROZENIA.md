# 🚀 PLAN WDROŻENIA - dzwonek.byst.re

**Data:** 14 stycznia 2026  
**Subdomena:** dzwonek.byst.re (✅ już skonfigurowana)  
**Port:** 20114

---

## ⚙️ DANE DO UZUPEŁNIENIA

Zanim zaczniesz, zbierz z emaila od mikr.us:

```
Hostname: _________________.mikr.us  (np. frog01.mikr.us)
Numer maszyny: _____________         (np. 123)
Port SSH: __________________         (10000 + numer, np. 10123)
Login: _____________________         (np. u123)
Hasło: _____________________         (z emaila lub panel)
```

---

## 📝 CHECKLIST WDROŻENIA

### ETAP 1: Przygotowanie serwera (30 min)

#### 1.1 Test połączenia SSH

```powershell
# Zaloguj się na serwer (wpisz swoje dane)
ssh u123@frog01.mikr.us -p 10123
```

- [ ] Udało się zalogować
- [ ] Widzisz terminal Alpine Linux

---

#### 1.2 Instalacja nginx

```bash
# Zainstaluj nginx
apk add nginx

# Włącz autostart
rc-update add nginx default

# Sprawdź status
service nginx status
```

- [ ] nginx zainstalowany
- [ ] nginx dodany do autostartu

---

#### 1.3 Utwórz katalog aplikacji

```bash
# Utwórz katalog
mkdir -p /var/www/dzwonek-app

# Ustaw uprawnienia (zamień u123 na swój login!)
chown -R u123:u123 /var/www/dzwonek-app
chmod -R 755 /var/www/dzwonek-app

# Sprawdź
ls -la /var/www/
```

- [ ] Katalog utworzony
- [ ] Uprawnienia ustawione

---

#### 1.4 Konfiguracja nginx

```bash
# Utwórz plik konfiguracyjny
nano /etc/nginx/http.d/dzwonek-app.conf
```

**Wklej dokładnie tę konfigurację:**

```nginx
server {
    # Słuchaj na IPv6 na porcie 20114 (Twój port!)
    listen [::]:20114;

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

    # Kompresja
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/css application/javascript application/json image/svg+xml;
}
```

**Zapisz plik:** `Ctrl+O`, `Enter`, `Ctrl+X`

```bash
# Przetestuj konfigurację
nginx -t

# Powinno pokazać: "test is successful"
```

- [ ] Plik konfiguracyjny utworzony
- [ ] Test nginx zakończony sukcesem

```bash
# Uruchom nginx
service nginx start

# LUB zrestartuj jeśli już działa
service nginx restart

# Sprawdź status
service nginx status
```

- [ ] nginx działa (active/running)

---

#### 1.5 Test dostępności

```bash
# Na serwerze sprawdź czy nginx słucha
netstat -tlnp | grep 20114

# Powinno pokazać coś w stylu:
# tcp6  0  0 :::20114  :::*  LISTEN  1234/nginx
```

- [ ] nginx słucha na porcie 20114

**Otwórz w przeglądarce:**
```
https://dzwonek.byst.re
```

Powinieneś zobaczyć:
- `403 Forbidden` lub `404 Not Found` - TO JEST OK! (plików jeszcze nie ma)
- ❌ Jeśli `502 Bad Gateway` - sprawdź logi: `tail -f /var/log/nginx/error.log`

- [ ] Strona odpowiada (403/404 to OK)
- [ ] HTTPS działa (kłódka w pasku adresu)

---

### ETAP 2: Konfiguracja deployment z Windows (15 min)

#### 2.1 Sprawdź klucz SSH

**Na swoim Windows (PowerShell):**

```powershell
# Sprawdź czy masz klucz SSH
ls $env:USERPROFILE\.ssh\
```

Jeśli **NIE masz** pliku `id_ed25519` lub `id_rsa`:

```powershell
# Wygeneruj klucz
ssh-keygen -t ed25519 -C "twoj@email.com"

# Wciśnij Enter 3 razy (bez hasła)
```

- [ ] Klucz SSH istnieje lub został utworzony

---

#### 2.2 Skopiuj klucz na serwer

```powershell
# Zamień dane na swoje!
type $env:USERPROFILE\.ssh\id_ed25519.pub | ssh u123@frog01.mikr.us -p 10123 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

**Test logowania bez hasła:**

```powershell
ssh u123@frog01.mikr.us -p 10123
```

- [ ] Logowanie bez hasła działa

---

#### 2.3 Skonfiguruj skrypt deployment

**Edytuj plik:** `deploy.ps1` (w głównym katalogu projektu)

Uzupełnij swoje dane:

```powershell
$SERVER_USER = "u123"              # 👈 TWÓJ login
$SERVER_HOST = "frog01.mikr.us"    # 👈 TWÓJ hostname
$SERVER_PORT = "10123"             # 👈 TWÓJ port SSH
```

- [ ] Plik deploy.ps1 zaktualizowany

Możesz też użyć istniejącego: `deployment/deploy-frontend.ps1`

---

### ETAP 3: Pierwszy deployment (10 min)

#### 3.1 Build aplikacji

**W katalogu projektu (Windows PowerShell):**

```powershell
# Zbuduj aplikację
pnpm build
```

Sprawdź czy:
- [ ] Build zakończył się sukcesem
- [ ] Folder `dist` został utworzony
- [ ] W folderze `dist` są pliki: index.html, assets/, itp.

---

#### 3.2 Upload na serwer

**Opcja A: Automatyczny skrypt**

```powershell
# Użyj przygotowanego skryptu
pnpm deploy
```

**Opcja B: Ręczne komendy**

```powershell
# Upload plików (zamień dane na swoje!)
scp -P 10123 -r dist\* u123@frog01.mikr.us:/var/www/dzwonek-app/

# Reload nginx
ssh -p 10123 u123@frog01.mikr.us "service nginx reload"
```

- [ ] Pliki wgrane na serwer
- [ ] nginx przeładowany

---

#### 3.3 Weryfikacja

**Otwórz w przeglądarce:**
```
https://dzwonek.byst.re
```

Sprawdź:
- [ ] ✅ Strona ładuje się
- [ ] ✅ HTTPS działa (kłódka w pasku)
- [ ] ✅ Layout strony wyświetla się poprawnie
- [ ] ✅ Logo/tytuł "Dzwonek App" widoczny

**Otwórz DevTools (F12):**
- [ ] ✅ Brak błędów w Console
- [ ] ✅ W Network wszystkie pliki ładują się (200 OK)

---

### ETAP 4: Testy funkcjonalne (15 min)

#### 4.1 Test wgrywania pliku Excel

1. Kliknij "Wybierz plik Excel"
2. Wgraj testowy plik z dyżurami
3. Sprawdź czy:
   - [ ] Plik wgrał się bez błędów
   - [ ] Lista dyżurów się wyświetla
   - [ ] Daty są poprawne

---

#### 4.2 Test wyboru nauczyciela

1. Otwórz listę nauczycieli
2. Wybierz dowolnego nauczyciela
3. Sprawdź czy:
   - [ ] Nauczyciel został zapisany
   - [ ] Widok zmienił się na Dashboard
   - [ ] Wyświetla się najbliższy dyżur

---

#### 4.3 Test powiadomień

1. Po wyborze nauczyciela powinno pojawić się pytanie o powiadomienia
2. Kliknij "Zezwól"
3. Sprawdź w DevTools (F12 → Application → Service Workers):
   - [ ] Service Worker jest zarejestrowany
   - [ ] Status: "activated and running"

**Test Firebase Messaging:**

```powershell
# W katalogu functions/
cd functions

# Wyślij testowe powiadomienie
pnpm test:notification
```

- [ ] Powiadomienie przyszło

---

#### 4.4 Test PWA (telefon)

**Na telefonie (iOS/Android):**

1. Otwórz `https://dzwonek.byst.re`
2. Dodaj do ekranu głównego:
   - **iOS:** Safari → Udostępnij → "Dodaj do ekranu początkowego"
   - **Android:** Chrome → Menu → "Dodaj do ekranu głównego"
3. Sprawdź:
   - [ ] Ikona pojawia się na ekranie głównym
   - [ ] Aplikacja otwiera się w trybie standalone (bez paska przeglądarki)
   - [ ] Wszystkie funkcje działają

---

### ETAP 5: Monitoring (na bieżąco)

#### 5.1 Logi nginx

```bash
# Na serwerze mikr.us

# Błędy
tail -f /var/log/nginx/error.log

# Ruch
tail -f /var/log/nginx/access.log
```

#### 5.2 Firebase Console

1. Otwórz: https://console.firebase.google.com
2. Wybierz projekt
3. Sprawdź:
   - Functions → Logs (czy funkcje działają)
   - Cloud Messaging (statystyki powiadomień)
   - Firestore (czy dane się zapisują)

---

## 🔧 TROUBLESHOOTING

### Problem: 502 Bad Gateway

```bash
# Na serwerze
tail -f /var/log/nginx/error.log
service nginx restart
```

### Problem: 403 Forbidden (po deployment)

```bash
# Ustaw uprawnienia
chown -R nginx:nginx /var/www/dzwonek-app
chmod -R 755 /var/www/dzwonek-app
service nginx restart
```

### Problem: Service Worker nie działa

1. Sprawdź czy masz HTTPS (kłódka)
2. Sprawdź nagłówki:
   ```bash
   curl -I https://dzwonek.byst.re/sw.js
   ```
   Powinno być: `Cache-Control: no-cache`

### Problem: Deployment fails (Permission denied)

```bash
# Na serwerze - ustaw uprawnienia dla swojego użytkownika
chown -R u123:u123 /var/www/dzwonek-app
```

---

## 🎉 DEPLOYMENT ZAKOŃCZONY!

**Gratulacje!** Aplikacja jest dostępna pod adresem:
### 🌐 https://dzwonek.byst.re

---

## 📈 NASTĘPNE KROKI

1. **Podziel się linkiem** - wyślij nauczycielom
2. **Monitoruj** - sprawdzaj logi i Firebase Console
3. **Aktualizuj** - gdy wprowadzisz zmiany, uruchom `pnpm deploy`

---

## 🔄 JAK AKTUALIZOWAĆ APLIKACJĘ

Po wprowadzeniu zmian w kodzie:

```powershell
# Zbuduj i wdróż
pnpm deploy
```

Lub ręcznie:
```powershell
pnpm build
scp -P 10123 -r dist\* u123@frog01.mikr.us:/var/www/dzwonek-app/
ssh -p 10123 u123@frog01.mikr.us "service nginx reload"
```

---

**Potrzebujesz pomocy?** Sprawdź logi lub dokumentację w DEPLOYMENT-MIKRUS.md

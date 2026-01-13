# Deployment na mikr.us - Szybki start

## 📋 Przed deploymentem

Potrzebujesz z emaila powitalnego od mikr.us:
- **Hostname**: np. `srv03.mikr.us`, `frog01.mikr.us`
- **Numer maszyny**: np. 123
- **Port SSH**: 10000 + numer maszyny (np. 10123)
- **Login**: zwykle `u{numer}` (np. `u123`)
- **Hasło**: z emaila lub https://mikr.us/panel/

## 🚀 Szybki deployment (3 kroki)

### 1. Zaktualizuj dane w skryptach

**Windows (PowerShell):** `deployment/deploy-frontend.ps1`
**Linux/Mac/Git Bash:** `deployment/deploy-frontend.sh`

```powershell
$SERVER_USER = "u123"              # 👈 Zmień na swój login
$SERVER_HOST = "frog01.mikr.us"    # 👈 Zmień na swój hostname
$SERVER_PORT = "10123"             # 👈 Zmień na swój port SSH
```

### 2. Przygotuj serwer (jednorazowo)

Zaloguj się przez SSH:
```bash
ssh u123@frog01.mikr.us -p 10123
```

Zainstaluj nginx i utwórz katalog:
```bash
apk add nginx
rc-update add nginx default
service nginx start
mkdir -p /var/www/dzwonek-app
chown -R u123:u123 /var/www/dzwonek-app
```

Skopiuj konfigurację nginx:
```bash
# Na swoim komputerze
scp -P 10123 deployment/nginx.conf u123@frog01.mikr.us:/etc/nginx/http.d/dzwonek-app.conf

# Na serwerze mikr.us (przez SSH)
nginx -t
service nginx restart
```

Skonfiguruj subdomenę:
```bash
# Na serwerze mikr.us
domena dzwonek.byst.re 20100
```
*Zamień 20100 na port z nginx.conf (listen [::]:20100)*

### 3. Deploy aplikacji

**Windows PowerShell:**
```powershell
pnpm deploy:frontend
```

**Git Bash / WSL / Linux:**
```bash
pnpm deploy:frontend:bash
```

**Gotowe!** Aplikacja będzie dostępna pod: https://dzwonek.byst.re

---

## 📖 Pełna dokumentacja

Szczegółowa instrukcja krok po kroku: **[DEPLOYMENT-MIKRUS.md](../DEPLOYMENT-MIKRUS.md)**

Zawiera:
- Rekomendacje dotyczące domen
- Rozwiązywanie problemów
- Monitoring i konserwacja
- Checklistę wdrożenia

---

## 🔧 Komendy pomocnicze

### Sprawdź logi nginx
```bash
ssh -p 10123 u123@frog01.mikr.us "tail -f /var/log/nginx/error.log"
```

### Zrestartuj nginx
```bash
ssh -p 10123 u123@frog01.mikr.us "service nginx restart"
```

### Sprawdź status
```bash
ssh -p 10123 u123@frog01.mikr.us "service nginx status"
```

---

## ⚠️ Uwagi

- ⚠️ **NIE używaj portu 22** do SSH - użyj swojego portu (10000+numer)
- ✅ **HTTPS jest automatyczne** dla subdomen mikr.us (byst.re, wykr.es)
- ✅ **IPv6 jest wymagane** - nginx musi słuchać na `[::]:PORT`
- ✅ **Service Worker wymaga** nagłówków `Cache-Control: no-cache` (już w nginx.conf)

---

## 💡 Następne wdrożenie

Po pierwszym setupie, kolejne deploymenty to tylko:

```powershell
pnpm deploy:frontend
```

Zajmuje ~30 sekund! 🚀

# ⚡ Quick Deploy Guide

**Masz 5 minut? Wybierz najszybszą metodę:**

---

## 🎯 Opcja A: Klucze SSH (5 min - raz na zawsze)

**Po co?** Deploy jedną komendą, zero haseł.

```powershell
# 1. Wygeneruj klucz (Enter 3x)
ssh-keygen -t ed25519 -C "twoj_email@gmail.com"

# 2. Skopiuj na serwer (ZMIEŃ: u123, frog01.mikr.us, 10123!)
type $env:USERPROFILE\.ssh\id_ed25519.pub | ssh u123@frog01.mikr.us -p 10123 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
# Wprowadź hasło mikr.us (ostatni raz!)

# 3. Testuj
ssh u123@frog01.mikr.us -p 10123
# Zalogowało bez hasła? ✅ Gotowe!

# 4. Deploy
pnpm deploy:frontend
```

**Zaktualizuj dane w pliku:** `deployment/deploy-frontend.ps1`
- Linia 4: `$SERVER_USER` → twój login (np. `u123`)
- Linia 5: `$SERVER_HOST` → twój hostname (np. `frog01.mikr.us`)
- Linia 6: `$SERVER_PORT` → twój port SSH (np. `10123`)

---

## 🖱️ Opcja B: WinSCP GUI (2 min - dla wizualnych)

**Po co?** Kliknij, przeciągnij, gotowe.

1. **Pobierz:** https://winscp.net/eng/download.php
2. **Zainstaluj** (Next → Next → Finish)
3. **Nowe połączenie:**
   - SFTP
   - Host: `frog01.mikr.us` (twój)
   - Port: `10123` (twój)
   - User: `u123` (twój)
   - Password: ***
   - ✅ Save password
   - Save → Login

4. **Deploy:**
   ```powershell
   pnpm build
   ```
   - WinSCP: przeciągnij `dist/*` → `/var/www/dzwonek-app/`
   ```powershell
   ssh u123@frog01.mikr.us -p 10123 "service nginx reload"
   ```

**LUB użyj skryptu:**
```powershell
pnpm deploy:frontend:winscp
```

---

## 📝 Gdzie znaleźć dane mikr.us?

Sprawdź email powitalny od mikr.us:

```
Login: u123                    👈 $SERVER_USER
Hostname: frog01.mikr.us       👈 $SERVER_HOST
Port: 10123                    👈 $SERVER_PORT (10000 + numer)
Hasło: ***
```

---

## 🚀 Pierwsze wdrożenie (po konfiguracji powyżej)

### 1. Build aplikacji
```powershell
pnpm build
```

### 2. Deploy
```powershell
# SSH Keys:
pnpm deploy:frontend

# WinSCP:
pnpm deploy:frontend:winscp
```

### 3. Sprawdź
Otwórz: https://dzwonek.byst.re

---

## ❓ Problemy?

### "Permission denied"
→ Sprawdź login/hasło w panelu: https://mikr.us/panel/

### "Connection refused"
→ Upewnij się że używasz SWOJEGO portu (NIE 22!)

### "Build failed"
→ Uruchom: `pnpm install`

### Dalsze problemy?
→ Zobacz pełną dokumentację: `DEPLOYMENT-OPTIONS.md`

---

## 🎓 Co dalej?

✅ Skonfigurowałeś deploy
✅ Aplikacja działa na https://dzwonek.byst.re

**Teraz możesz:**
- Wprowadzać zmiany lokalnie
- Uruchamiać `pnpm deploy:frontend`
- Aplikacja aktualizuje się automatycznie!

**Happy deploying!** 🚀

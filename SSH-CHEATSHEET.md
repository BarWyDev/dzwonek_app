# 🚀 SSH Cheatsheet - Szybka ściągawka

## Podstawowa konfiguracja (jednorazowo)

```powershell
# 1. Wygeneruj klucz
ssh-keygen -t ed25519 -C "twoj_email@gmail.com"
# Enter 3x (bez hasła)

# 2. Skopiuj na serwer (ZMIEŃ dane!)
type $env:USERPROFILE\.ssh\id_ed25519.pub | ssh u123@frog01.mikr.us -p 10123 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
# Wpisz hasło mikr.us (ostatni raz!)

# 3. Test
ssh u123@frog01.mikr.us -p 10123
# Zalogowało bez hasła? ✅ Działa!
```

---

## Codzienne użytkowanie

### Deploy aplikacji
```powershell
cd C:\Users\bwysocki\dzwonek_app
pnpm deploy:frontend
```

### Logowanie na serwer
```powershell
ssh u123@frog01.mikr.us -p 10123
```

### Szybkie komendy na serwerze
```bash
# Logi nginx
tail -f /var/log/nginx/error.log

# Restart nginx
service nginx restart

# Status
service nginx status

# Wyloguj
exit
```

---

## Troubleshooting szybkie

### Pyta o hasło mimo klucza?
```powershell
ssh-add $env:USERPROFILE\.ssh\id_ed25519
```

### Connection refused?
```powershell
# Sprawdź czy port jest poprawny (10000 + numer maszyny)
# NIE używaj portu 22!
```

### Host key verification failed?
```powershell
ssh-keygen -R "[frog01.mikr.us]:10123"
```

---

## Gdzie są pliki?

```
C:\Users\bwysocki\.ssh\
├── id_ed25519           ← Klucz prywatny (CHRONIONY!)
├── id_ed25519.pub       ← Klucz publiczny
├── id_ed25519.ppk       ← Klucz PuTTY (opcjonalnie)
└── known_hosts          ← Znane serwery
```

---

## Ważne porady

✅ **Backup kluczy:** Skopiuj katalog `.ssh` na pendrive
✅ **Hasło działa nadal:** Możesz używać hasła w PuTTY
❌ **NIGDY nie udostępniaj** `id_ed25519` (klucz prywatny)

---

## Pełna dokumentacja

Zobacz: `SSH-SETUP-GUIDE.md` - kompletny przewodnik krok po kroku

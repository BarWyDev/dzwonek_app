# 🚀 Pierwsze uruchomienie - florian114

**Czas: 10 minut | Gotowe komendy do skopiowania**

---

## ⚡ EKSPRESOWY START

### ✅ KROK 1: Zmień hasło (2 minuty)

```powershell
# Zaloguj się (hasło znajdziesz w emailu powitalnym od mikr.us)
ssh root@florian114.mikrus.xyz -p 10114

# Na serwerze - zmień hasło
passwd

# Wpisz:
# Current password: [hasło z emaila mikr.us]
# New password: [twoje-nowe-bezpieczne-hasło]
# Retype new password: [powtórz]

# Wyloguj
exit
```

**✅ Zapisz nowe hasło w bezpiecznym miejscu!**

---

### ✅ KROK 2: Skonfiguruj SSH Keys (3 minuty)

Skopiuj i wklej komendy po kolei:

```powershell
# 2.1. Wygeneruj klucz SSH
ssh-keygen -t ed25519 -C "bartoszwysocki82@gmail.com"
```
**Akcja:** Wciśnij **ENTER** 3 razy (bez hasła)

```powershell
# 2.2. Skopiuj klucz na serwer
type $env:USERPROFILE\.ssh\id_ed25519.pub | ssh root@florian114.mikrus.xyz -p 10114 "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
```
**Akcja:**
- Wpisz **yes** (przy pierwszym połączeniu)
- Wpisz **NOWE hasło** (które ustawiłeś w KROK 1)

```powershell
# 2.3. Test - logowanie BEZ hasła
ssh root@florian114.mikrus.xyz -p 10114
```
**Oczekiwany rezultat:** Zalogowało BEZ pytania o hasło! ✅

```bash
# Wyloguj
exit
```

---

### ✅ KROK 3: Sprawdź czy nginx działa (1 minuta)

```powershell
# Zaloguj się
ssh root@florian114.mikrus.xyz -p 10114

# Sprawdź nginx
service nginx status

# Sprawdź katalog aplikacji
ls -la /var/www/dzwonek-app/

# Wyloguj
exit
```

**Oczekiwany rezultat:**
- nginx: `running` lub `active` ✅
- katalog `/var/www/dzwonek-app/` istnieje ✅

**Jeśli nginx nie działa lub katalog nie istnieje:**
→ Zobacz **DEPLOYMENT-MIKRUS.md** - sekcja "Instalacja nginx"

---

### ✅ KROK 4: Pierwszy deployment (4 minuty)

```powershell
# Przejdź do katalogu projektu
cd C:\Users\bwysocki\dzwonek_app

# Deploy aplikacji (BEZ hasła!)
pnpm deploy:frontend
```

**Oczekiwany output:**

```
🔨 Building frontend...

> dzwonek-app@1.0.0 build
> tsc && vite build

vite v5.x.x building for production...
✓ built in 2.34s

📦 Deploying to mikr.us (florian114.mikrus.xyz)...
index.html                    100%
assets/index-abc123.js        100%
...

🔄 Reloading nginx...

✅ Deployment complete!
🌐 App available at: https://dzwonek.byst.re
```

**NIE PYTA O HASŁO!** 🎉

---

### ✅ KROK 5: Weryfikacja (1 minuta)

Otwórz przeglądarkę:
```
https://dzwonek.byst.re
```

**Sprawdź:**
- ✅ Strona ładuje się
- ✅ HTTPS działa (kłódka w pasku adresu)
- ✅ Możesz wgrać plik Excel
- ✅ Konsola (F12) bez błędów

---

## 🎉 GOTOWE! Co osiągnąłeś?

### ✅ Masz skonfigurowane:

1. **Zmienione hasło** - bezpieczny dostęp
2. **SSH Keys** - logowanie bez hasła
3. **Automatyczny deployment** - `pnpm deploy:frontend`
4. **Działającą aplikację** - https://dzwonek.byst.re

---

## 📖 Codzienne użytkowanie

### Deploy aplikacji (po zmianach w kodzie):

```powershell
cd C:\Users\bwysocki\dzwonek_app
pnpm deploy:frontend
```

### Logowanie na serwer:

```powershell
ssh root@florian114.mikrus.xyz -p 10114
```

### Deploy funkcji Firebase:

```powershell
pnpm deploy:functions
```

### Logi nginx na serwerze:

```bash
# Zaloguj się
ssh root@florian114.mikrus.xyz -p 10114

# Zobacz błędy
tail -f /var/log/nginx/error.log

# Ctrl+C aby zakończyć
# exit aby wylogować
```

---

## 🔧 Przydatne aliasy (opcjonalnie)

Dodaj do profilu PowerShell:

```powershell
# Edytuj profil
notepad $PROFILE

# Dodaj na końcu:
function mikrus { ssh root@florian114.mikrus.xyz -p 10114 }
function deploy { cd C:\Users\bwysocki\dzwonek_app; pnpm deploy:frontend }

# Zapisz (Ctrl+S) i zamknij notepad

# Przeładuj profil
. $PROFILE

# Teraz możesz używać:
mikrus    # Logowanie na serwer
deploy    # Deploy aplikacji
```

---

## 🆘 Problemy?

### Nie mogę zalogować się SSH

**Sprawdź:**
```powershell
# 1. Czy serwer odpowiada
ping florian114.mikrus.xyz

# 2. Czy port jest poprawny (10114, NIE 22!)
ssh root@florian114.mikrus.xyz -p 10114 -v

# 3. Czy używasz poprawnego hasła
# (nowe hasło po zmianie w KROK 1)
```

### SSH Keys nie działają

```powershell
# Załaduj klucz do agenta
ssh-add $env:USERPROFILE\.ssh\id_ed25519

# Test ponownie
ssh root@florian114.mikrus.xyz -p 10114
```

### Deployment pyta o hasło

**Rozwiązanie:**
1. Sprawdź czy SSH Keys działają: `ssh root@florian114.mikrus.xyz -p 10114` (bez hasła)
2. Jeśli pyta o hasło - SSH Keys nie są skonfigurowane, powtórz KROK 2

### Nginx nie działa

```powershell
# Zaloguj się
ssh root@florian114.mikrus.xyz -p 10114

# Sprawdź status
service nginx status

# Jeśli nie działa - zainstaluj nginx
apk add nginx
rc-update add nginx default
service nginx start

# Utwórz katalog aplikacji
mkdir -p /var/www/dzwonek-app
chmod 755 /var/www/dzwonek-app

# Wyjdź
exit
```

### Aplikacja nie ładuje się

```powershell
# Sprawdź logi nginx
ssh root@florian114.mikrus.xyz -p 10114
tail -f /var/log/nginx/error.log
```

**Zobacz też:** DEPLOYMENT-MIKRUS.md - sekcja Troubleshooting

---

## 📚 Dalsze kroki

Po ukończeniu pierwszego uruchomienia:

1. **Używaj:** `pnpm deploy:frontend` do deploymentu
2. **Czytaj:** TWOJE-DANE-MIKRUS.md - twoje dane i komendy
3. **Backup:** Skopiuj katalog `C:\Users\bwysocki\.ssh\` (klucze SSH)
4. **Automatyzuj:** Dodaj aliasy PowerShell (sekcja powyżej)

---

## ✅ Checklist końcowy

Po wykonaniu wszystkich kroków sprawdź:

- [ ] Hasło zmienione (KROK 1)
- [ ] SSH Keys skonfigurowane (KROK 2)
- [ ] Logowanie bez hasła działa (`ssh root@florian114...`)
- [ ] Nginx działa (KROK 3)
- [ ] Deployment bez hasła działa (`pnpm deploy:frontend`)
- [ ] Aplikacja działa (https://dzwonek.byst.re)

**Wszystko zaznaczone?** 🎉 **Gratulacje!**

---

## 📞 Wsparcie

- **Twoje dane:** TWOJE-DANE-MIKRUS.md
- **SSH przewodnik:** SSH-SETUP-GUIDE.md
- **Szybka ściągawka:** SSH-CHEATSHEET.md
- **Panel mikr.us:** https://mikr.us/panel/

---

**Powodzenia!** 🚀

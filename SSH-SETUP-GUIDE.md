# 🔐 Kompletny przewodnik SSH - krok po kroku

**Czas: 10 minut | Poziom: Łatwy | Wymagania: PowerShell + PuTTY**

---

## 📋 Co osiągniesz?

Po tym przewodniku będziesz mógł:
- ✅ Logować się do mikr.us **bez hasła** (PowerShell/CMD)
- ✅ Deployować aplikację **jedną komendą** (zero haseł)
- ✅ Używać PuTTY **z kluczem SSH** (opcjonalnie, bez hasła)
- ✅ Zachować obecne logowanie PuTTY z hasłem (backup)

---

## 🎯 KROK 1: Przygotowanie - zbierz dane

### 1.1. Znajdź dane mikr.us

Otwórz email powitalny od mikr.us i znajdź:

```
Login: u123                    ← Twój login
Hostname: frog01.mikr.us       ← Twój serwer
Port SSH: 10123                ← Twój port (10000 + numer maszyny)
Hasło: ***********            ← Twoje hasło
```

**Zapisz te dane - będą potrzebne!**

### 1.2. Sprawdź czy masz PuTTY

```powershell
# Otwórz PowerShell i sprawdź:
putty
```

**Jeśli pokazuje się okno PuTTY:** ✅ Masz zainstalowane, przejdź dalej
**Jeśli błąd "nie znaleziono":** Zainstaluj PuTTY:

```powershell
winget install PuTTY.PuTTY
```

LUB pobierz: https://www.putty.org/

---

## 🔑 KROK 2: Generowanie klucza SSH

### 2.1. Otwórz PowerShell jako Administrator

1. Wciśnij **Windows + X**
2. Wybierz **"Terminal (Admin)"** lub **"PowerShell (Admin)"**
3. Jeśli pyta "Czy zezwolić?" → Kliknij **TAK**

### 2.2. Wygeneruj klucz SSH

Skopiuj i wklej tę komendę (zamień email na swój):

```powershell
ssh-keygen -t ed25519 -C "bartoszwysocki82@gmail.com"
```

**Co się stanie:**

```
Generating public/private ed25519 key pair.
Enter file in which to save the key (C:\Users\bwysocki/.ssh/id_ed25519):
```

**TWOJA AKCJA:** Wciśnij **ENTER** (użyj domyślnej lokalizacji)

```
Enter passphrase (empty for no passphrase):
```

**TWOJA AKCJA:** Wciśnij **ENTER** (pusta fraza = automatyczne logowanie)

```
Enter same passphrase again:
```

**TWOJA AKCJA:** Wciśnij **ENTER** ponownie

**Rezultat:**
```
Your identification has been saved in C:\Users\bwysocki/.ssh/id_ed25519
Your public key has been saved in C:\Users\bwysocki/.ssh/id_ed25519.pub
The key fingerprint is:
SHA256:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx bartoszwysocki82@gmail.com
```

✅ **Sukces!** Klucz SSH został utworzony.

### 2.3. Weryfikacja

Sprawdź czy pliki istnieją:

```powershell
dir $env:USERPROFILE\.ssh\id_ed25519*
```

**Powinieneś zobaczyć:**
```
id_ed25519           ← Klucz prywatny (NIGDY nie udostępniaj!)
id_ed25519.pub       ← Klucz publiczny (ten skopiujesz na serwer)
```

---

## 📤 KROK 3: Skopiowanie klucza na serwer mikr.us

### 3.1. Skopiuj klucz publiczny na serwer

**⚠️ UWAGA: Zamień u123, frog01.mikr.us, 10123 na SWOJE dane z emaila mikr.us!**

```powershell
type $env:USERPROFILE\.ssh\id_ed25519.pub | ssh u123@frog01.mikr.us -p 10123 "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
```

**Co ta komenda robi?**
1. Czyta Twój klucz publiczny
2. Łączy się z serwerem (przez SSH z hasłem - ostatni raz!)
3. Tworzy katalog `.ssh` na serwerze
4. Dodaje klucz do pliku `authorized_keys`
5. Ustawia odpowiednie uprawnienia

**Co się stanie:**

```
The authenticity of host '[frog01.mikr.us]:10123 ([123.45.67.89]:10123)' can't be established.
ED25519 key fingerprint is SHA256:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

**TWOJA AKCJA:** Wpisz **yes** i wciśnij **ENTER**

```
Warning: Permanently added '[frog01.mikr.us]:10123' (ED25519) to the list of known hosts.
u123@frog01.mikr.us's password:
```

**TWOJA AKCJA:** Wpisz **hasło mikr.us** i wciśnij **ENTER**

**Hasło się NIE pokazuje podczas pisania - to normalne!**

Po wpisaniu hasła komenda wykona się (może trwać 1-2 sekundy), potem wrócisz do PowerShell.

✅ **Sukces!** Klucz został skopiowany na serwer.

---

## ✅ KROK 4: Weryfikacja - test logowania bez hasła

### 4.1. Zaloguj się bez hasła

```powershell
ssh u123@frog01.mikr.us -p 10123
```

**ZAMIEŃ: u123, frog01.mikr.us, 10123 na swoje dane!**

**Co POWINNO się stać:**

```
Welcome to Alpine!
...
frog01:~$
```

**Zalogowało Cię BEZ pytania o hasło!** 🎉

**Jeśli pyta o hasło:** ❌ Coś poszło nie tak - zobacz sekcję Troubleshooting na końcu.

### 4.2. Wyloguj się

```bash
exit
```

Wrócisz do PowerShell.

---

## 🚀 KROK 5: Konfiguracja deploymentu

### 5.1. Zaktualizuj dane w skrypcie deployment

Otwórz plik: `C:\Users\bwysocki\dzwonek_app\deployment\deploy-frontend.ps1`

**Znajdź linie 4-6** i wpisz SWOJE dane:

```powershell
# PRZED (przykładowe dane):
$SERVER_USER = "u123"              # 👈 Zmień na swój login
$SERVER_HOST = "frog01.mikr.us"    # 👈 Zmień na swój hostname
$SERVER_PORT = "10123"             # 👈 Zmień na swój port

# PO (twoje prawdziwe dane z emaila mikr.us):
$SERVER_USER = "u456"              # Twój login
$SERVER_HOST = "srv03.mikr.us"     # Twój hostname
$SERVER_PORT = "10456"             # Twój port (10000 + numer)
```

**Zapisz plik** (Ctrl+S)

### 5.2. Test deploymentu

```powershell
# Przejdź do katalogu projektu
cd C:\Users\bwysocki\dzwonek_app

# Uruchom deployment
pnpm deploy:frontend
```

**Co POWINNO się stać:**

```
🔨 Building frontend...

> dzwonek-app@1.0.0 build
> tsc && vite build

vite v5.x.x building for production...
...
✓ built in 2.34s

📦 Deploying to mikr.us (srv03.mikr.us)...
index.html                    100%   1234    45.2KB/s   00:00
assets/index-abc123.js        100%  234KB   2.1MB/s    00:00
assets/index-xyz789.css       100%   12KB   678KB/s    00:00
...

🔄 Reloading nginx...

✅ Deployment complete!
🌐 App available at: https://dzwonek.byst.re
```

**NIE PYTA O HASŁO!** 🎉

✅ **Sukces!** Deployment działa automatycznie bez haseł.

---

## 🖥️ KROK 6: Konfiguracja PuTTY z kluczem SSH (OPCJONALNE)

**Jeśli chcesz żeby PuTTY też logowało bez hasła:**

### 6.1. Konwertuj klucz SSH do formatu PuTTY

PuTTY używa własnego formatu kluczy (.ppk). Przekonwertujemy nasz klucz.

**Otwórz PuTTYgen:**
- Start → wpisz "puttygen" → Enter
- LUB: `C:\Program Files\PuTTY\puttygen.exe`

**W oknie PuTTYgen:**

1. Kliknij **"Conversions"** (górne menu)
2. Wybierz **"Import key"**
3. Przejdź do: `C:\Users\bwysocki\.ssh\`
4. **ZMIEŃ filtr** na dole okna na **"All Files (*.*)"**
5. Wybierz plik: **id_ed25519** (bez rozszerzenia!)
6. Kliknij **"Open"**

**Okno pokazuje Twój klucz:**

```
Public key for pasting into OpenSSH authorized_keys file:
ssh-ed25519 AAAAC3NzaC1lZDI1... bartoszwysocki82@gmail.com
```

7. Kliknij **"Save private key"**
8. Potwierdź **"Yes"** (bez passphrase)
9. Zapisz jako: `C:\Users\bwysocki\.ssh\id_ed25519.ppk`
10. Zamknij PuTTYgen

✅ Klucz przekonwertowany!

### 6.2. Skonfiguruj PuTTY do używania klucza

**Otwórz PuTTY:**

**Krok A: Podstawowe ustawienia**
1. Session:
   - Host Name: `frog01.mikr.us` (twój hostname)
   - Port: `10123` (twój port)
   - Connection type: **SSH**

**Krok B: Dodaj klucz SSH**
2. W drzewie po lewej stronie rozwiń: **Connection → SSH → Auth**
3. Na dole znajdź: **"Private key file for authentication:"**
4. Kliknij **"Browse..."**
5. Wybierz: `C:\Users\bwysocki\.ssh\id_ed25519.ppk`

**Krok C: Automatyczny login**
6. W drzewie po lewej: **Connection → Data**
7. Znajdź: **"Auto-login username"**
8. Wpisz: `u123` (twój login mikr.us)

**Krok D: Zapisz sesję**
9. Wróć do: **Session** (na górze drzewa)
10. W polu **"Saved Sessions"** wpisz: `mikrus-dzwonek-ssh`
11. Kliknij **"Save"**

**Krok E: Zachowaj starą sesję z hasłem (opcjonalnie)**

Jeśli masz już zapisaną sesję z hasłem, zostaw ją:
- `mikrus-dzwonek` - logowanie hasłem (stara)
- `mikrus-dzwonek-ssh` - logowanie kluczem SSH (nowa)

Możesz mieć obie i wybierać w zależności od potrzeb!

### 6.3. Test PuTTY z kluczem SSH

1. W PuTTY wybierz sesję: **"mikrus-dzwonek-ssh"**
2. Kliknij **"Open"**

**Powinno Cię zalogować BEZ pytania o hasło!** 🎉

```
login as: u123
Authenticating with public key "imported-openssh-key"
Welcome to Alpine!
frog01:~$
```

✅ **Sukces!** PuTTY teraz też loguje bez hasła.

---

## 📚 KROK 7: Podsumowanie - co masz teraz?

### Metody logowania do mikr.us:

| Metoda | Hasło? | Jak uruchomić |
|--------|--------|---------------|
| **PowerShell SSH** | ❌ NIE | `ssh u123@frog01.mikr.us -p 10123` |
| **PuTTY (klucz SSH)** | ❌ NIE | Otwórz sesję "mikrus-dzwonek-ssh" |
| **PuTTY (hasło)** | ✅ TAK | Otwórz sesję "mikrus-dzwonek" (stara) |
| **Deployment** | ❌ NIE | `pnpm deploy:frontend` |

### Pliki SSH (lokalizacja: `C:\Users\bwysocki\.ssh\`):

```
id_ed25519           ← Klucz prywatny (chroniony!) - używany przez PowerShell
id_ed25519.pub       ← Klucz publiczny (skopiowany na serwer)
id_ed25519.ppk       ← Klucz PuTTY (używany przez PuTTY)
known_hosts          ← Lista znanych serwerów (automatyczny)
```

**⚠️ WAŻNE:**
- **NIGDY nie udostępniaj** pliku `id_ed25519` (klucz prywatny)
- Możesz udostępnić `id_ed25519.pub` (klucz publiczny)
- Backup: skopiuj katalog `.ssh` na pendrive/cloud (zaszyfrowany!)

---

## 🎯 Codzienne użytkowanie

### Deploy aplikacji (zero haseł!):

```powershell
cd C:\Users\bwysocki\dzwonek_app
pnpm deploy:frontend
```

### Logowanie do serwera:

**PowerShell:**
```powershell
ssh u123@frog01.mikr.us -p 10123
```

**PuTTY:**
- Otwórz PuTTY → Wybierz "mikrus-dzwonek-ssh" → Open

### Szybkie komendy na serwerze:

```bash
# Sprawdź logi nginx
tail -f /var/log/nginx/error.log

# Restart nginx
service nginx restart

# Sprawdź status
service nginx status

# Wyloguj
exit
```

---

## ❌ TROUBLESHOOTING

### Problem 1: "Permission denied (publickey)"

**Objaw:** Po `ssh u123@...` nadal pyta o hasło LUB pokazuje "Permission denied"

**Rozwiązanie:**

```powershell
# 1. Sprawdź czy klucz jest załadowany
ssh-add -l

# Jeśli błąd "Could not open a connection to your authentication agent":
# Uruchom ssh-agent:
Start-Service ssh-agent
Set-Service -Name ssh-agent -StartupType Automatic

# 2. Dodaj klucz do agenta
ssh-add $env:USERPROFILE\.ssh\id_ed25519

# 3. Sprawdź uprawnienia klucza na serwerze
ssh u123@frog01.mikr.us -p 10123 "chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys"

# 4. Testuj ponownie
ssh u123@frog01.mikr.us -p 10123
```

### Problem 2: "Connection refused" lub "Connection timed out"

**Objaw:** Nie można połączyć z serwerem

**Rozwiązanie:**

1. **Sprawdź port** - upewnij się że używasz SWOJEGO portu (10000 + numer):
   ```powershell
   # POPRAWNIE (przykład):
   ssh u456@srv03.mikr.us -p 10456

   # ŹLE (NIE używaj portu 22!):
   ssh u456@srv03.mikr.us -p 22
   ```

2. **Sprawdź hostname** - użyj dokładnie tego z emaila mikr.us

3. **Ping test:**
   ```powershell
   ping frog01.mikr.us
   ```

### Problem 3: PuTTY pyta o hasło mimo klucza

**Rozwiązanie:**

1. Sprawdź czy w PuTTY:
   - Connection → SSH → Auth → Private key jest ustawiony na `id_ed25519.ppk`
   - Connection → Data → Auto-login username jest wypełnione

2. Upewnij się że klucz .ppk został poprawnie utworzony:
   - Otwórz PuTTYgen
   - Load → wybierz `id_ed25519.ppk`
   - Powinno pokazać klucz bez błędów

### Problem 4: "Host key verification failed"

**Objaw:**
```
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
```

**Rozwiązanie:** (rzadki przypadek - serwer zmienił klucz)

```powershell
# Usuń stary klucz serwera
ssh-keygen -R "[frog01.mikr.us]:10123"

# Połącz ponownie (potwierdź nowy klucz)
ssh u123@frog01.mikr.us -p 10123
```

### Problem 5: Deployment pyta o hasło

**Objaw:** `pnpm deploy:frontend` nadal pyta o hasło

**Rozwiązanie:**

1. Sprawdź czy plik `deployment/deploy-frontend.ps1` ma POPRAWNE dane:
   ```powershell
   # Otwórz plik i sprawdź linie 4-6:
   $SERVER_USER = "u123"    # Twój login
   $SERVER_HOST = "frog01.mikr.us"  # Twój hostname
   $SERVER_PORT = "10123"   # Twój port
   ```

2. Test ręczny:
   ```powershell
   # Sprawdź czy to działa bez hasła:
   ssh u123@frog01.mikr.us -p 10123 "echo 'Test OK'"

   # Jeśli pyta o hasło - problem z kluczem SSH (zobacz Problem 1)
   ```

### Problem 6: "No such file or directory" przy deploymencie

**Objaw:** Błąd podczas `scp -r dist/*`

**Rozwiązanie:**

```powershell
# 1. Sprawdź czy katalog dist istnieje
dir dist

# Jeśli nie ma - zbuduj aplikację:
pnpm build

# 2. Sprawdź czy katalog docelowy istnieje na serwerze
ssh u123@frog01.mikr.us -p 10123 "ls -la /var/www/dzwonek-app"

# Jeśli nie istnieje - utwórz:
ssh u123@frog01.mikr.us -p 10123 "mkdir -p /var/www/dzwonek-app && chmod 755 /var/www/dzwonek-app"
```

---

## 🆘 Dalsze problemy?

### Diagnostyka szczegółowa:

```powershell
# Verbose SSH - pokazuje co się dzieje:
ssh -vvv u123@frog01.mikr.us -p 10123

# Sprawdź wszystkie klucze:
dir $env:USERPROFILE\.ssh\

# Test połączenia SCP:
echo "test" > test.txt
scp -P 10123 test.txt u123@frog01.mikr.us:~/
rm test.txt
```

### Kontakt z mikr.us:

- Panel: https://mikr.us/panel/
- Pomoc: https://mikr.us/panel/?a=pomoc
- Forum: https://forum.mikr.us/

---

## 🎓 Dodatkowe wskazówki

### Bezpieczeństwo:

1. **Backup kluczy SSH:**
   ```powershell
   # Skopiuj cały katalog .ssh
   Copy-Item -Recurse $env:USERPROFILE\.ssh C:\Backup\ssh-backup-$(Get-Date -Format 'yyyy-MM-dd')
   ```

2. **Jeśli zgubisz klucz:**
   - Nadal możesz logować się hasłem
   - Wygeneruj nowy klucz i powtórz KROK 2-3
   - Stary klucz zostanie zastąpiony

3. **Klucz z hasłem (bardziej bezpieczne):**
   - Przy `ssh-keygen` podaj hasło zamiast Enter
   - Będziesz musiał wpisać to hasło przy każdym użyciu klucza
   - Ale nie hasło do serwera, tylko do klucza

### Alias PowerShell (opcjonalnie):

Dodaj do profilu PowerShell dla szybszego logowania:

```powershell
# Edytuj profil
notepad $PROFILE

# Dodaj na końcu pliku (zmień dane!):
function mikrus { ssh u123@frog01.mikr.us -p 10123 }

# Zapisz i zamknij notepad

# Przeładuj profil
. $PROFILE

# Teraz możesz logować się wpisując tylko:
mikrus
```

---

## ✅ Checklist końcowy

Po ukończeniu tego przewodnika sprawdź:

- [ ] Klucz SSH wygenerowany (`id_ed25519` istnieje)
- [ ] Klucz skopiowany na serwer (KROK 3 wykonany)
- [ ] Logowanie bez hasła działa: `ssh u123@frog01.mikr.us -p 10123`
- [ ] Plik `deploy-frontend.ps1` ma poprawne dane
- [ ] Deployment działa: `pnpm deploy:frontend` (zero haseł)
- [ ] (Opcjonalnie) PuTTY z kluczem SSH skonfigurowane
- [ ] (Opcjonalnie) Backup kluczy SSH wykonany

**Wszystko zaznaczone?** 🎉 **Gratulacje! Masz w pełni zautomatyzowany deployment!**

---

## 📖 Co dalej?

Teraz możesz:
- Wprowadzać zmiany w kodzie lokalnie
- Uruchamiać `pnpm deploy:frontend`
- Aplikacja aktualizuje się na produkcji **bez wpisywania haseł**!

**Happy deploying!** 🚀

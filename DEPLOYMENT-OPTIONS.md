# 🚀 Opcje deploymentu na mikr.us

## Porównanie metod

| Metoda | Trudność | Czas setup | Automatyzacja | Wymaga hasła | Bezpieczeństwo |
|--------|----------|------------|---------------|--------------|----------------|
| **SSH Keys** ⭐ | Łatwa | 5 min (1x) | ✅ Pełna | ❌ Nie | ⭐⭐⭐⭐⭐ |
| **WinSCP GUI** | Bardzo łatwa | 2 min | ⚠️ Ręczna | 💾 Zapisane | ⭐⭐⭐⭐ |
| **PuTTY/plink** | Średnia | 10 min | ✅ Pełna | 💾 W sesji | ⭐⭐⭐ |
| **SSH z hasłem** | Łatwa | 0 min | ❌ Ręczna | ✅ Co deploy | ⭐⭐ |

---

## 🎯 Która metoda dla mnie?

### **Dla szybkiego startu → WinSCP**
✅ Jeśli chcesz **natychmiast** deploy bez konfiguracji

### **Dla wygody → SSH Keys**
✅ Jeśli planujesz częste deploymenty (>3 razy/tydzień)

### **Dla automatyzacji CI/CD → SSH Keys**
✅ Jeśli chcesz GitHub Actions / automatyczny deploy

---

## Metoda 1: SSH Keys (ZALECANA) ⭐

### Dlaczego?
- **Raz skonfigurujesz, zawsze działa**
- **Najszybszy deploy** - jedna komenda
- **Najbezpieczniejsza** metoda
- **Działa z każdym narzędziem** (scp, rsync, git)

### Konfiguracja (PowerShell):

```powershell
# 1. Wygeneruj klucz SSH
ssh-keygen -t ed25519 -C "twoj_email@example.com"
# Wciśnij Enter 3x (bez hasła)

# 2. Skopiuj klucz na serwer mikr.us
# ZMIEŃ: u123, frog01.mikr.us, 10123 na swoje dane!
type $env:USERPROFILE\.ssh\id_ed25519.pub | ssh u123@frog01.mikr.us -p 10123 "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"

# Wprowadź hasło mikr.us (ostatni raz!)

# 3. Test - teraz bez hasła:
ssh u123@frog01.mikr.us -p 10123
```

### Deploy:
```powershell
pnpm deploy:frontend
```

**Gotowe!** 🎉 Teraz każdy deploy to jedna komenda, zero haseł.

---

## Metoda 2: WinSCP (GUI)

### Dlaczego?
- **Najłatwiejsza** - kliknij i przeciągnij
- **Wizualna kontrola** - widzisz co uploadujesz
- **Zapisuje hasło** - nie wprowadzasz za każdym razem

### Instalacja:

1. **Pobierz WinSCP**: https://winscp.net/eng/download.php
2. **Zainstaluj** (Next → Next → Finish)

### Konfiguracja:

1. Otwórz WinSCP → "New Site"
2. Wpisz dane:
   ```
   File protocol: SFTP
   Host name: frog01.mikr.us       (twój hostname)
   Port number: 10123              (twój port SSH)
   User name: u123                 (twój login)
   Password: ***                   (hasło mikr.us)
   ```
3. ✅ Zaznacz: **"Save password"**
4. Kliknij **"Save"** → wpisz nazwę: "mikrus-dzwonek"
5. Kliknij **"Login"**

### Deploy:

1. **Build aplikacji** (PowerShell):
   ```powershell
   pnpm build
   ```

2. **Upload przez WinSCP**:
   - Lewa strona: `C:\Users\bwysocki\dzwonek_app\dist`
   - Prawa strona: `/var/www/dzwonek-app`
   - Przeciągnij wszystkie pliki z `dist` na prawo
   - Kliknij "OK" → gotowe!

3. **Reload nginx** (PowerShell):
   ```powershell
   ssh u123@frog01.mikr.us -p 10123 "service nginx reload"
   ```

### Automatyzacja (opcjonalne):

Użyj skryptu:
```powershell
.\deployment\deploy-winscp.ps1
```

---

## Metoda 3: PuTTY/plink

### Dlaczego?
- **Zapisuje hasło w sesji**
- **Pełna automatyzacja** w PowerShell
- **Natywne Windows**

### Instalacja:

```powershell
# Przez winget (zalecane):
winget install PuTTY.PuTTY

# LUB pobierz: https://www.putty.org/
```

### Konfiguracja:

1. Otwórz **PuTTY**
2. Wpisz:
   - Host Name: `frog01.mikr.us`
   - Port: `10123`
3. Connection → Data → Auto-login username: `u123`
4. Session → Saved Sessions: wpisz `mikrus-dzwonek`
5. Kliknij **"Save"**
6. Kliknij **"Open"** → wprowadź hasło (pierwszy raz)
7. Zamknij PuTTY

### Deploy:

```powershell
.\deployment\deploy-plink.ps1
```

---

## Metoda 4: SSH z hasłem (obecna)

### Dlaczego?
- **Działa od razu** bez konfiguracji
- **Najprostsza** technicznie

### Wady:
- ❌ Musisz **wpisywać hasło 2 razy** przy każdym deploy
- ❌ **Wolniejsze** (czekanie na prompt hasła)
- ❌ **Trudne do automatyzacji**

### Deploy:

```powershell
pnpm deploy:frontend
# Wpisz hasło → upload
# Wpisz hasło ponownie → reload nginx
```

---

## 📊 Polecane kombinacje

### Dla developera (częste deploymenty):
1. **SSH Keys** → automatyczny deploy
2. Backup: **WinSCP** → szybkie poprawki przez GUI

### Dla okazjonalnych deploymentów:
1. **WinSCP** → wizualny upload
2. Backup: **SSH z hasłem** → fallback

### Dla CI/CD (GitHub Actions):
1. **SSH Keys** (dodaj klucz prywatny do GitHub Secrets)

---

## 🔧 Troubleshooting

### "Permission denied (publickey)"
```powershell
# Sprawdź czy klucz jest załadowany:
ssh-add -l

# Dodaj klucz:
ssh-add $env:USERPROFILE\.ssh\id_ed25519
```

### "Connection refused" lub timeout
- Sprawdź czy używasz **poprawnego portu** (NIE 22!)
- Port = 10000 + numer maszyny z emaila mikr.us

### WinSCP: "Host key wasn't cached"
- Kliknij **"Yes"** przy pierwszym połączeniu
- To normalne - dodaje klucz serwera do zaufanych

### Hasło nie działa
- Sprawdź w panelu: https://mikr.us/panel/
- Możesz zresetować hasło przez panel

---

## 🎓 Moja rekomendacja

**Zacznij od WinSCP** (2 minuty setup):
```
✅ Natychmiastowy deploy
✅ Zero problemów
✅ Zapisane hasło
```

**Potem dodaj SSH Keys** (5 minut):
```
✅ Automatyzacja
✅ Szybsze deploymenty
✅ Gotowe na CI/CD
```

**Efekt końcowy:**
- **WinSCP** → szybkie poprawki, upload plików
- **PowerShell** → automatyczny deploy przez `pnpm deploy:frontend`
- **Najlepsze z obu światów!** 🎉

---

## Następne kroki

1. **Wybierz metodę** z powyższych
2. **Skonfiguruj** (5-10 minut)
3. **Testuj** deploy
4. **Profit!** 🚀

Powodzenia!

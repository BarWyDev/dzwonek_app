# 🚀 Przewodnik Deploymentu - Start tutaj

## 📚 Mapa dokumentacji

```
┌─────────────────────────────────────────────────┐
│  🎯 QUICK-DEPLOY.md                             │
│  Szybki start - 5 minut                         │
│  → Najszybsza ścieżka do pierwszego deploy      │
└─────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────┐
│  🔐 SSH-SETUP-GUIDE.md                          │
│  Kompletny przewodnik SSH krok po kroku         │
│  → Logowanie i deploy BEZ HASŁA (10 minut)      │
└─────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────┐
│  📖 SSH-CHEATSHEET.md                           │
│  Szybka ściągawka komend                        │
│  → Codzienne użytkowanie                        │
└─────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────┐
│  📊 DEPLOYMENT-OPTIONS.md                       │
│  Porównanie wszystkich metod deploymentu        │
│  → Szczegóły: SSH Keys, WinSCP, PuTTY, itp.     │
└─────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────┐
│  🌐 DEPLOYMENT-MIKRUS.md                        │
│  Kompletna konfiguracja serwera mikr.us         │
│  → Nginx, domeny, certyfikaty SSL               │
└─────────────────────────────────────────────────┘
```

---

## ⚡ Szybki wybór - która instrukcja dla mnie?

### 🎯 "Chcę NATYCHMIAST deploy - zero komplikacji"
→ **`QUICK-DEPLOY.md`** (5 minut)
- Opcja A: SSH Keys (zalecane)
- Opcja B: WinSCP GUI

### 🔐 "Chcę skonfigurować SSH - automatyczny deploy bez haseł"
→ **`SSH-SETUP-GUIDE.md`** (10 minut)
- Krok po kroku z screenshotami opisanymi
- Wszystkie możliwe problemy rozwiązane
- Weryfikacja po każdym kroku

### 📖 "Znam SSH, potrzebuję tylko komend"
→ **`SSH-CHEATSHEET.md`** (1 minuta)
- Szybka ściągawka
- Tylko najważniejsze komendy

### 📊 "Chcę porównać wszystkie metody deploymentu"
→ **`DEPLOYMENT-OPTIONS.md`** (10 minut czytania)
- SSH Keys vs WinSCP vs PuTTY
- Tabele porównawcze
- Szczegółowe instrukcje dla każdej metody

### 🌐 "Konfiguruję serwer mikr.us od zera"
→ **`DEPLOYMENT-MIKRUS.md`** (30 minut)
- Instalacja nginx
- Konfiguracja domeny
- Certyfikaty SSL
- Troubleshooting serwera

---

## 🎓 Rekomendowana ścieżka dla początkujących

```
1. Przeczytaj: QUICK-DEPLOY.md (5 min)
   ↓
2. Wykonaj: SSH-SETUP-GUIDE.md (10 min)
   ↓
3. Używaj: SSH-CHEATSHEET.md (codziennie)
   ↓
4. 🎉 Masz automatyczny deployment!
```

---

## 📦 Dostępne komendy deployment

### Frontend (aplikacja React PWA)

```powershell
# Podstawowy (wymaga SSH Keys):
pnpm deploy:frontend

# Przez WinSCP (GUI):
pnpm deploy:frontend:winscp

# Przez PuTTY plink:
pnpm deploy:frontend:plink

# Bash (Linux/Mac/Git Bash):
pnpm deploy:frontend:bash
```

### Backend (Firebase Functions)

```powershell
# Tylko funkcje:
pnpm deploy:functions

# Build + wszystko:
pnpm deploy:all
```

---

## 🔧 Skrypty deployment (katalog `deployment/`)

```
deployment/
├── deploy-frontend.ps1    ← PowerShell + SSH (główny)
├── deploy-frontend.sh     ← Bash + SSH (Linux/Mac)
├── deploy-winscp.ps1      ← PowerShell + WinSCP GUI
└── deploy-plink.ps1       ← PowerShell + PuTTY plink
```

### Konfiguracja przed użyciem

**Edytuj wybrany skrypt i zmień:**

```powershell
$SERVER_USER = "u123"              # ← Twój login z mikr.us
$SERVER_HOST = "frog01.mikr.us"    # ← Twój hostname
$SERVER_PORT = "10123"             # ← Twój port SSH (10000 + numer)
```

---

## 🎯 Najczęstsze pytania

### Q: Mam już działające logowanie PuTTY z hasłem. Co mi da SSH?
A: **Deploy bez wpisywania haseł!** Obecne logowanie dalej działa.

### Q: Czy stracę dostęp przez hasło po skonfigurowaniu SSH?
A: **NIE!** Hasło działa nadal. SSH to dodatkowa opcja.

### Q: Ile czasu zajmuje deployment?
A: **~30 sekund** (build) + **~5 sekund** (upload) = **~35 sekund total**

### Q: Czy mogę mieć kilka metod deploymentu?
A: **TAK!** Możesz używać SSH + WinSCP + PuTTY równocześnie.

### Q: Co jeśli coś pójdzie nie tak?
A: Każda instrukcja ma sekcję **Troubleshooting** z rozwiązaniami.

---

## 🆘 Pomoc

### Problemy z SSH?
→ Zobacz **Troubleshooting** w `SSH-SETUP-GUIDE.md`

### Problemy z serwerem mikr.us?
→ Zobacz **Troubleshooting** w `DEPLOYMENT-MIKRUS.md`

### Problemy z Firebase?
→ Sprawdź logi: `firebase functions:log`

### Dalsze problemy?
1. Sprawdź logi nginx: `ssh ... "tail -f /var/log/nginx/error.log"`
2. Panel mikr.us: https://mikr.us/panel/
3. Forum mikr.us: https://forum.mikr.us/

---

## 🎉 Status projektu

### Frontend (PWA)
- ✅ Build: `pnpm build`
- ✅ Deploy: `pnpm deploy:frontend`
- 🌐 Live: https://dzwonek.byst.re

### Backend (Firebase)
- ✅ Functions: `pnpm deploy:functions`
- 📊 Console: https://console.firebase.google.com/project/dzwonek-app

---

## 📝 Changelog deploymentu

- **2026-01-19**: Dodano kompletny system SSH deployment
  - `SSH-SETUP-GUIDE.md` - przewodnik krok po kroku
  - `SSH-CHEATSHEET.md` - szybka ściągawka
  - `deploy-winscp.ps1` - deployment przez WinSCP
  - `deploy-plink.ps1` - deployment przez PuTTY

- **2026-01-16**: Pierwsza wersja deployment mikr.us
  - `DEPLOYMENT-MIKRUS.md` - konfiguracja serwera
  - `deploy-frontend.ps1` - skrypt PowerShell

---

**Powodzenia z deploymentem!** 🚀

Jeśli masz pytania - wszystkie odpowiedzi są w dokumentacji powyżej.

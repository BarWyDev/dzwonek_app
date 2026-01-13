# 📚 Dokumentacja projektu dzwonek_app

Katalog `.ai/` zawiera kompletną dokumentację techniczną projektu.

## 📑 Spis dokumentów

### 1. Dokumenty projektowe
| Plik | Opis | Rozmiar |
|------|------|---------|
| `prd.md` | Product Requirements Document - wymagania produktu | 5.3 KB |
| `tech.md` | Dokument techniczny - rekomendowany stos technologiczny | 29 KB |
| `sceleton.md` | Struktura projektu - folder tree i zależności | 26 KB |

### 2. Przewodniki Firebase (OPCJA A)
| Plik | Opis | Rozmiar | Czas czytania |
|------|------|---------|---------------|
| `firebase-quick-start.md` | ⚡ **START TUTAJ** - Szybki start (10 min) | 4.5 KB | 5 min |
| `firebase-setup-guide.md` | 📖 Pełny przewodnik konfiguracji Firebase | 11 KB | 15 min |
| `firebase-credentials-template.md` | 📝 Szablon do zapisywania kluczy Firebase | 2.9 KB | - |
| `firebase-commands-cheatsheet.md` | 🔧 Ściągawka komend Firebase CLI | 6.0 KB | 10 min |

---

## 🚀 Quick Links - Zacznij tutaj

### Jestem na etapie:

#### 1️⃣ **Dopiero zaczynam projekt**
→ Przeczytaj: `prd.md` → `tech.md` → `sceleton.md`

#### 2️⃣ **Mam już projekt lokalnie, chcę skonfigurować Firebase**
→ Przeczytaj: `firebase-quick-start.md` (dla szybkiego startu)
→ Lub: `firebase-setup-guide.md` (dla szczegółów)

#### 3️⃣ **Firebase skonfigurowany, potrzebuję komend CLI**
→ Przeczytaj: `firebase-commands-cheatsheet.md`

#### 4️⃣ **Potrzebuję zapiszę gdzieś klucze Firebase**
→ Użyj: `firebase-credentials-template.md`

---

## 📖 Szczegółowy opis dokumentów

### `prd.md` - Product Requirements Document
**Dla kogo**: Product Manager, Developer, Stakeholder

**Co zawiera**:
- Przegląd produktu
- Problem użytkownika
- Wymagania funkcjonalne (US-001 do US-007)
- Granice produktu (MVP)
- Metryki sukcesu

**Kiedy czytać**: Na początku projektu, aby zrozumieć DLACZEGO i CO budujemy

---

### `tech.md` - Dokument techniczny
**Dla kogo**: Developer, Tech Lead

**Co zawiera**:
- Rekomendowany stos technologiczny (React, Firebase, Tailwind)
- Uzasadnienie każdego wyboru technologicznego
- Architektura aplikacji (diagramy)
- Przykłady kodu (Excel parser, FCM, Service Worker)
- Instrukcje deployment

**Kiedy czytać**: Przed rozpoczęciem implementacji, aby zrozumieć JAK budujemy

---

### `sceleton.md` - Struktura projektu
**Dla kogo**: Developer

**Co zawiera**:
- Pełne drzewo folderów i plików
- Wszystkie zależności (frontend + backend)
- Pliki konfiguracyjne (vite.config.ts, firebase.json, etc.)
- Przykładowe pliki źródłowe
- Komendy development workflow

**Kiedy czytać**: Podczas inicjalizacji projektu, aby zrozumieć strukturę

---

### `firebase-quick-start.md` - Szybki start Firebase ⚡
**Dla kogo**: Developer bez doświadczenia z Firebase

**Co zawiera**:
- 5 kroków do działającego Firebase (10 minut)
- Minimalistyczny approach - tylko najważniejsze
- Checklist weryfikacji
- Troubleshooting najczęstszych problemów

**Kiedy czytać**: Gdy chcesz szybko skonfigurować Firebase i zacząć testować

---

### `firebase-setup-guide.md` - Pełny przewodnik Firebase 📖
**Dla kogo**: Developer, który chce szczegółów

**Co zawiera**:
- 10 kroków z screen-by-screen instrukcjami
- Wyjaśnienie każdego kroku
- Co oznacza każda opcja
- Pełny troubleshooting
- Linki do dokumentacji

**Kiedy czytać**: Gdy potrzebujesz szczegółowego wyjaśnienia każdego kroku

---

### `firebase-credentials-template.md` - Szablon credentials 📝
**Dla kogo**: Developer podczas konfiguracji

**Co zawiera**:
- Szablon do wypełnienia podczas konfiguracji Firebase
- Miejsce na zapisanie wszystkich kluczy API
- Gotowy plik `.env` do skopiowania
- Checklist wykonanych kroków

**Kiedy używać**: Podczas konfiguracji Firebase, aby nie zgubić żadnego klucza

---

### `firebase-commands-cheatsheet.md` - CLI Cheatsheet 🔧
**Dla kogo**: Developer pracujący z Firebase

**Co zawiera**:
- Wszystkie komendy Firebase CLI
- Przykłady użycia
- Komendy dla emulatorów
- Troubleshooting CLI
- Aliasy bash (opcjonalnie)

**Kiedy używać**: Jako ściągawka podczas developmentu

---

## 🎯 Workflow - Zalecana kolejność czytania

### Scenariusz 1: Nowy developer dołącza do projektu
```
1. prd.md                          (zrozumienie biznesu)
2. tech.md                         (zrozumienie architektury)
3. sceleton.md                     (zrozumienie struktury kodu)
4. firebase-quick-start.md         (setup środowiska)
5. firebase-commands-cheatsheet.md (praca z CLI)
```

### Scenariusz 2: Mam już projekt, chcę tylko Firebase
```
1. firebase-quick-start.md         (szybki setup)
2. firebase-credentials-template.md (zapisanie kluczy)
3. firebase-commands-cheatsheet.md (praca z CLI)
```

### Scenariusz 3: Mam problem z Firebase
```
1. firebase-setup-guide.md         (sekcja Troubleshooting)
2. firebase-commands-cheatsheet.md (sekcja Troubleshooting)
```

---

## 🛠️ Dodatkowe zasoby

### Gdzie znajdziesz kod projektu
```
dzwonek_app/
├── src/              → Kod frontend (React)
├── functions/        → Kod backend (Firebase Functions)
├── public/           → Statyczne zasoby (ikony PWA)
└── .ai/              → Dokumentacja (TEN KATALOG)
```

### Ważne pliki konfiguracyjne
```
.env                  → Klucze Firebase (NIE commituj!)
.firebaserc           → ID projektu Firebase
firebase.json         → Konfiguracja Firebase
package.json          → Zależności frontend
functions/package.json → Zależności backend
```

### Główne komendy
```bash
pnpm dev              # Uruchom frontend lokalnie
firebase emulators:start  # Uruchom backend lokalnie
firebase deploy       # Deploy do produkcji
```

---

## 📞 Pomoc

### Masz problem?
1. Sprawdź sekcję **Troubleshooting** w odpowiednim dokumencie
2. Sprawdź logi: `firebase functions:log`
3. Sprawdź Console przeglądarki (F12 → Console)
4. Sprawdź Firebase Console (https://console.firebase.google.com/)

### Przydatne linki
- Firebase Console: https://console.firebase.google.com/
- Firebase Docs: https://firebase.google.com/docs
- Vite Docs: https://vitejs.dev/
- React Docs: https://react.dev/

---

## 📊 Status dokumentacji

| Dokument | Status | Ostatnia aktualizacja |
|----------|--------|----------------------|
| prd.md | ✅ Kompletny | 2025-12-21 |
| tech.md | ✅ Kompletny | 2025-12-22 |
| sceleton.md | ✅ Kompletny | 2025-12-22 |
| firebase-quick-start.md | ✅ Kompletny | 2025-12-22 |
| firebase-setup-guide.md | ✅ Kompletny | 2025-12-22 |
| firebase-credentials-template.md | ✅ Kompletny | 2025-12-22 |
| firebase-commands-cheatsheet.md | ✅ Kompletny | 2025-12-22 |

---

**Projekt**: dzwonek_app
**Wersja**: 1.0
**Data utworzenia**: 2025-12-22
**Ostatnia aktualizacja**: 2025-12-22

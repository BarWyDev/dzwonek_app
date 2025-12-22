# Dokument Wymagań Produktowych (PRD) - Dzwonek APP (MVP)

| Wersja | Data | Status | Autor |
| --- | --- | --- | --- |
| 1.0 | 21.12.2025 | Zatwierdzony | AI Assistant / PM |

---

## 1. Wprowadzenie

### 1.1. Cel Projektu
Stworzenie prostej, mobilnej aplikacji typu PWA (Progressive Web App), która pomoże nauczycielom pamiętać o zbliżających się dyżurach na przerwach międzylekcyjnych. Aplikacja automatyzuje proces sprawdzania grafiku, wysyłając powiadomienie na 10 minut przed rozpoczęciem dyżuru.

### 1.2. Problem
Nauczyciele często zapominają o dyżurach na korytarzach lub w stołówce, ponieważ wymaga to ręcznego sprawdzania skomplikowanych harmonogramów w plikach Excel lub na tablicach ogłoszeń.

### 1.3. Zakres MVP (Minimum Viable Product)
Wersja MVP skupia się wyłącznie na **dyżurach** (ignorując lekcje) oraz obsłudze jednego, specyficznego formatu pliku Excel. Aplikacja jest darmowa i nie wymaga zakładania konta użytkownika (logowania hasłem).

---

## 2. Grupa Docelowa i Persony
*   **Główny użytkownik:** Nauczyciel w szkole podstawowej/średniej.
*   **Charakterystyka:** Korzysta głównie ze smartfona, ceni proste rozwiązania ("działa od razu"), potrzebuje niezawodnego przypomnienia w hałaśliwym środowisku szkolnym.

---

## 3. Historie Użytkownika (User Stories)

| ID | Jako... | Chcę... | Aby... |
| --- | --- | --- | --- |
| **US-1** | Nauczyciel | Wgrać plik Excel z planem dyżurów do aplikacji | Nie musieć ręcznie przepisywać dat i godzin. |
| **US-2** | Nauczyciel | Wybrać swoje nazwisko z listy | Aplikacja wiedziała, które dyżury są moje. |
| **US-3** | Nauczyciel | Otrzymać powiadomienie na telefon 10 minut przed dyżurem | Zdążyć dojść na wyznaczone miejsce (piętro/stołówka). |
| **US-4** | Nauczyciel | Widzieć na ekranie głównym odliczanie do najbliższego dyżuru | Szybko sprawdzić, ile mam czasu przerwy. |
| **US-5** | Nauczyciel | Korzystać z aplikacji bez dostępu do internetu (offline) | Móc sprawdzić plan w miejscach o słabym zasięgu (piwnice szkolne, grube mury). |

---

## 4. Wymagania Funkcjonalne

### 4.1. Import i Przetwarzanie Danych (Excel)
*   **FR-01:** System musi umożliwiać wgranie pliku `.xlsx` z lokalnego urządzenia użytkownika.
*   **FR-02:** System musi parsować "sztywny" układ wizualny dostarczonego szablonu Excela:
    *   Identyfikacja wierszy odpowiadających przerwom (godziny).
    *   Identyfikacja kolumn odpowiadających dniom tygodnia.
    *   Mapowanie lokalizacji: liczby (0, 1, 2) interpretowane jako piętra, "STO" jako Stołówka, "s.3,4" jako Sale gimnastyczne.
*   **FR-03:** Parser musi ignorować formatowanie kolorystyczne (np. czerwone czcionki).
*   **FR-04:** Parser musi obsługiwać komórki zawierające wielu nauczycieli (separator: przecinek, ukośnik lub nowa linia) i traktować ich jako osobne wpisy.
*   **FR-05:** Po przetworzeniu pliku, aplikacja generuje unikalną listę nazwisk (alfabetycznie) do wyboru przez użytkownika.

### 4.2. Konfiguracja i Personalizacja
*   **FR-06:** Użytkownik wybiera jedno nazwisko z listy (dropdown).
*   **FR-07:** Wybór jest zapamiętywany w pamięci urządzenia (LocalStorage). Aplikacja przy kolejnym uruchomieniu pomija ekran konfiguracji.
*   **FR-08:** Użytkownik ma możliwość zresetowania ustawień (przycisk "Wyczyść dane" / "Zmień nauczyciela"), co usuwa dane z LocalStorage i wyrejestrowuje token powiadomień.

### 4.3. Dashboard (Ekran Główny)
*   **FR-09:** Wyświetlanie aktualnej daty i godziny.
*   **FR-10:** Wyświetlanie licznika (Countdown) do najbliższego dyżuru.
*   **FR-11:** Wyświetlanie listy dyżurów na bieżący dzień w formacie: `Godzina | Lokalizacja`.
*   **FR-12:** Interfejs musi być responsywny (RWD), zoptymalizowany pod ekrany smartfonów.

### 4.4. Powiadomienia (Push Notifications)
*   **FR-13:** Aplikacja musi prosić o zgodę na wysyłanie powiadomień.
*   **FR-14:** System backendowy (Firebase) wysyła powiadomienie Push dokładnie **10 minut** przed rozpoczęciem każdego zidentyfikowanego dyżuru.
*   **FR-15:** Treść powiadomienia: *"Za 10 min: Dyżur [Lokalizacja]"*.
*   **FR-16:** Powiadomienia są cykliczne (tygodniowe) – powtarzają się co tydzień, aż do zmiany planu.
*   **FR-17:** Kliknięcie w powiadomienie otwiera aplikację.

### 4.5. Onboarding iOS
*   **FR-18:** Jeśli aplikacja wykryje system iOS i uruchomienie w przeglądarce (nie w trybie Standalone), musi wyświetlić instrukcję "Dodaj do ekranu głównego", aby umożliwić działanie powiadomień.

---

## 5. Wymagania Nie-Funkcjonalne (Techniczne)

### 5.1. Architektura
*   **Frontend:** PWA (HTML5, CSS3 - Tailwind/Material UI, JavaScript).
*   **Backend:** Firebase (Cloud Functions + Cloud Messaging + Firestore/Realtime DB). Backend służy **wyłącznie** do orkiestracji powiadomień Push (obejście ograniczeń iOS Safari).
*   **Hosting:** GitHub Pages, Vercel lub Netlify (wymagany HTTPS).

### 5.2. Dane i Prywatność
*   **LocalStorage:** Przechowuje pełny harmonogram dyżurów użytkownika do wyświetlania offline.
*   **Firebase DB:** Przechowuje parę: `{ FCM_Token, Harmonogram_Dyzurów (Dzień_Tygodnia, Godzina) }`. Nie przechowujemy danych osobowych (imion/nazwisk) w bazie, jedynie anonimowe identyfikatory powiązane z harmonogramem.
*   **RODO:** Checkbox zgody przy starcie: *"Zgadzam się na przetwarzanie mojego harmonogramu w celu realizacji powiadomień"*.

### 5.3. Wydajność i Dostępność
*   **Offline First:** Aplikacja (Dashboard) musi działać bez dostępu do internetu (z wykorzystaniem Service Worker). Wymagany dostęp do sieci tylko przy: pierwszym wgraniu pliku oraz odbieraniu powiadomień Push.
*   **Czas ładowania:** < 2 sekundy (Lighthouse Performance Score > 90).

---

## 6. Ograniczenia i Ryzyka
1.  **Sztywny Format Excela:** Aplikacja przestanie działać poprawnie, jeśli dyrekcja szkoły zmieni układ kolumn/wierszy w pliku Excel.
    *   *Mitygacja:* Komunikat błędu przy nieudanym parsowaniu.
2.  **Dostarczalność Pushy:** Systemy oszczędzania energii w telefonach (szczególnie chińskich producentów) mogą ubijać procesy tła.
    *   *Akceptacja:* W MVP akceptujemy skuteczność na poziomie standardu rynkowego Web Push.
3.  **Brak Kalendarza Świąt:** Aplikacja będzie wysyłać powiadomienia również w dni wolne od szkoły (np. Wielkanoc w poniedziałek).
    *   *Akceptacja:* Funkcja "Wycisz" lub kalendarz dni wolnych przesunięte do wersji v2.

---

## 7. Kryteria Sukcesu (KPI)
1.  Poprawne zaczytanie dyżurów z dostarczonego pliku testowego `Dyżury 2025-2026 (2).xlsx`.
2.  Skuteczne otrzymanie powiadomienia na zablokowanym telefonie (iOS i Android) w teście end-to-end.
3.  Czas konfiguracji (od wejścia na stronę do gotowości) poniżej 2 minut.


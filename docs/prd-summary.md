<conversation_summary>
<decisions>
1. **Model Biznesowy**: Aplikacja jest darmowa (przynajmniej w fazie MVP), brak płatnych subskrypcji.
2. **Platforma**: Aplikacja typu PWA (Progressive Web App), z naciskiem na działanie na urządzeniach mobilnych, ale dostępna przez przeglądarkę (również desktop).
3. **Funkcjonalność Główna**: Powiadamianie nauczycieli o dyżurach na przerwach na 10 minut przed ich rozpoczęciem. MVP skupia się wyłącznie na dyżurach (nie na lekcjach).
4. **Dane Wejściowe**: Import danych z pliku Excel (`Dyżury 2025-2026 (2).xlsx`) o stałym, specyficznym formacie (wizualny plan tygodniowy).
   - Kolumny/Wiersze kluczowe: Przerwa (godziny), Dni tygodnia, Lokalizacja (piętra/stołówka).
   - Obsługa wielu nauczycieli w jednej komórce (rozdzielanie po znakach).
   - Ignorowanie kolorów i formatowania wizualnego (np. czerwone nazwiska).
5. **Architektura**: 
   - Frontend: PWA (HTML/JS), framework CSS Tailwind lub Material UI.
   - Backend: Minimalny Backend (Firebase) wymagany do obsługi powiadomień Web Push (niezbędne dla iOS).
   - Przechowywanie danych: LocalStorage (na urządzeniu) do szybkiego dostępu, Firebase do kolejkowania powiadomień.
   - Hosting: GitHub Pages, Vercel lub Netlify.
6. **Powiadomienia**:
   - Technologia: Web Push API (z wsparciem Backend).
   - Czas: Sztywno 10 minut przed dyżurem.
   - Treść: Lokalizacja (Piętro/Sala), Czas.
   - Dźwięk: Systemowy domyślny.
7. **UX/UI**: 
   - Dashboard po konfiguracji: Zegar odliczający czas + harmonogram dnia.
   - Brak logowania (identyfikacja urządzenia).
   - Język: Polski (PL).
   - Tryb Offline: Wymagany (Service Worker).
8. **Cykl**: Harmonogram jest tygodniowy, powtarzalny cyklicznie. Brak uwzględniania świąt w MVP.
</decisions>

<matched_recommendations>
1. **Wdrożenie Minimalnego Backendu (Firebase)**: Ze względu na ograniczenia iOS Safari w obsłudze lokalnych powiadomień w tle, zaakceptowano konieczność użycia chmury do wyzwalania powiadomień Push.
2. **Sztywny Parser Excela**: Ze względu na skomplikowany układ wizualny pliku (scalane komórki, układ przestrzenny a nie bazodanowy), parser będzie "szyty na miarę" pod konkretny szablon, a nie uniwersalny.
3. **PWA & Offline First**: Aplikacja ma działać w szkole, gdzie zasięg może być słaby, więc kluczowe dane muszą być cachowane lokalnie.
4. **Dropdown przy wyborze nazwiska**: Aby uniknąć literówek, aplikacja najpierw przetworzy plik, a potem da użytkownikowi listę wykrytych nazwisk do wyboru.
5. **Prosty Dashboard**: Zamiast pustego ekranu, aplikacja ma pokazywać użyteczne informacje (odliczanie) od razu po uruchomieniu.
6. **Instrukcja "Add to Home Screen"**: Dla użytkowników iOS, kluczowe jest dodanie instrukcji, jak przypiąć PWA do ekranu, aby umożliwić odbieranie Pushy.
</matched_recommendations>

<prd_planning_summary>
### Główne Wymagania Funkcjonalne
- **Import Danych**: Użytkownik wgrywa plik `.xlsx`. System parsuje go po stronie klienta (lub przesyła do Cloud Function), ekstrahując macierz: [Dzień, Godzina, Lokalizacja, Nauczyciel].
- **Wybór Tożsamości**: Użytkownik wybiera swoje nazwisko z listy wygenerowanej na podstawie pliku.
- **Harmonogram**: System wyświetla czytelną listę dyżurów na dany dzień oraz tydzień.
- **System Powiadomień**: 
  - Rejestracja tokena urządzenia w Firebase FCM.
  - Cykliczne wysyłanie powiadomień Push 10 minut przed każdą zdefiniowaną przerwą dyżurową.
  - Treść powiadomienia zawiera lokalizację (dekodowanie skrótów: STO -> Stołówka, liczby -> Piętra).
- **Zarządzanie Stanem**: Możliwość resetu aplikacji (wyczyszczenia danych/zmiany nazwiska).

### Kluczowe Historie Użytkownika (User Stories)
1. **Pierwsze Uruchomienie**: Jako nauczyciel, chcę wgrać plan dyżurów i wybrać swoje nazwisko, aby aplikacja wiedziała, kiedy mam dyżur.
2. **Codzienne Użycie**: Jako nauczyciel, chcę rano zobaczyć listę moich dzisiejszych dyżurów, aby mentalnie zaplanować dzień.
3. **Powiadomienie**: Jako nauczyciel, chcę otrzymać powiadomienie na telefon 10 minut przed przerwą, abym zdążył dojść na wyznaczone piętro/stołówkę.
4. **Zmiana Planu**: Jako nauczyciel, chcę móc wgrać nowy plik Excel, gdy dyrekcja zmieni harmonogram, aby moje powiadomienia były aktualne.

### Kryteria Sukcesu (KPIs)
- **Skuteczność Parsowania**: 100% poprawności w odczytywaniu dyżurów z dostarczonego szablonu Excel (brak pominiętych dyżurów).
- **Dostarczalność Powiadomień**: Powiadomienia docierają na zablokowany ekran telefonu (Android/iOS) w >90% przypadków (przy założeniu dostępu do sieci).
- **Czas Konfiguracji**: Użytkownik jest w stanie skonfigurować aplikację (wgrać plik i wybrać nazwisko) w czasie poniżej 2 minut.

### Nierozwiązane Kwestie
- **Obsługa błędów parowania**: Co dokładnie ma się stać, jeśli parser napotka format, którego nie rozumie (np. ktoś doda nową kolumnę)? (Zalecenie: Wyświetlenie błędu i prośba o kontakt z administratorem/deweloperem).
- **Retencja Danych**: Jak długo przechowujemy tokeny i harmonogramy w Firebase dla nieaktywnych użytkowników? (Do ustalenia w fazie technicznej, np. usuwanie po 1 roku nieaktywności).
</prd_planning_summary>

<unresolved_issues>
Brak krytycznych nierozwiązanych kwestii blokujących powstanie PRD. Wszystkie kluczowe decyzje architektoniczne i funkcjonalne dla MVP zostały podjęte. Jedynie szczegóły implementacyjne parsera (dokładne mapowanie komórek) zostaną doprecyzowane przez dewelopera na podstawie dostarczonego pliku.
</unresolved_issues>
</conversation_summary>


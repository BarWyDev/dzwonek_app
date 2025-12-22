# Dokument wymagań produktu (PRD) – dzwonek_app

## 1. Przegląd produktu
Aplikacja dzwonek_app jest progresywną aplikacją webową (PWA) przeznaczoną dla nauczycieli szkół podstawowych i średnich. Celem produktu jest przypominanie nauczycielom o zbliżających się dyżurach na korytarzach lub w stołówce poprzez wysyłanie powiadomień push na urządzenia mobilne 10 minut przed rozpoczęciem dyżuru. MVP (Minimum Viable Product) koncentruje się wyłącznie na dyżurach i obsługuje jeden, z góry zdefiniowany szablon pliku Excel z planem tygodniowym.

## 2. Problem użytkownika
Nauczyciele muszą samodzielnie sprawdzać wielostronicowe harmonogramy, aby pamiętać o swoich dyżurach podczas przerw. Często prowadzi to do pomyłek i opóźnień, ponieważ:
- Harmonogramy są dostępne w niewygodnym formacie (wydruki lub skomplikowane pliki Excel).
- Przerwy bywają hałaśliwe, a nauczyciele skupieni na zajęciach łatwo tracą poczucie czasu.
- Brak systemowych przypomnień skutkuje nieobecnością na dyżurach i ryzykiem wypadków na korytarzu.

## 3. Wymagania funkcjonalne
1. Import pliku Excel (.xlsx) z tygodniowym planem dyżurów.
2. Sztywny parser wyodrębniający dane według szablonu (przerwa × dzień × lokalizacja × nauczyciel).
3. Generowanie listy unikalnych nazwisk z pliku i prezentacja w rozwijanym polu wyboru.
4. Zapisywanie wyboru nauczyciela oraz przetworzonego harmonogramu w LocalStorage.
5. Rejestracja tokena urządzenia w Firebase Cloud Messaging (FCM).
6. Backend (Firebase Functions) obliczający harmonogram i wysyłający powiadomienia push 10 minut przed każdym dyżurem.
7. Treść powiadomienia: „Za 10 min: dyżur [lokalizacja]”. Domyślny dźwięk systemowy.
8. Dashboard prezentujący:
   - aktualną datę i czas,
   - odliczanie do najbliższego dyżuru,
   - listę dzisiejszych dyżurów.
9. Możliwość zresetowania ustawień (ponowne wgranie pliku lub zmiana nauczyciela).
10. Obsługa offline (Service Worker cache) – pełna funkcjonalność dashboardu bez połączenia internetowego.
11. Instrukcja „Dodaj do ekranu głównego” wyświetlana na iOS Safari w trybie przeglądarkowym.
12. Responsywny interfejs zoptymalizowany pod urządzenia mobilne, zbudowany przy użyciu Tailwind CSS.

## 4. Granice produktu
- Aplikacja obsługuje wyłącznie dyżury; lekcje, zastępstwa i inne zdarzenia nie są adresowane w MVP.
- Wspierany jest jeden stały szablon Excela; modyfikacja struktury pliku wymaga aktualizacji parsera.
- Powiadomienia są wysyłane w każdy tydzień szkolny; święta i dni wolne nie są filtrowane.
- Brak rozbudowanego systemu logowania; identyfikacja odbywa się przez anonimowy token FCM.
- Brak płatnych funkcji ani subskrypcji w MVP.

## 5. Historyjki użytkowników
| ID | Tytuł | Opis | Kryteria akceptacji |
| --- | --- | --- | --- |
| US-001 | Wgranie planu | Jako nauczyciel chcę wgrać plik Excel ze swoim planem dyżurów, aby aplikacja mogła go przetworzyć. | • Plik .xlsx mogę wybrać z pamięci urządzenia. <br>• Po wgraniu otrzymuję komunikat o sukcesie lub błędzie parsowania. |
| US-002 | Wybór nazwiska | Jako nauczyciel chcę wybrać swoje nazwisko z listy, aby aplikacja wiedziała, które dyżury są moje. | • Lista zawiera wszystkie unikalne nazwiska znalezione w pliku. <br>• Wybór zostaje zapisany i przy ponownym otwarciu aplikacji jest automatycznie zastosowany. |
| US-003 | Podgląd harmonogramu | Jako nauczyciel chcę zobaczyć mój dzisiejszy harmonogram dyżurów, aby zaplanować dzień. | • Dashboard pokazuje wszystkie dyżury przypadające na bieżący dzień. <br>• Dane wyświetlają się poprawnie także w trybie offline. |
| US-004 | Powiadomienie o dyżurze | Jako nauczyciel chcę otrzymywać powiadomienie 10 minut przed dyżurem, abym zdążył pojawić się na miejscu. | • Powiadomienia przychodzą z właściwą treścią i o właściwym czasie (±1 min). <br>• Kliknięcie otwiera aplikację dzwonek_app. |
| US-005 | Reset danych | Jako nauczyciel chcę móc wyczyścić dane i ponownie skonfigurować aplikację, jeśli plan zostanie zmieniony. | • Dostępny jest przycisk „Wyczyść dane”. <br>• Po potwierdzeniu aplikacja usuwa harmonogram i prosi o ponowne wgranie pliku. |
| US-006 | Dodanie do ekranu głównego (iOS) | Jako nauczyciel korzystający z iPhone’a chcę dostać instrukcję dodania aplikacji do ekranu głównego, aby umożliwić działanie powiadomień. | • Przy pierwszej wizycie na iOS Safari pojawia się widoczny baner z instrukcją. |
| US-007 | Bezpieczne przesyłanie danych | Jako użytkownik chcę mieć pewność, że moje dane są przesyłane bezpiecznie, aby chronić prywatność. | • Wszystkie żądania sieciowe są wysyłane przez HTTPS. <br>• Token FCM i dane harmonogramu są przechowywane w Firebase z regułami bezpieczeństwa ograniczającymi dostęp do właściciela tokena. |

## 6. Metryki sukcesu
1. Co najmniej 95 % poprawnie sparsowanych dyżurów z przesłanego pliku testowego.
2. Powiadomienia push dostarczane w > 90 % przypadków (przy aktywnym połączeniu sieciowym).
3. Średni czas konfiguracji aplikacji (od wejścia na stronę do gotowości) < 2 min.
4. Lighthouse Performance Score ≥ 90 przy pierwszym ładowaniu.
5. Liczba zgłoszeń błędów parsowania Excela < 5 % wszystkich przesłanych plików.


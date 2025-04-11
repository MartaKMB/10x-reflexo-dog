# Dokument wymagań produktu (PRD) - DogOwnerWithReflexoSkills

## 1. Przegląd produktu
Aplikacja webowa wspierająca opiekunów psów w personalizacji zabiegów refleksoterapeutycznych poprzez:
- Interaktywne mapy punktów refleksologicznych dostosowane do indywidualnych potrzeb psów
- System śledzenia reakcji zwierząt na poszczególne techniki masażu
- Generowanie spersonalizowanych schematów zabiegów

Kluczowe komponenty techniczne:
- Frontend: React 19 + Astro 5
- Backend: Supabase (PostgreSQL)
- Hosting: DigitalOcean

## 2. Problem użytkownika
| Problem                          | Obecne rozwiązania              | Niedoskonałości                  |
|----------------------------------|----------------------------------|-----------------------------------|
| Brak personalizacji map          | Książki, PDF-y                  | Statyczne, nieedytowalne formaty |
| Trudność w śledzeniu postępów    | Notatniki papierowe             | Łatwe do zgubienia, brak analiz  |
| Ryzyko błędnej interpretacji     | Filmy instruktażowe             | Brak interaktywnej weryfikacji   |

## 3. Wymagania funkcjonalne
### Podstawowe funkcje
1. **Przeglądarka map refleksologicznych**
   - 37 punktów w 3 warstwach (układy: mięśniowo-szkieletowy, pokarmowy, nerwowy)
   - Tryb porównawczy: standardowa vs spersonalizowana mapa

2. **System profilów**
   - 5 obligatoryjnych pól: rasa, wiek, waga, alergie, historia chorób
   - Dzienniki zabiegów z możliwością eksportu PDF

3. **Generator schematów**
   - Algorytm sugestii oparty na historii zabiegów
   - 3 predefiniowane szablony dla początkujących

### Bezpieczeństwo
- Autentykacja 2FA dla kont z >5 zapisanymi schematami
- Szyfrowanie AES-256 dla danych medycznych

## 4. Granice produktu
### W zakresie MVP
- Obsługa tylko psów powyżej 1 roku życia
- Limit 3 profili psów na konto
- Brak integracji z systemami zewnętrznymi

### Poza zakresem
- Funkcje społecznościowe
- Wsparcie dla innych zwierząt
- Aplikacja mobilna

## 5. Historyjki użytkowników

### US-001: Przeglądanie map refleksologicznych
**Opis:** Jako opiekun psa chcę przeglądać interaktywne mapy, aby zlokalizować odpowiednie punkty masażu  
**Kryteria akceptacji:**  
1. Wyświetlanie mapy SVG z możliwością powiększania (100%-200%)  
2. Filtrowanie punktów według układów anatomicznych  
3. Podświetlanie punktów przy hover (opóźnienie <100ms)

### US-002: Tworzenie profilu psa
**Opis:** Jako użytkownik chcę wprowadzić dane mojego psa, aby otrzymywać spersonalizowane sugestie  
**Kryteria akceptacji:**  
1. Formularz z walidacją: wiek (1-19), waga (2-100kg)  
2. Pole "historia chorób" z autouzupełnianiem 20 najczęstszych schorzeń  
3. Automatyczne wykrywanie sprzeczności w danych (np. rasa vs typowa waga)

### US-003: Zapisywanie sesji zabiegowej
**Opis:** Jako użytkownik chcę zapisać szczegóły zabiegu, aby śledzić postępy  
**Kryteria akceptacji:**  
1. Wybór 3-7 punktów na mapie  
2. Ocena reakcji psa w skali 1-5  
3. Automatyczne tagowanie sesji według układów anatomicznych

### US-004: Bezpieczne uwierzytelnianie
**Opis:** Jako użytkownik chcę mieć pewność, że dane mojego psa są bezpieczne  
**Kryteria akceptacji:**  
1. Wymaganie hasła o złożoności 8+ znaków  
2. Automatyczne wylogowanie po 25 minutach bezczynności  
3. Szyfrowanie end-to-end danych profilowych

### US-005: Generowanie schematów
**Opis:** Jako użytkownik chcę otrzymywać sugerowane schematy zabiegów  
**Kryteria akceptacji:**  
1. Generowanie 3 alternatywnych schematów dziennie  
2. Ostrzeżenia dla punktów przeciwwskazanych przy schorzeniach

## 6. Metryki sukcesu
| Wskaźnik                     | Cel  | Metoda pomiaru                     |
|------------------------------|------|-------------------------------------|
| Wypełnione profile           | 90%  | Analiza kompletności 5 pól obowiązkowych |
| Aktywne schematy tygodniowo  | 75%  | Liczba użytkowników z ≥1 zapisanym schematem |
| Retencja 30-dniowa           | 40%  | Średnia liczba logowań na użytkownika |
| Błędy danych medycznych      | <2%  | Monitorowanie błędów walidacji formularzy |

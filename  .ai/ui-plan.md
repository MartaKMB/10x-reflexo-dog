# Architektura UI dla DogOwnerWithReflexoSkills

## 1. Przegląd struktury UI

Aplikacja składa się z trzech głównych sekcji:
- Profil użytkownika i ustawienia
- System map refleksologicznych
- Profil psa z historią zabiegów

Interfejs jest zoptymalizowany pod urządzenia mobilne, z responsywnym designem i intuicyjną nawigacją. Główny nacisk położony jest na łatwą interakcję z mapami refleksologicznymi i zarządzanie profilami psów.

## 2. Lista widoków

### Profil użytkownika
- **Ścieżka**: `/profile`
- **Cel**: Zarządzanie ustawieniami konta i preferencjami użytkownika
- **Informacje**:
  - Dane użytkownika
  - Ustawienia bezpieczeństwa
  - Preferencje aplikacji
- **Komponenty**:
  - Formularz edycji profilu
  - Panel ustawień
  - Sekcja bezpieczeństwa
- **UX/Dostępność**:
  - Walidacja formularzy
  - Potwierdzenia zmian
  - Wsparcie dla czytników ekranu

### Mapy refleksologiczne
- **Ścieżka**: `/maps`
- **Cel**: Przeglądanie i interakcja z mapami punktów refleksologicznych
- **Informacje**:
  - Lista dostępnych układów
  - Interaktywna mapa SVG
  - Lista punktów
- **Komponenty**:
  - Grid układów anatomicznych
  - Interaktywna mapa SVG
  - Lista punktów z rozwijanymi szczegółami
  - System oceny punktów
- **UX/Dostępność**:
  - Responsywna mapa
  - Intuicyjne interakcje
  - Alternatywne widoki (lista/mapa)

### Własna mapa
- **Ścieżka**: `/maps/custom`
- **Cel**: Zarządzanie własną mapą punktów
- **Informacje**:
  - Wybrane punkty
  - Oceny punktów
  - Historia modyfikacji
- **Komponenty**:
  - Interaktywna mapa
  - Lista wybranych punktów
  - Panel edycji
- **UX/Dostępność**:
  - Łatwe dodawanie/usuwanie punktów
  - Podgląd zmian
  - Potwierdzenia akcji

### Profil psa
- **Ścieżka**: `/dog-profile`
- **Cel**: Zarządzanie profilem psa i historią zabiegów
- **Informacje**:
  - Dane psa
  - Historia zabiegów
  - Postępy w terapii
- **Komponenty**:
  - Formularz profilu
  - Timeline zabiegów
  - Statystyki postępów
- **UX/Dostępność**:
  - Walidacja danych
  - Filtrowanie historii
  - Wizualizacja postępów

## 3. Mapa podróży użytkownika

1. **Pierwsze wejście**
   - Logowanie/rejestracja
   - Przejście do profilu użytkownika
   - Utworzenie profilu psa

2. **Przeglądanie map**
   - Wybór układu anatomicznego
   - Interakcja z mapą/listą punktów
   - Ocena i dodawanie punktów do własnej mapy

3. **Zarządzanie własną mapą**
   - Przegląd wybranych punktów
   - Modyfikacja ocen

4. **Śledzenie postępów**
   - Przegląd historii zabiegów
   - Analiza skuteczności punktów

## 4. Układ i struktura nawigacji

### Główna nawigacja
- Pasek górny z logo i menu
- Menu boczne na desktop
- Menu hamburger na mobile

### Struktura nawigacji
```
/                   # Strona główna
├── /profile        # Profil użytkownika
├── /maps           # Mapy refleksologiczne
│   ├── /maps/[id]  # Konkretny układ
│   └── /maps/custom # Własna mapa
└── /dog-profile    # Profil psa
```

## 5. Kluczowe komponenty

### Interaktywna mapa SVG
- Bazowa grafika głowy psa
- System punktów z interakcją
- Popup z opcjami
- Responsywność

### System oceny punktów
- Skala 0-5 gwiazdek
- Opcjonalna ocena
- Historia ocen

### Lista punktów
- Rozwijane szczegóły
- Filtrowanie
- Sortowanie

### Timeline zabiegów
- Chronologiczny widok
- Filtry i wyszukiwanie
- Szczegóły zabiegów

### Formularze
- Walidacja w czasie rzeczywistym
- Obsługa błędów
- Potwierdzenia akcji 

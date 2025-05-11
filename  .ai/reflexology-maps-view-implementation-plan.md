# Plan implementacji widoku Mapy Refleksologiczne

## 1. Przegląd
Widok map refleksologicznych umożliwia przeglądanie i interakcję z mapami punktów refleksologicznych psów. Zawiera 37 punktów w 3 warstwach anatomicznych (układ mięśniowo-szkieletowy, pokarmowy i nerwowy). Widok oferuje interaktywną mapę SVG z możliwością filtrowania punktów, podświetlania przy najechaniu oraz alternatywny widok listy.

## 2. Routing widoku
- Ścieżka: `/maps`
- Parametry URL:
  - `?layer=musculoskeletal|digestive|nervous`
  - `?view=map|list`
  - `?zoom=100|150|200`

## 3. Struktura komponentów
```
ReflexologyMapView (Container)
├── FilterControls (Filtry warstw)
├── ViewToggle (Przełącznik widoku)
├── MapGrid (Kontener układu)
│   ├── InteractiveSVGMap (Mapa SVG)
│   │   └── PointMarker (Punkt na mapie)
│   └── PointList (Lista punktów)
└── PointDetails (Szczegóły punktu)
```

## 4. Szczegóły komponentów

### ReflexologyMapView
- Opis: Główny kontener widoku, zarządza stanem i integracją API
- Główne elementy: 
  - Kontener z Tailwind Grid
  - Komponenty dzieci z sekcji 3
- Obsługiwane interakcje:
  - Zmiana widoku (mapa/lista)
  - Filtrowanie punktów
  - Zarządzanie stanem aplikacji
- Obsługiwana walidacja:
  - Walidacja parametrów URL
  - Walidacja stanu filtrowania
- Typy:
  - ReflexologyPointDTO[]
  - MapViewState
- Propsy: brak (komponent główny)

### FilterControls
- Opis: Panel kontrolny z filtrami warstw anatomicznych
- Główne elementy:
  - Grupa przycisków radio
  - Etykiety warstw
- Obsługiwane interakcje:
  - Wybór warstwy
  - Reset filtrów
- Obsługiwana walidacja:
  - Sprawdzanie dostępności warstw
- Typy:
  - AnatomicalLayer
  - FilterState
- Propsy:
  - selectedLayer: string
  - onLayerChange: (layer: string) => void

### InteractiveSVGMap
- Opis: Interaktywna mapa SVG z punktami refleksologicznymi
- Główne elementy:
  - SVG container
  - Grupa punktów
  - Kontrolki zoomu
- Obsługiwane interakcje:
  - Zoom (100-200%)
  - Hover na punktach
  - Kliknięcie punktu
- Obsługiwana walidacja:
  - Walidacja współrzędnych punktów
  - Sprawdzanie granic zoomu
- Typy:
  - SVGPoint[]
  - ZoomLevel
- Propsy:
  - points: ReflexologyPointDTO[]
  - zoom: number
  - onPointSelect: (point: ReflexologyPointDTO) => void

### PointList
- Opis: Alternatywny widok listy punktów
- Główne elementy:
  - Lista z Tailwind
  - Karty punktów
- Obsługiwane interakcje:
  - Rozwijanie szczegółów
  - Filtrowanie
  - Sortowanie
- Obsługiwana walidacja:
  - Walidacja danych punktów
- Typy:
  - PointListItem
- Propsy:
  - points: ReflexologyPointDTO[]
  - onPointSelect: (point: ReflexologyPointDTO) => void

## 5. Typy

### MapViewState
```typescript
interface MapViewState {
  selectedLayer: "musculoskeletal" | "digestive" | "nervous" | null;
  viewMode: "map" | "list";
  zoomLevel: 100 | 150 | 200;
  selectedPoint: ReflexologyPointDTO | null;
  filterState: FilterState;
}
```

### FilterState
```typescript
interface FilterState {
  layers: string[];
  searchQuery: string;
  sortBy: "name" | "system";
}
```

### PointInteractionState
```typescript
interface PointInteractionState {
  hoveredPoint: string | null;
  selectedPoint: string | null;
  tooltipPosition: { x: number; y: number };
}
```

## 6. Zarządzanie stanem
- Custom hook: `useReflexologyMap`
  - Zarządzanie stanem widoku
  - Integracja z API
  - Obsługa filtrów
  - Synchronizacja z URL

## 7. Integracja API
- Endpoint: GET /api/v1/points
  - Parametry:
    - layer: string
    - page: number
    - limit: number
  - Odpowiedź: ApiListResponse<ReflexologyPointDTO>
- Endpoint: GET /api/v1/schemas
  - Parametry: brak
  - Odpowiedź: UserSchemaDTO[]

## 8. Interakcje użytkownika
1. Filtrowanie punktów:
   - Wybór warstwy anatomicznej
   - Reset filtrów
2. Interakcja z mapą:
   - Zoom (100-200%)
   - Hover na punktach (<100ms)
   - Kliknięcie punktu
3. Przełączanie widoku:
   - Mapa/Lista
4. Przeglądanie listy:
   - Sortowanie
   - Filtrowanie
   - Rozwijanie szczegółów

## 9. Warunki i walidacja
1. Walidacja parametrów URL:
   - Poprawność warstwy
   - Poprawność poziomu zoomu
2. Walidacja stanu:
   - Spójność filtrów
   - Poprawność wybranego punktu
3. Walidacja API:
   - Paginacja
   - Filtry
   - Autentykacja

## 10. Obsługa błędów
1. Błędy API:
   - Wyświetlanie komunikatu błędu
   - Możliwość ponowienia żądania
2. Błędy walidacji:
   - Walidacja formularzy
   - Komunikaty błędów
3. Błędy SVG:
   - Fallback do listy
   - Komunikat o problemie

## 11. Kroki implementacji
1. Przygotowanie struktury projektu:
   - Utworzenie komponentów
   - Konfiguracja routingu
   - Przygotowanie typów

2. Implementacja podstawowych komponentów:
   - ReflexologyMapView
   - FilterControls
   - ViewToggle

3. Implementacja mapy SVG:
   - Kontener SVG
   - Punkty interaktywne
   - Kontrolki zoomu

4. Implementacja listy punktów:
   - Widok listy
   - Filtrowanie
   - Sortowanie

5. Integracja z API:
   - Implementacja hooków
   - Obsługa paginacji
   - Obsługa błędów

6. Implementacja interakcji:
   - Hover
   - Kliknięcia
   - Filtrowanie

7. Testy i optymalizacja:
   - Testy jednostkowe
   - Testy wydajności
   - Optymalizacja SVG

8. Dokumentacja:
   - Dokumentacja komponentów
   - Przykłady użycia
   - Instrukcje wdrożenia 

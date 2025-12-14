# Bug Tracker (Django REST + React)

Prosty bug tracker pokazujący pełny przepływ CRUD dla projektów i zgłoszeń. Backend opiera się na Django REST Framework z JWT, a frontend na React + Vite.

## Stos technologiczny
- **Backend:** Django 5, Django REST Framework, Simple JWT, django-filter, PostgreSQL
- **Frontend:** React 18 (Vite), fetch API
- **DevOps:** Docker Compose (Python + Postgres), CORS dla `http://localhost:5173`

## Wymagania wstępne
- Docker i Docker Compose (zalecane) **lub** Python 3.12 + Node.js 18 / npm 9 lokalnie

## Konfiguracja środowiska (`.env`)
Utwórz plik `.env` w katalogu głównym repo (wykorzystywany przez Docker Compose i backend):

```env
# Postgres
POSTGRES_DB=bugtracker
POSTGRES_USER=bugtracker
POSTGRES_PASSWORD=bugtracker
POSTGRES_HOST=db            # dla Dockera; lokalnie: localhost
POSTGRES_PORT=5432

# Django
DJANGO_SECRET_KEY=changeme
DJANGO_DEBUG=1
DJANGO_ALLOWED_HOSTS=localhost 127.0.0.1
```

Frontend domyślnie kieruje żądania na `http://localhost:8000`; można to nadpisać zmienną `VITE_API_URL` w `frontend/.env`.

## Uruchomienie w Dockerze (zalecane)
1. Zbuduj i uruchom kontenery:
   ```bash
   docker-compose up --build
   ```
2. Wykonaj migracje po starcie (w innym terminalu):
   ```bash
   docker-compose exec web python manage.py migrate
   ```
3. Utwórz użytkownika (np. do logowania w SPA):
   ```bash
   docker-compose exec web python manage.py createsuperuser
   ```
4. Backend będzie dostępny pod `http://localhost:8000`, Postgres na `localhost:5432`.

## Uruchomienie lokalne (bez Dockera)
### Backend
1. Zainstaluj zależności:
   ```bash
   cd backend
   python -m venv .venv && source .venv/bin/activate
   pip install -r requirements.txt
   ```
2. Ustaw zmienne środowiskowe z sekcji `.env` (Postgres musi działać lokalnie).
3. Uruchom migracje i serwer:
   ```bash
   python manage.py migrate
   python manage.py runserver 0.0.0.0:8000
   ```

### Frontend
1. Zainstaluj zależności:
   ```bash
   cd frontend
   npm install
   ```
2. (Opcjonalnie) dodaj `VITE_API_URL=http://localhost:8000` do `frontend/.env`.
3. Uruchom aplikację developerską:
   ```bash
   npm run dev
   ```
   Domyślnie dostępne pod `http://localhost:5173`.

## Funkcjonalności
- Logowanie przy użyciu JWT (`/api/token/`, `/api/token/refresh/`).
- CRUD projektów (`/api/projects/`) z automatycznym przypisaniem właściciela.
- CRUD zgłoszeń (`/api/issues/`) z filtrowaniem po projekcie/statusie, wyszukiwaniem w tytule/opisie i sortowaniem.
- Frontend umożliwia logowanie, listę zgłoszeń, zmianę statusu i tworzenie nowych issue.

## Struktura kluczowych katalogów
- `backend/` – projekt Django (`config/`) i aplikacja `tracker/` z modelami, serializerami oraz widokami DRF.
- `frontend/` – aplikacja React (Vite) z prostym klientem API i widokiem issue.
- `docker-compose.yml` – definiuje kontenery dla Postgresa i backendu.

## Przydatne komendy
- Panel admina: `http://localhost:8000/admin/`
- Odświeżenie tokenu: `POST /api/token/refresh/`
- Uruchomienie testów (brak zdefiniowanych) lub migracji: `python manage.py migrate`


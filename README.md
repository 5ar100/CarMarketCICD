# CarMarket

A full-stack web application for buying and selling cars, built with Django REST Framework and React.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router, Axios |
| Backend | Django 4.2, Django REST Framework, SimpleJWT |
| Database | PostgreSQL 16 |
| Web server | nginx (frontend), gunicorn (backend) |
| Containerization | Docker, Docker Compose |
| CI/CD | GitHub Actions → DockerHub |

## Services

| Service | Port | Description |
|---|---|---|
| frontend | 3000 | React app served via nginx |
| backend | 8000 | Django REST API |
| db | 5432 | PostgreSQL database |

## Running the Application

### Prerequisites
- Docker Desktop installed and running

### Start

```bash
docker compose up --build
```

| URL | Description |
|---|---|
| http://localhost:3000 | Frontend |
| http://localhost:8000/api | REST API |
| http://localhost:8000/admin | Django Admin |

### Stop

```bash
docker compose down
```

To also delete all data (database + uploaded images):

```bash
docker compose down -v
```

## CI/CD Pipeline

Every push to `master` automatically triggers a GitHub Actions pipeline that:

1. Builds the backend Docker image → pushes to `petar100/carmarket-backend:latest`
2. Builds the frontend Docker image → pushes to `petar100/carmarket-frontend:latest`

### DockerHub Images

- `petar100/carmarket-backend`
- `petar100/carmarket-frontend`

## Features

- Browse car listings without an account
- Register / login with JWT authentication
- Create, edit and delete your own car listings
- Upload multiple images per listing
- Filter listings by fuel type, transmission, price and year
- Django admin panel for content management

## Project Structure

```
CICD_project/
├── backend/                  # Django project
│   ├── carmarket/            # Project settings and URLs
│   ├── cars/                 # Cars app (models, views, serializers)
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/                 # React project
│   ├── src/
│   │   ├── pages/            # Page components
│   │   ├── components/       # Shared components
│   │   ├── context/          # Auth context
│   │   └── api/              # Axios configuration
│   ├── Dockerfile
│   └── nginx.conf
├── .github/
│   └── workflows/
│       └── ci.yml            # GitHub Actions pipeline
└── docker-compose.yml
```

## Environment Variables

The backend reads the following environment variables (set via `docker-compose.yml`):

| Variable | Default | Description |
|---|---|---|
| `DB_HOST` | `127.0.0.1` | PostgreSQL host |
| `DB_NAME` | `carmarket_db` | Database name |
| `DB_USER` | `carmarket_user` | Database user |
| `DB_PASSWORD` | `carmarket_pass` | Database password |
| `DB_PORT` | `5432` | Database port |
| `SECRET_KEY` | dev default | Django secret key |

## Author

Petar Stojanovski

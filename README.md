# Digitalna galerija

Ovo je studentski full-stack projekat pod nazivom **Digitalna galerija**.
Aplikacija omogućava pregled i upravljanje umetničkim delima kroz web interfejs.

## 1. Kratak opis aplikacije
Digitalna galerija je jednostavna aplikacija za čuvanje, pregled i pretragu umetničkih dela.
Frontend je urađen u React-u (koristeći Vite), dok backend koristi Laravel i MySQL bazu podataka.

## 2. Spisak tehnologija
- **Frontend:** React, Vite, TypeScript (opciono)
- **Backend:** Laravel (PHP)
- **Baza podataka:** MySQL
- **Kontejnerizacija:** Docker, Docker Compose

## 3. Struktura projekta
Projekat je podeljen na dve glavne mape:

```
frontend/   # React + Vite aplikacija
backend/    # Laravel aplikacija
```

Takođe postoji `docker-compose.yml` fajl u korenu koji podiže oba servisa i bazu.

## 4. Preduslovi
Pre nego što počnete, potrebno je da imate instalirane:

- Docker
- Docker Compose (u novijim verzijama Docker-a ove komande su spojene)

## 5. Pokretanje aplikacije
1. U glavnom direktorijumu pokrenite:
   ```bash
   docker compose up -d
   ```
2. Sačekajte da se kontejneri podignu.
3. Uđite u Laravel kontejner (npr. `backend`):
   ```bash
   docker compose exec backend bash
   ```
4. Pokrenite migracije i seed:
   ```bash
   php artisan migrate:fresh --seed
   ```
5. Izađite iz kontejnera (`exit`).

## 6. Linkovi
- Frontend će biti dostupan na: http://localhost:5173
- Backend API će raditi na: http://localhost:8000

## 7. Gašenje aplikacije
Kada završite sa radom, možete zaustaviti i ukloniti kontejnere komandom:

```bash
docker compose down
```

> Ovo je studentska verzija README-a, napravljena jednostavno bez naprednih produkcionih podešavanja. Srećan rad! 😊

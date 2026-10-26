# Backend API (Express + PostgreSQL)

## Installation

```bash
cd server
npm install
```

## Configuration

Copier `.env.example` vers `.env` et renseigner :

- `PORT` : port du serveur (défaut 3001)
- `DATABASE_URL` : connexion PostgreSQL, ex. `postgresql://postgres:motdepasse@localhost:5432/hospital_stats`

## Créer la base et les tables

Voir le dossier `database/` à la racine du projet : exécuter `database/schema.sql` sur la base `hospital_stats`.

## Démarrer le serveur

À la racine du projet :

```bash
npm run server
```

Ou en mode développement (redémarrage auto) :

```bash
npm run server:dev
```

## Endpoints

- `GET /api/health` — santé du serveur
- `POST /api/accouchements` — enregistrer un accouchement (formulaire)
- `GET /api/accouchements` — liste des accouchements
- `POST /api/rapports` — enregistrer un rapport (après import)
- `GET /api/rapports` — liste des rapports

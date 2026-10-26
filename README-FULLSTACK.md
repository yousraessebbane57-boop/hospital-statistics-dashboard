# Système de Gestion Maternité – CHU (Full-Stack)

Application complète : **React** (frontend) + **Node.js / Express / MongoDB** (backend).

## Structure

- **backend/** – API Express
  - `config/db.js` – Connexion MongoDB
  - `models/BirthRecord.js` – Modèle dossier d’accouchement
  - `controllers/birthRecordController.js` – CRUD + statistiques dashboard
  - `routes/birthRecordRoutes.js` – Routes API
- **src/** – Frontend React (Vite, Tailwind, Recharts)
  - **Espace personnel** (`/staff`) : formulaire détaillé, liste, recherche, modification, statistiques personnelles
  - **Dashboard admin** (`/admin`) : KPIs et graphiques en temps réel depuis MongoDB

## Prérequis

- Node.js 18+
- MongoDB (local ou Atlas)

## Démarrage

### 1. MongoDB

Démarrer MongoDB localement ou utiliser une URI Atlas.

### 2. Backend

```bash
cd backend
cp .env.example .env
# Éditer .env : MONGODB_URI, PORT (optionnel, défaut 5000)
npm install
npm run dev
```

L’API est disponible sur `http://localhost:5000`.

### 3. Frontend

À la racine du projet (où se trouve `package.json` du frontend) :

```bash
cp .env.example .env
# Optionnel : VITE_API_URL=http://localhost:5000/api (défaut déjà)
npm install
npm run dev
```

Ouvrir l’URL affichée (souvent `http://localhost:5173`).

## Flux

1. **Personnel** : Connexion Personnel → formulaire (nom mère, âge, dates, type d’accouchement, complications, bébé, personnel responsable) → enregistrement envoyé à l’API → sauvegarde en base.
2. **Base de données** : MongoDB stocke tous les dossiers.
3. **Admin** : Le dashboard appelle `GET /api/birth-records/stats/dashboard?from=...&to=...` et affiche KPIs + graphiques (naissances mensuelles, types d’accouchement, garçons/filles, occupation lits, activité du personnel).

## API (backend)

- `POST /api/birth-records` – Créer un dossier
- `GET /api/birth-records` – Liste (query : `search`, `page`, `limit`, `personnel`)
- `GET /api/birth-records/stats/dashboard` – Statistiques (query : `from`, `to`)
- `GET /api/birth-records/:id` – Détail
- `PUT /api/birth-records/:id` – Modifier

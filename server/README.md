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

Pour créer également les tables de gestion admin/personnel avec Prisma :

```bash
cd server
npm run db:generate
npm run db:push
```

Renseigner aussi `JWT_SECRET` (au moins 32 caractères aléatoires), `FRONTEND_URL`,
`ADMIN_NAME`, `ADMIN_EMAIL` et un `ADMIN_PASSWORD` d’au moins 12 caractères dans
`server/.env` (copier `server/.env.example` sans commiter le fichier `.env`). Créer le compte super-admin initial avec :

```bash
npm run db:seed
```

Ne partagez pas le fichier `.env` et ne commitez pas ses secrets.

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
- `POST /api/admin/auth/login` — connexion admin (session JWT dans cookie HTTP-only)
- `POST /api/admin/auth/logout` — fermeture de session
- `GET /api/admin/dashboard` — statistiques de la plateforme (admin connecté)
- `/api/admin/personnel` — gestion des comptes personnel (admin connecté)
- `/api/admin/administrators` — gestion des admins (super-admin uniquement)

L’espace admin se trouve sur `/admin/login`. Les comptes du personnel ne peuvent
pas ouvrir l’espace admin. Les appels API admin sont protégés côté serveur et
les connexions sont limitées contre les tentatives répétées.

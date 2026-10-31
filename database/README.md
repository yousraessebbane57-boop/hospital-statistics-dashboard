# Base de données PostgreSQL

## 1. Créer la base

```bash
# Avec psql
createdb -U postgres hospital_stats

# Ou dans psql
CREATE DATABASE hospital_stats;
```

## 2. Appliquer le schéma

```bash
psql -U postgres -d hospital_stats -f database/schema.sql
```

Sous Windows (PowerShell) :

```powershell
psql -U postgres -d hospital_stats -f database/schema.sql
```

## 3. Tables créées

- **users** : comptes de connexion du personnel et des administrateurs, avec leurs rôles et leur état d'activation.
- **accouchements** : enregistrements du formulaire d'accouchement (mère, bébé, responsables).
- **rapports** : rapports statistiques générés (imports de fichiers CSV/Excel).

## 4. URL de connexion

Format : `postgresql://utilisateur:motdepasse@localhost:5432/hospital_stats`

Exemple pour l'environnement (fichier `server/.env`) :

```
DATABASE_URL=postgresql://postgres:VotreMotDePasse@localhost:5432/hospital_stats
PORT=3001
```

## 5. Créer le compte de connexion initial

Après l'application de `schema.sql`, synchroniser Prisma puis créer le compte
super-administrateur avec les variables `ADMIN_NAME`, `ADMIN_EMAIL` et
`ADMIN_PASSWORD` définies dans `server/.env` :

```powershell
cd server
npm run db:generate
npm run db:push
npm run db:seed
```

Le mot de passe n'est jamais enregistré en clair : le script de seed le
transforme en hash bcrypt avant de l'insérer dans `users.password_hash`.

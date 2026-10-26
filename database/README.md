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

- **accouchements** : enregistrements du formulaire d'accouchement (mère, bébé, responsables).
- **rapports** : rapports statistiques générés (imports de fichiers CSV/Excel).

## 4. URL de connexion

Format : `postgresql://utilisateur:motdepasse@localhost:5432/hospital_stats`

Exemple pour l'environnement (fichier `server/.env`) :

```
DATABASE_URL=postgresql://postgres:VotreMotDePasse@localhost:5432/hospital_stats
PORT=3001
```

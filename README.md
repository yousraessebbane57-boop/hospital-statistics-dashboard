
# Gestion des analyses et statistiques hospitalières

Plateforme web sécurisée destinée aux établissements hospitaliers pour la saisie, la centralisation et l’analyse des données statistiques médicales, notamment les données liées aux accouchements et à l’activité hospitalière globale.

##  Objectifs

- Faciliter la **saisie** des données via formulaires web ou import de fichiers.
- Centraliser les informations dans une base de données robuste et fiable.
- Générer automatiquement des **indicateurs** et **diagrammes dynamiques** par période (année, mois, plage personnalisée).
- Offrir un **tableau de bord interactif** pour la direction hospitalière afin de suivre l’évolution des activités et analyser les tendances.
- Garantir la **sécurité**, la **confidentialité** et l’**intégrité** des données (authentification, autorisations, audit des actions).

##  Architecture technique (prévue)

- **Frontend** : React (TypeScript) avec un tableau de bord (cartes d’indicateurs, graphiques, filtres par période).
- **Backend** : Node.js / Express avec API REST sécurisée.
- **Base de données** : PostgreSQL (ou autre SGBD SQL) pour stocker les données médicales statistiques.
- **ORM** : Prisma ou équivalent pour modéliser les entités (accouchements, activités, utilisateurs, rôles).
- **Authentification** : JWT ou session, avec rôles (admin, direction, service, saisie).
- **Import de données** : Upload de fichiers (CSV / Excel) issus des systèmes existants.

> Cette architecture suit les bonnes pratiques pour les outils d’analyse de données dans le domaine de la santé en combinant un frontend moderne, un backend Node/Express et une base de données SQL.[web:14]

##  Structure du projet

```text
backend/   # API, logique métier, accès base de données
frontend/  # Interface utilisateur et tableau de bord
docs/      # Spécifications fonctionnelles et techniques

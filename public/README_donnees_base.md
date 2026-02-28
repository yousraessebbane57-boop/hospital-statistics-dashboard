# Fichier de base de données — Accouchements

## Fichier

- **`donnees_base_accouchement.csv`** : données d’exemple pour les accouchements (15 enregistrements).

## Format

- **Séparateur** : point-virgule (`;`)
- **Encodage** : UTF-8
- **Colonnes** :
  - `patientId` — Identifiant patient
  - `cin` — CIN
  - `age` — Âge de la mère
  - `admissionDate` — Date/heure d’admission
  - `deliveryDate` — Date/heure d’accouchement
  - `deliveryType` — `normal` ou `cesarean`
  - `laborDuration` — Durée du travail (ex. 6h30, 3h50)
  - `complications` — `oui` ou `non`
  - `complicationsDescription` — Description si complications
  - `babySex` — `M` ou `F`
  - `babyWeightG` — Poids du bébé en grammes
  - `apgar1` — Score Apgar à 1 min (0–10)
  - `apgar5` — Score Apgar à 5 min (0–10)
  - `responsibleDoctor` — Médecin responsable
  - `responsibleStaff` — Personnel responsable

## Utilisation

- **Référence** : structure et exemples pour saisies ou imports.
- **Import** : dans l’application, page « Importer des données », vous pouvez sélectionner ce fichier (ou une copie en `.xlsx`). L’import actuel est simulé (pas de parsing réel du CSV).
- **Téléchargement** : en dev, le fichier est disponible à l’URL : `http://localhost:5173/donnees_base_accouchement.csv`

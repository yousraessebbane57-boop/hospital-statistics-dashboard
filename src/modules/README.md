# Structure Modules - Personnel

## Organisation

L'interface personnel est maintenant centralisée dans `src/modules/personnel/` pour simplifier la maintenance et préparer l'ajout du module de login.

### Structure:

```
src/modules/personnel/
├── layout/
│   ├── PersonnelLayout.tsx       # Layout principal
│   └── index.ts                   # Exports
├── pages/
│   ├── FormulaireAccouchementPage.tsx
│   ├── GeneratedStatisticsPage.tsx
│   ├── GenererRapportPage.tsx
│   ├── ImportDataPage.tsx
│   ├── PatientsDatabasePage.tsx
│   └── index.ts                   # Exports
└── index.ts                        # Exports centralisés
```

## Import

Avant:
```typescript
import { PersonnelLayout } from '@/layouts/PersonnelLayout';
import { FormulaireAccouchementPage } from '@/pages/personnel';
```

Après:
```typescript
import {
  PersonnelLayout,
  FormulaireAccouchementPage,
  GeneratedStatisticsPage,
  // ... autres pages
} from '@/modules/personnel';
```

## Prochaines étapes

1. **Module Login**: Créer `src/modules/auth/` pour l'authentification
2. **Routes protégées**: Mettre à jour `App.tsx` pour les routes avec authentication
3. **Context Auth**: Ajouter contexte d'authentification global

## Notes

- Les anciennes structures (`src/layouts/PersonnelLayout.tsx` et `src/pages/personnel/`) peuvent être supprimées une fois testées
- Tous les imports dans App.tsx sont déjà mis à jour

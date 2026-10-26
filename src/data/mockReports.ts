import type { GeneratedReport } from '@/types';

/** Mock list of already generated reports for the admin dashboard */
export const MOCK_GENERATED_REPORTS: GeneratedReport[] = [
  {
    id: 'rpt-001',
    generatedAt: '2025-02-20T10:30:00.000Z',
    dataType: 'Accouchement',
    title: 'Rapport Accouchements - Janvier 2025',
    summaryStats: [
      { label: 'Total accouchements', value: 156 },
      { label: 'Taux de césarienne', value: 38, unit: '%' },
      { label: 'Avec complications', value: 12 },
      { label: 'Voie basse', value: 97 },
      { label: 'Poids moyen (g)', value: 3450 },
      { label: 'Taux de complications', value: 7.7, unit: '%' },
    ],
    charts: [
      {
        type: 'line',
        title: 'Accouchements par semaine',
        data: [
          { month: 'S1', value: 42, deliveries: 42 },
          { month: 'S2', value: 38, deliveries: 38 },
          { month: 'S3', value: 41, deliveries: 41 },
          { month: 'S4', value: 35, deliveries: 35 },
        ],
      },
      {
        type: 'pie',
        title: 'Type d\'accouchement',
        data: [
          { name: 'Voie basse', value: 97 },
          { name: 'Césarienne', value: 59 },
        ],
      },
      {
        type: 'pie',
        title: 'Répartition par sexe',
        data: [
          { name: 'Garçons', value: 79 },
          { name: 'Filles', value: 77 },
        ],
      },
      {
        type: 'bar',
        title: 'Complications par type',
        data: [
          { name: 'Hémorragie', count: 4, fill: '#dc2626' },
          { name: 'Infection', count: 3, fill: '#f59e0b' },
          { name: 'Autres', count: 5, fill: '#3b82f6' },
        ],
      },
    ],
    textReport: `RAPPORT STATISTIQUE ACCOUCHEMENTS - JANVIER 2025

Service de Maternité - Centre Hospitalier

PÉRIODE: Janvier 2025 (31 jours)
DATE DE GÉNÉRATION: 20 février 2025

RÉSUMÉ EXÉCUTIF:
Durant le mois de janvier 2025, 156 accouchements ont été enregistrés au service de maternité. Le taux de césarienne s'élève à 38% (59 cas), tandis que 97 accouchements se sont déroulés par voie basse. 12 cas ont présenté des complications, soit un taux de 7.7%.

ANALYSE DES DONNÉES:
• Activité: Régulière avec une moyenne de 39.1 accouchements par semaine
• Poids moyen des nouveau-nés: 3450 grammes
• Distribution garçons/filles: 79 garçons, 77 filles
• Complications principales: Hémorragie (4 cas), Infections (3 cas), Autres (5 cas)

INDICATEURS CLÉS:
✓ Taux de césarienne: 38% (normal: 20-30%)
✓ Taux de complications: 7.7% (acceptable)
✓ Poids moyen: 3450g (normal: 3000-4000g)

RECOMMANDATIONS:
- Suivi du taux de césarienne légèrement élevé
- Renforcer les protocoles de prévention infections
- Maintenir les bonnes pratiques actuelles`,
  },
  {
    id: 'rpt-002',
    generatedAt: '2025-02-18T14:00:00.000Z',
    dataType: 'Hospitalisation',
    title: 'Rapport Hospitalisation - Semaine 07',
    summaryStats: [
      { label: 'Entrées', value: 247 },
      { label: 'Sorties', value: 251 },
      { label: 'Occupation moyenne', value: 82, unit: '%' },
      { label: 'Moyenne séjour', value: '5.2', unit: 'j' },
    ],
    charts: [
      {
        type: 'bar',
        title: 'Activité par service',
        data: [
          { name: 'Médecine', count: 89, fill: '#0d9488' },
          { name: 'Chirurgie', count: 64, fill: '#0284c7' },
          { name: 'Urgences', count: 94, fill: '#0ea5e9' },
        ],
      },
      {
        type: 'line',
        title: 'Taux occupation par jour',
        data: [
          { month: 'Lun', value: 78 },
          { month: 'Mar', value: 80 },
          { month: 'Mer', value: 82 },
          { month: 'Jeu', value: 84 },
          { month: 'Ven', value: 86 },
          { month: 'Sam', value: 83 },
          { month: 'Dim', value: 81 },
        ],
      },
    ],
    textReport: 'Rapport Hospitalisation - Semaine 07. Entrées: 247, Sorties: 251. Taux d\'occupation: 82%.',
  },
  {
    id: 'rpt-003',
    generatedAt: '2025-02-15T09:15:00.000Z',
    dataType: 'Urgences',
    title: 'Rapport Urgences - Février 2025',
    summaryStats: [
      { label: 'Passages', value: 1203 },
      { label: 'Hospitalisations', value: 186 },
      { label: 'Taux tri', value: 'P1: 12%', unit: '' },
      { label: 'Délai moyen', value: '42', unit: 'min' },
    ],
    charts: [
      {
        type: 'line',
        title: 'Passages par jour (moyenne)',
        data: [
          { month: 'Lun', value: 172 },
          { month: 'Mar', value: 165 },
          { month: 'Mer', value: 178 },
          { month: 'Jeu', value: 181 },
          { month: 'Ven', value: 195 },
          { month: 'Sam', value: 158 },
          { month: 'Dim', value: 154 },
        ],
      },
      {
        type: 'pie',
        title: 'Motifs de consultation',
        data: [
          { name: 'Traumatismes', value: 287 },
          { name: 'Infections', value: 356 },
          { name: 'Autres', value: 560 },
        ],
      },
    ],
    textReport: 'Rapport Urgences - Février 2025. Total passages: 1203. Hospitalisations: 186 (15.5%).',
  },
];

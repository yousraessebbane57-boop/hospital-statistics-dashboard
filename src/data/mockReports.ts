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
      { label: 'Césariennes', value: 38, unit: '%' },
      { label: 'Avec complications', value: 12 },
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
    ],
    textReport: 'Rapport statistique Accouchements - Janvier 2025. Total: 156. Taux césarienne: 38%.',
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
    ],
    textReport: 'Rapport Hospitalisation - Semaine 07. Entrées: 247, Sorties: 251.',
  },
  {
    id: 'rpt-003',
    generatedAt: '2025-02-15T09:15:00.000Z',
    dataType: 'Urgences',
    title: 'Rapport Urgences - Février 2025',
    summaryStats: [
      { label: 'Passages', value: 1203 },
      { label: 'Hospitalisations', value: 186 },
      { label: 'Délai moyen', value: '42 min' },
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
    ],
    textReport: 'Rapport Urgences - Février 2025. Total passages: 1203.',
  },
];

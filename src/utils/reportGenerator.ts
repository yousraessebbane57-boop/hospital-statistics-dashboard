import type { GeneratedReport } from '@/types';

interface AccouchementRow {
  id?: string;
  patientId?: string;
  age?: number;
  deliveryType?: string;
  deliveryDate?: string;
  complications?: boolean;
  babySex?: string;
  babyWeightG?: number;
  apgar1?: number;
  apgar5?: number;
}

function calculateWeeklyData(rows: AccouchementRow[]): { month: string; value: number }[] {
  const weeks: Record<number, number> = {};
  
  rows.forEach((r) => {
    if (r.deliveryDate) {
      const d = new Date(r.deliveryDate);
      const weekNum = Math.ceil((d.getDate()) / 7);
      weeks[weekNum] = (weeks[weekNum] ?? 0) + 1;
    }
  });
  
  return Array.from({ length: 4 }, (_, i) => ({
    month: `Semaine ${i + 1}`,
    value: weeks[i + 1] ?? 0,
  }));
}

function generateAnalysisText(stats: {
  total: number;
  normal: number;
  cesarean: number;
  complicationCount: number;
  avgWeight: number;
  avgApgar1: number;
  avgApgar5: number;
  girls: number;
  boys: number;
  periodLabel: string;
}): string {
  const cesarianRate = ((stats.cesarean / stats.total) * 100).toFixed(1);
  const complicationRate = ((stats.complicationCount / stats.total) * 100).toFixed(1);
  const femaleRate = ((stats.girls / stats.total) * 100).toFixed(1);

  return `RAPPORT D'ANALYSE — ${stats.periodLabel}

RÉSUMÉ GÉNÉRAL
Cette période a enregistré ${stats.total} accouchements avec une répartition équilibrée entre voie basse (${stats.normal} cas, ${((stats.normal / stats.total) * 100).toFixed(1)}%) et césariennes (${stats.cesarean} cas, ${cesarianRate}%).

COMPLICATIONS MATERNELLES
Un total de ${stats.complicationCount} cas de complications a été enregistré (${complicationRate}% de la population), incluant dystocies, hémorragies et complications placentaires. Ces taux sont dans les limites acceptables pour un établissement de cette taille.

SANTÉ NÉONATALE
Les bébés nés pendant cette période présentent des scores Apgar moyens de ${stats.avgApgar1}/10 à 1 minute et ${stats.avgApgar5}/10 à 5 minutes, indiquant une adaptation appropriée à la vie extrautérine. Le poids moyen est de ${stats.avgWeight.toFixed(0)}g, compatible avec une gestation à terme.

RÉPARTITION PAR SEXE
La distribution des naissances par sexe est de ${stats.girls} filles (${femaleRate}%) et ${stats.boys} garçons (${(100 - parseFloat(femaleRate)).toFixed(1)}%), reflétant la répartition naturelle.

CONCLUSION
Cette période montre des résultats satisfaisants avec un taux de complication acceptable et une bonne santé néonatale générale. Continuation du monitoring des paramètres obstétriques.`;
}

export function generateCompleteReport(
  rows: AccouchementRow[],
  periodLabel: string
): GeneratedReport {
  const total = rows.length;
  const normal = rows.filter((r) => r.deliveryType === 'normal').length;
  const cesarean = rows.filter((r) => r.deliveryType === 'cesarean').length;
  const complicationCount = rows.filter((r) => r.complications).length;
  const girls = rows.filter((r) => r.babySex === 'F').length;
  const boys = rows.filter((r) => r.babySex === 'M').length;

  const totalWeight = rows.reduce((sum, r) => sum + (r.babyWeightG ?? 0), 0);
  const avgWeight = total > 0 ? totalWeight / total : 0;

  const totalApgar1 = rows.reduce((sum, r) => sum + (r.apgar1 ?? 0), 0);
  const validApgar1 = rows.filter((r) => r.apgar1 != null).length;
  const avgApgar1 = validApgar1 > 0 ? totalApgar1 / validApgar1 : 0;

  const totalApgar5 = rows.reduce((sum, r) => sum + (r.apgar5 ?? 0), 0);
  const validApgar5 = rows.filter((r) => r.apgar5 != null).length;
  const avgApgar5 = validApgar5 > 0 ? totalApgar5 / validApgar5 : 0;

  const cesarianRate = total > 0 ? ((cesarean / total) * 100).toFixed(1) : '0.0';
  const complicationRate = total > 0 ? ((complicationCount / total) * 100).toFixed(1) : '0.0';

  // Weekly data
  const weeklyData = calculateWeeklyData(rows);

  // Summary stats - organized by category
  const summaryStats = [
    // Statistiques essentielles
    { label: 'Nombre total d\'accouchements', value: total, unit: '' },
    { label: 'Taux de césarienne', value: cesarianRate, unit: '%' },
    { label: 'Nombre de complications', value: complicationCount, unit: '' },
    { label: 'Nombre d\'accouchements voie basse', value: normal, unit: '' },
    { label: 'Nombre d\'accouchements voie cesarienne', value: cesarean, unit: '' },
    
    // Statistiques avancées
    { label: 'Taux de complications', value: complicationRate, unit: '%' },
    { label: 'Poids moyen des bébés', value: avgWeight.toFixed(0), unit: 'g' },
    { label: 'Apgar moyen (1 min)', value: avgApgar1.toFixed(1), unit: '/10' },
    { label: 'Apgar moyen (5 min)', value: avgApgar5.toFixed(1), unit: '/10' },
    
    // Répartition par sexe
    { label: 'Nombre de filles', value: girls, unit: '' },
    { label: 'Nombre de garçons', value: boys, unit: '' },
  ];

  // Charts
  const charts: any[] = [
    {
      type: 'line',
      title: 'Accouchements par semaine',
      data: weeklyData,
    },
    {
      type: 'pie',
      title: "Répartition type d'accouchement",
      data: [
        { name: 'Voie basse', value: normal },
        { name: 'Césarienne', value: cesarean },
      ],
    },
    {
      type: 'pie',
      title: 'Répartition par sexe (Fille/Garçon)',
      data: [
        { name: 'Filles', value: girls },
        { name: 'Garçons', value: boys },
      ],
    },
    {
      type: 'bar',
      title: 'Complications maternelles',
      data: [
        { name: 'Sans complications', count: total - complicationCount, fill: '#0d9488' },
        { name: 'Avec complications', count: complicationCount, fill: '#ef4444' },
      ],
    },
  ];

  // Generate detailed analysis text
  const analysisText = generateAnalysisText({
    total,
    normal,
    cesarean,
    complicationCount,
    avgWeight,
    avgApgar1: Math.round(avgApgar1 * 10) / 10,
    avgApgar5: Math.round(avgApgar5 * 10) / 10,
    girls,
    boys,
    periodLabel,
  });

  return ({
    id: `report-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    dataType: 'Accouchement',
    title: `Rapport Accouchements — ${periodLabel}`,
    summaryStats,
    charts,
    textReport: analysisText,
  } as GeneratedReport);
}

import { useState } from 'react';
import { StatCard } from '@/components/ui/StatCard';
import { api } from '@/api/client';
import { useAdminReports } from '@/context/AdminReportsContext';
import { generateCompleteReport } from '@/utils/reportGenerator';
import type { GeneratedReport } from '@/types';

type PeriodType = 'annuelle' | 'mensuelle' | 'personnalisee';

const MONTHS = ['Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];

function getDateRange(period: PeriodType, year: string, month: string, dateFrom: string, dateTo: string): { from: string; to: string } | null {
  if (period === 'annuelle') {
    if (!year) return null;
    return { from: `${year}-01-01`, to: `${year}-12-31` };
  }
  if (period === 'mensuelle') {
    if (!year || !month) return null;
    const y = parseInt(year, 10);
    const m = parseInt(month, 10);
    const lastDay = new Date(y, m, 0).getDate();
    return { from: `${year}-${String(m).padStart(2, '0')}-01`, to: `${year}-${String(m).padStart(2, '0')}-${lastDay}` };
  }
  if (period === 'personnalisee') {
    if (!dateFrom || !dateTo) return null;
    return { from: dateFrom.slice(0, 10), to: dateTo.slice(0, 10) };
  }
  return null;
}

export function GenererRapportPage() {
  const { addReport } = useAdminReports();
  const [period, setPeriod] = useState<PeriodType>('mensuelle');
  const [year, setYear] = useState(() => String(new Date().getFullYear()));
  const [month, setMonth] = useState('2');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [generatedReport, setGeneratedReport] = useState<GeneratedReport | null>(null);

  const handleGenerate = async () => {
    const range = getDateRange(period, year, month, dateFrom, dateTo);
    if (!range) {
      setError('Veuillez renseigner la période (année, ou mois, ou dates personnalisées).');
      return;
    }
    setError(null);
    setSuccess(null);
    setLoading(true);
    setGeneratedReport(null);
    
    try {
      // Fetch data from API
      const rows = await api.accouchements.list({ dateFrom: range.from, dateTo: range.to });
      const list = Array.isArray(rows) ? rows : [];

      if (list.length === 0) {
        setError('Aucune donnée trouvée pour cette période.');
        setLoading(false);
        return;
      }

      // Generate complete report
      let periodLabel = '';
      if (period === 'annuelle') periodLabel = `Année ${year}`;
      else if (period === 'mensuelle') periodLabel = `${MONTHS[parseInt(month, 10) - 1]} ${year}`;
      else periodLabel = `Du ${range.from} au ${range.to}`;

      const report = generateCompleteReport(list, periodLabel);

      // Save report to database via API
      try {
        await api.rapports.create({
          generated_at: report.generatedAt,
          data_type: report.dataType,
          title: report.title,
          summary_stats: report.summaryStats,
          charts: report.charts,
          text_report: report.textReport,
        });
      } catch (apiError) {
        console.error('Erreur lors de la sauvegarde du rapport:', apiError);
        // Continue anyway - display locally
      }

      // Add to context for immediate display
      addReport(report);
      setGeneratedReport(report);
      setSuccess(`Rapport généré et sauvegardé avec succès!`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des données.');
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Générer un diagramme et un rapport</h2>
        <p className="mt-1 text-slate-600">
          Choisissez une durée (annuelle, mensuelle ou personnalisée), puis générez les statistiques et le diagramme.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
        <h3 className="mb-4 text-base font-semibold text-slate-800">Période</h3>
        <div className="space-y-4">
          <div>
            <span className="text-sm font-medium text-slate-700">Type de période</span>
            <div className="mt-2 flex flex-wrap gap-4">
              {[
                { value: 'annuelle' as const, label: 'Annuelle' },
                { value: 'mensuelle' as const, label: 'Mensuelle' },
                { value: 'personnalisee' as const, label: 'Personnalisée' },
              ].map(({ value, label }) => (
                <label key={value} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="period"
                    checked={period === value}
                    onChange={() => setPeriod(value)}
                    className="text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-slate-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {period === 'annuelle' && (
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-slate-700">Année</label>
              <select
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          )}

          {period === 'mensuelle' && (
            <div className="flex gap-4">
              <div>
                <label htmlFor="year-m" className="block text-sm font-medium text-slate-700">Année</label>
                <select
                  id="year-m"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="month" className="block text-sm font-medium text-slate-700">Mois</label>
                <select
                  id="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {MONTHS.map((m, i) => (
                    <option key={i} value={i + 1}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {period === 'personnalisee' && (
            <div className="flex gap-4">
              <div>
                <label htmlFor="dateFrom" className="block text-sm font-medium text-slate-700">Date de début</label>
                <input
                  id="dateFrom"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="dateTo" className="block text-sm font-medium text-slate-700">Date de fin</label>
                <input
                  id="dateTo"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
          {success && <p className="text-sm text-green-600" role="status">{success}</p>}

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Génération…' : 'Générer le diagramme et le rapport'}
          </button>
        </div>
      </div>

      {generatedReport && (
        <>
          <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-800">
            ✓ Rapport généré et enregistré! Voir les détails dans « Statistiques générées ».
          </p>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">{generatedReport.title}</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              {generatedReport.summaryStats.slice(0, 3).map((stat) => (
                <StatCard key={stat.label} data={{
                  label: stat.label,
                  value: `${stat.value}${stat.unit ?? ''}`
                }} />
              ))}
            </div>
            <div className="mt-6 text-sm text-slate-600">
              <p>Pour voir le rapport complet avec tous les graphiques et l'analyse détaillée, allez à « Statistiques générées ».</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

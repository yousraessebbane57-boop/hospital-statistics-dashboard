import { useState, useRef, useEffect } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts';
import { ChartCard } from '@/components/ui/ChartCard';
import { StatCard } from '@/components/ui/StatCard';
import { api } from '@/api/client';
import { useAdminReports } from '@/context/AdminReportsContext';
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
  const [period, setPeriod] = useState<PeriodType>('annuelle');
  const [year, setYear] = useState(() => String(new Date().getFullYear()));
  const [month, setMonth] = useState('1');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pendingReportRef = useRef<(GeneratedReport & { source?: string }) | null>(null);
  const [data, setData] = useState<{
    total: number;
    byType: { name: string; value: number; fill?: string }[];
    byMonth: { month: string; count: number }[];
    complications: number;
    reportText: string;
    periodLabel: string;
  } | null>(null);

  useEffect(() => {
    return () => {
      if (pendingReportRef.current) {
        addReport(pendingReportRef.current);
        pendingReportRef.current = null;
      }
    };
  }, [addReport]);

  const handleGenerate = async () => {
    const range = getDateRange(period, year, month, dateFrom, dateTo);
    if (!range) {
      setError('Veuillez renseigner la période (année, ou mois, ou dates personnalisées).');
      return;
    }
    setError(null);
    setLoading(true);
    setData(null);
    try {
      const rows = await api.accouchements.list({ dateFrom: range.from, dateTo: range.to });
      const list = Array.isArray(rows) ? rows : [];

      const total = list.length;
      const normal = list.filter((r: { deliveryType?: string }) => r.deliveryType === 'normal').length;
      const cesarean = list.filter((r: { deliveryType?: string }) => r.deliveryType === 'cesarean').length;
      const complications = list.filter((r: { complications?: boolean }) => r.complications).length;

      const byMonth: Record<string, number> = {};
      MONTHS.forEach((_, i) => { byMonth[i] = 0; });
      list.forEach((r: { deliveryDate?: string }) => {
        if (r.deliveryDate) {
          const d = new Date(r.deliveryDate);
          const m = d.getMonth();
          byMonth[m] = (byMonth[m] ?? 0) + 1;
        }
      });
      const byMonthChart = MONTHS.map((label, i) => ({ month: label, count: byMonth[i] ?? 0 }));

      let periodLabel = '';
      if (period === 'annuelle') periodLabel = `Année ${year}`;
      else if (period === 'mensuelle') periodLabel = `${MONTHS[parseInt(month, 10) - 1]} ${year}`;
      else periodLabel = `Du ${range.from} au ${range.to}`;

      const reportText = `Rapport statistique — ${periodLabel}\n\n` +
        `Total accouchements : ${total}\n` +
        `Voie basse : ${normal} (${total ? ((normal / total) * 100).toFixed(1) : 0} %)\n` +
        `Césariennes : ${cesarean} (${total ? ((cesarean / total) * 100).toFixed(1) : 0} %)\n` +
        `Avec complications : ${complications}\n\n` +
        `Période : ${range.from} — ${range.to}.`;

      setData({
        total,
        byType: [
          { name: 'Voie basse', value: normal, fill: '#0d9488' },
          { name: 'Césarienne', value: cesarean, fill: '#0284c7' },
        ],
        byMonth: byMonthChart,
        complications,
        reportText,
        periodLabel,
      });

      pendingReportRef.current = {
        id: `gen-${Date.now()}`,
        generatedAt: new Date().toISOString(),
        dataType: 'Accouchement',
        title: `Rapport accouchements — ${periodLabel}`,
        summaryStats: [
          { label: 'Total accouchements', value: total },
          { label: 'Avec complications', value: complications },
          { label: 'Période', value: periodLabel },
        ],
        charts: [
          {
            type: 'pie',
            title: "Répartition par type d'accouchement",
            data: [
              { name: 'Voie basse', value: normal },
              { name: 'Césarienne', value: cesarean },
            ],
          },
          {
            type: 'line',
            title: 'Accouchements par mois',
            data: byMonthChart.map((m) => ({ month: m.month, value: m.count })),
          },
        ],
        textReport: reportText,
        source: 'generation',
      };
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

      {data && (
        <>
          <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-800">
            Ce rapport sera enregistré dans « Statistiques générées » lorsque vous quitterez cette page.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard data={{ label: 'Total accouchements', value: data.total }} />
            <StatCard data={{ label: 'Avec complications', value: data.complications }} />
            <StatCard data={{ label: 'Période', value: data.periodLabel }} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard title="Répartition par type d'accouchement">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={data.byType}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {data.byType.map((_, i) => (
                      <Cell key={i} fill={data.byType[i].fill ?? '#0d9488'} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Accouchements par mois (période)">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={data.byMonth} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" name="Accouchements" fill="#0d9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
            <h3 className="mb-3 text-base font-semibold text-slate-800">Rapport textuel</h3>
            <pre className="whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm text-slate-700 font-sans">
              {data.reportText}
            </pre>
          </div>
        </>
      )}
    </div>
  );
}

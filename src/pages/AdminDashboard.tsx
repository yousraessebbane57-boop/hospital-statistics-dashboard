import { useEffect, useState, useRef } from 'react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { getDashboardStats, type DashboardStats } from '@/api/birthRecords';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { DateFilter, type DateFilterMode } from '@/components/dashboard/DateFilter';

function getDefaultDateRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  return {
    from: start.toISOString().slice(0, 10),
    to: now.toISOString().slice(0, 10),
  };
}

const defaultStats: DashboardStats = {
  kpis: {
    totalPregnancies: 0,
    totalBirths: 0,
    cSectionRate: 0,
    complicationRate: 0,
    bedOccupancy: 78.5,
    totalBoys: 0,
    totalGirls: 0,
  },
  monthlyData: [],
  deliveryTypes: [],
  genderData: [],
  nurseActivity: [],
  bedOccupancyData: [
    { name: 'Occupés', value: 78.5, color: '#0ea5e9' },
    { name: 'Libres', value: 21.5, color: '#e2e8f0' },
  ],
};

export function AdminDashboard() {
  const [dateMode, setDateMode] = useState<DateFilterMode>('month');
  const [dateRange, setDateRange] = useState(getDefaultDateRange);
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [loading, setLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    getDashboardStats({ from: dateRange.from, to: dateRange.to })
      .then(setStats)
      .catch(() => setStats(defaultStats))
      .finally(() => setLoading(false));
  }, [dateRange.from, dateRange.to]);

  const { kpis, monthlyData, deliveryTypes, genderData, nurseActivity, bedOccupancyData } = stats;

  const handleExportPdf = () => {
    window.print();
  };

  const kpiCards = [
    {
      title: 'Total grossesses',
      value: kpis.totalPregnancies.toLocaleString('fr-FR'),
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015H9.375V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
        </svg>
      ),
    },
    {
      title: 'Total naissances',
      value: kpis.totalBirths.toLocaleString('fr-FR'),
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v10.024A2.25 2.25 0 008.25 23h7.5A2.25 2.25 0 0018 20.632V10.608c0-1.135-.845-2.098-1.976-2.192a24.84 24.84 0 00-4.024-.166m0-1.5c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v10.024A2.25 2.25 0 0115.75 23h-7.5A2.25 2.25 0 016 20.632V10.608c0-1.135.845-2.098 1.976-2.192a24.841 24.841 0 014.024-.165m0-1.5v-1.5" />
        </svg>
      ),
    },
    {
      title: 'Taux césariennes',
      value: `${kpis.cSectionRate.toFixed(1)} %`,
      subtitle: 'Sur la période',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
    },
    {
      title: 'Taux complications',
      value: `${kpis.complicationRate.toFixed(1)} %`,
      subtitle: 'Sur la période',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      ),
    },
    {
      title: 'Taux occupation lits (maternité)',
      value: `${kpis.bedOccupancy.toFixed(1)} %`,
      subtitle: 'Lits maternité',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
        </svg>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-slate-500">Chargement des statistiques depuis la base de données...</p>
      </div>
    );
  }

  return (
    <div ref={printRef} data-print-area className="space-y-6 print:bg-white">
      {/* Date filter + Export */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <DateFilter
          from={dateRange.from}
          to={dateRange.to}
          mode={dateMode}
          onFromChange={(v) => setDateRange((r) => ({ ...r, from: v }))}
          onToChange={(v) => setDateRange((r) => ({ ...r, to: v }))}
          onModeChange={setDateMode}
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleExportPdf}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 print:hidden"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exporter en PDF
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5" aria-label="Indicateurs clés">
        {kpiCards.map((card) => (
          <KpiCard
            key={card.title}
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            icon={card.icon}
          />
        ))}
      </section>

      {/* Charts */}
      <section className="space-y-6">
        {/* Line: Monthly births */}
        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm lg:p-5">
          <h3 className="text-lg font-semibold text-slate-800">Évolution des naissances mensuelles</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#cbd5e1' }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#cbd5e1' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                  formatter={(value: number) => [value, 'Naissances']}
                />
                <Line type="monotone" dataKey="births" name="Naissances" stroke="#0ea5e9" strokeWidth={2} dot={{ fill: '#0ea5e9' }} activeDot={{ r: 6 }} isAnimationActive />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pie: Delivery types */}
          <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm lg:p-5">
            <h3 className="text-lg font-semibold text-slate-800">Types d'accouchement</h3>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deliveryTypes}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    isAnimationActive
                  >
                    {(deliveryTypes.length ? deliveryTypes : [{ name: 'Aucune donnée', value: 1, color: '#e2e8f0' }]).map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [value, '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar: Gender */}
          <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm lg:p-5">
            <h3 className="text-lg font-semibold text-slate-800">Répartition garçons / filles</h3>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={genderData.length ? genderData : [{ name: 'Aucune donnée', value: 0, color: '#e2e8f0' }]} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" width={60} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" name="Nombre" radius={[0, 4, 4, 0]} isAnimationActive>
                    {(genderData.length ? genderData : []).map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Doughnut: Bed occupancy */}
          <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm lg:p-5">
            <h3 className="text-lg font-semibold text-slate-800">Occupation des lits (maternité)</h3>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bedOccupancyData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    label={({ name, value }) => `${name}: ${value}%`}
                    isAnimationActive
                  >
                    {bedOccupancyData.map((entry, i) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value}%`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar: Nurse activity */}
          <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm lg:p-5">
            <h3 className="text-lg font-semibold text-slate-800">Activité du personnel (dossiers saisis)</h3>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={nurseActivity.length ? nurseActivity : [{ name: 'Aucune donnée', records: 0, month: '' }]} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#cbd5e1' }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#cbd5e1' }} />
                  <Tooltip formatter={(value: number) => [value, 'Dossiers']} />
                  <Bar dataKey="records" name="Dossiers" fill="#14b8a6" radius={[4, 4, 0, 0]} isAnimationActive />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

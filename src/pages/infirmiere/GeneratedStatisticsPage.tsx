import { useState } from 'react';
import {
  LineChart,
  Line,
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
import { useAdminReports } from '@/context/AdminReportsContext';
import type { GeneratedReport, ReportChartData, MonthlyDataPoint, ServiceActivityData } from '@/types';

/** Format ISO date to locale date string */
function formatReportDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Mock PDF download - in production would call backend or generate client-side */
function handleDownloadPdf(report: GeneratedReport) {
  alert(`Téléchargement PDF (simulé) : ${report.title}\n\nEn production, un PDF serait généré à partir du rapport.`);
}

/** Render a single chart from report chart data */
function ReportChart({ chart }: { chart: ReportChartData }) {
  const data = chart.data as MonthlyDataPoint[] & ServiceActivityData[] & { name: string; value: number }[];

  if (chart.type === 'line') {
    const lineData = data as MonthlyDataPoint[];
    return (
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={lineData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} />
          <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
          <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#0d9488"
            strokeWidth={2}
            dot={{ fill: '#0d9488' }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (chart.type === 'bar') {
    const barData = data as ServiceActivityData[];
    return (
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis type="number" tick={{ fill: '#64748b', fontSize: 12 }} />
          <YAxis type="category" dataKey="name" width={55} tick={{ fill: '#64748b', fontSize: 11 }} />
          <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={28}>
            {barData.map((entry, i) => (
              <Cell key={i} fill={entry.fill ?? '#0d9488'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (chart.type === 'pie') {
    const pieData = data as { name: string; value: number }[];
    const COLORS = ['#0d9488', '#0284c7', '#0ea5e9', '#2dd4bf'];
    return (
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name, value }) => `${name}: ${value}`}
          >
            {pieData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return null;
}

/** Detail view for a single report (charts + stats) */
function ReportDetailView({ report, onClose }: { report: GeneratedReport; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 p-4" aria-modal="true">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">{report.title}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {report.dataType} — Généré le {formatReportDate(report.generatedAt)}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white hover:bg-teal-700"
              onClick={() => handleDownloadPdf(report)}
            >
              Télécharger PDF
            </button>
            <button
              type="button"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              onClick={onClose}
            >
              Fermer
            </button>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {report.summaryStats.map((stat) => (
            <StatCard
              key={stat.label}
              data={{
                label: stat.label,
                value: stat.unit ? `${stat.value}${stat.unit}` : stat.value,
              }}
            />
          ))}
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {report.charts.map((chart) => (
            <ChartCard key={chart.title} title={chart.title}>
              <ReportChart chart={chart} />
            </ChartCard>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Card for a report in the list */
function ReportCard({
  report,
  onViewDetails,
  onDownloadPdf,
}: {
  report: GeneratedReport;
  onViewDetails: () => void;
  onDownloadPdf: () => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card transition-shadow hover:shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-semibold text-slate-800">{report.title}</h3>
          <p className="mt-1 text-sm text-slate-500">
            {report.dataType} — {formatReportDate(report.generatedAt)}
          </p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
            {report.summaryStats.slice(0, 3).map((s) => (
              <li key={s.label}>
                {s.label}: {s.value}
                {s.unit ?? ''}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            className="rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white hover:bg-teal-700"
            onClick={onViewDetails}
          >
            Voir le détail
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={onDownloadPdf}
          >
            Télécharger PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export function GeneratedStatisticsPage() {
  const { reports } = useAdminReports();
  const [detailReport, setDetailReport] = useState<GeneratedReport | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Statistiques générées</h2>
        <p className="mt-1 text-slate-600">
          Liste des rapports statistiques déjà générés. Consultez le détail ou téléchargez en PDF.
        </p>
      </div>
      {reports.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          Aucun rapport généré pour le moment. Utilisez « Importer des données » pour en créer.
        </p>
      ) : (
        <ul className="space-y-4">
          {reports.map((report) => (
            <li key={report.id}>
              <ReportCard
                report={report}
                onViewDetails={() => setDetailReport(report)}
                onDownloadPdf={() => handleDownloadPdf(report)}
              />
            </li>
          ))}
        </ul>
      )}
      {detailReport && (
        <ReportDetailView report={detailReport} onClose={() => setDetailReport(null)} />
      )}
    </div>
  );
}

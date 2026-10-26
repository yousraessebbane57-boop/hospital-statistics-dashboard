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
import { jsPDF } from 'jspdf';
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

/** Generate and download professional PDF with charts */
async function handleDownloadPdf(report: GeneratedReport) {
  try {
    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    let yPosition = 15;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;

    // ========== EN-TÊTE ==========
    pdf.setFillColor(13, 148, 136); // Teal color
    pdf.rect(0, 0, pageWidth, 30, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CENTRE HOSPITALIER RÉGION', margin, 12);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Service de Maternité & Statistiques', margin, 20);

    pdf.setTextColor(128, 128, 128);
    pdf.setFontSize(9);
    const generatedDate = formatReportDate(report.generatedAt);
    pdf.text(`Rapport généré le: ${generatedDate}`, pageWidth - margin - 70, 12);

    yPosition = 40;

    // Add report date and type info
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Date du rapport: ${generatedDate}`, margin, yPosition);
    pdf.text(`Type: ${report.dataType}`, margin + 80, yPosition);
    yPosition += 8;

    // ========== TITRE ==========
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(report.title, margin, yPosition);
    yPosition += 10;

    // ========== RÉSUMÉ STATISTIQUE ==========
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Résumé Statistique', margin, yPosition);
    yPosition += 8;

    // Stats in 3 columns
    const statsPerRow = 3;
    const statBoxWidth = contentWidth / statsPerRow - 2;
    const statBoxHeight = 22;

    report.summaryStats.forEach((stat, index) => {
      const row = Math.floor(index / statsPerRow);
      const col = index % statsPerRow;
      const x = margin + col * (statBoxWidth + 2);
      const y = yPosition + row * (statBoxHeight + 2);

      // Draw box
      pdf.setDrawColor(220, 220, 220);
      pdf.setLineWidth(0.5);
      pdf.rect(x, y, statBoxWidth, statBoxHeight);

      // Fill header
      pdf.setFillColor(240, 240, 240);
      pdf.rect(x, y, statBoxWidth, 7, 'F');

      // Label
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 100, 100);
      pdf.text(stat.label, x + 2, y + 5);

      // Value
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(13, 148, 136);
      const valueText = `${stat.value}${stat.unit ?? ''}`;
      pdf.text(valueText, x + 2, y + 16);
    });

    yPosition += Math.ceil(report.summaryStats.length / statsPerRow) * (statBoxHeight + 2) + 8;

    // Add page if needed
    if (yPosition > pageHeight - 30) {
      pdf.addPage();
      yPosition = margin;
    }

    // ========== GRAPHIQUES ==========
    if (report.charts && report.charts.length > 0) {
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('Graphiques Détaillés', margin, yPosition);
      yPosition += 8;

      // Create temporary containers for each chart
      for (let i = 0; i < report.charts.length; i++) {
        const chart = report.charts[i];

        if (yPosition > pageHeight - 80) {
          pdf.addPage();
          yPosition = margin;
        }

        // Chart title
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text(chart.title, margin, yPosition);
        yPosition += 6;

        // Create chart container (temporary)
        const chartContainer = document.createElement('div');
        chartContainer.style.position = 'absolute';
        chartContainer.style.left = '-9999px';
        chartContainer.style.width = '600px';
        chartContainer.style.height = '300px';
        chartContainer.style.backgroundColor = 'white';
        document.body.appendChild(chartContainer);

        // Render chart in container
        const chartElement = document.createElement('div');
        chartElement.style.width = '100%';
        chartElement.style.height = '100%';
        chartContainer.appendChild(chartElement);

        // Simple chart rendering (mock - in production use recharts-to-image)
        try {
          // Create a simple visual representation
          
          if (chart.type === 'pie') {
            // Pie chart data
            const total = (chart.data as any[]).reduce((sum, d) => sum + d.value, 0);
            let y = yPosition + 5;
            
            (chart.data as any[]).forEach((item, idx) => {
              const percentage = ((item.value / total) * 100).toFixed(1);
              const colors = ['#0d9488', '#0284c7', '#0ea5e9', '#2dd4bf'];
              const color = colors[idx % colors.length];
              
              // Draw color box
              pdf.setDrawColor(color as any);
              pdf.setFillColor(color as any);
              pdf.rect(margin, y, 3, 3, 'F');
              
              // Draw label and percentage
              pdf.setFontSize(9);
              pdf.setTextColor(0, 0, 0);
              pdf.text(`${item.name}: ${item.value} (${percentage}%)`, margin + 5, y + 2);
              
              y += 6;
            });
            yPosition += (chart.data as any[]).length * 6 + 10;
          } else if (chart.type === 'bar') {
            // Bar chart data
            let y = yPosition + 5;
            const maxValue = Math.max(...(chart.data as any[]).map(d => d.count));
            
            (chart.data as any[]).forEach((item) => {
              const barWidth = (item.count / maxValue) * 100;
              const color = item.fill || '#0d9488';
              
              // Draw bar
              pdf.setDrawColor(color as any);
              pdf.setFillColor(color as any);
              pdf.rect(margin + 30, y, (barWidth / 100) * (contentWidth - 35), 5, 'F');
              
              // Draw label
              pdf.setFontSize(9);
              pdf.setTextColor(0, 0, 0);
              pdf.text(`${item.name}: ${item.count}`, margin, y + 3);
              
              y += 8;
            });
            yPosition += (chart.data as any[]).length * 8 + 10;
          } else if (chart.type === 'line') {
            // Line chart data - simple representation
            let y = yPosition + 5;
            const maxValue = Math.max(...(chart.data as any[]).map(d => d.value));
            const minValue = Math.min(...(chart.data as any[]).map(d => d.value));
            const range = maxValue - minValue || 1;
            
            (chart.data as any[]).forEach((item) => {
              const percentage = ((item.value - minValue) / range) * 100;
              
              pdf.setFontSize(9);
              pdf.setTextColor(13, 148, 136);
              pdf.setFont('helvetica', 'bold');
              pdf.text(`${item.month}`, margin, y);
              
              pdf.setFontSize(10);
              pdf.text(`${item.value}`, margin + 20, y);
              
              // Simple bar representation
              pdf.setDrawColor(13, 148, 136);
              pdf.setFillColor(13, 148, 136);
              pdf.rect(margin + 35, y - 2, (percentage / 100) * (contentWidth - 40), 4, 'F');
              
              y += 6;
            });
            yPosition += (chart.data as any[]).length * 6 + 10;
          }
        } catch (err) {
          console.error('Erreur rendu graphique:', err);
        }

        document.body.removeChild(chartContainer);
      }
    }

    // Add page if needed for rapport texte
    if (yPosition > pageHeight - 50) {
      pdf.addPage();
      yPosition = margin;
    }

    // ========== RAPPORT TEXTE ==========
    if (report.textReport) {
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('Rapport Détaillé', margin, yPosition);
      yPosition += 8;

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(50, 50, 50);

      // Split text into lines and wrap
      const lines = pdf.splitTextToSize(report.textReport, contentWidth);
      
      lines.forEach((line: string) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(line, margin, yPosition);
        yPosition += 5;
      });
    }

    // ========== PIED DE PAGE ==========
    const totalPages = (pdf as any).internal.pages.length - 1;
    
    for (let i = 1; i <= totalPages; i++) {
      (pdf as any).setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(
        `Page ${i} / ${totalPages}`,
        pageWidth / 2,
        pageHeight - 5,
        { align: 'center' }
      );
    }

    // Generate filename
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `rapport_${report.dataType}_${timestamp}.pdf`;

    pdf.save(filename);
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    alert('Erreur lors de la génération du PDF. Vérifiez la console pour plus de détails.');
  }
}

/** Export report to Excel */

/** Print report */
function handlePrintReport(report: GeneratedReport) {
  try {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Veuillez autoriser les pop-ups pour imprimer');
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${report.title}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 40px;
              color: #333;
            }
            header {
              background-color: #0d9488;
              color: white;
              padding: 20px;
              margin: -40px -40px 40px -40px;
            }
            h1 { color: #0d9488; margin-top: 30px; margin-bottom: 15px; }
            h2 { color: #0d9488; font-size: 16px; margin-top: 20px; margin-bottom: 10px; }
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 15px;
              margin-bottom: 30px;
            }
            .stat-card {
              border: 1px solid #ddd;
              padding: 15px;
              border-radius: 5px;
              background: #f9f9f9;
            }
            .stat-label { font-size: 12px; color: #666; }
            .stat-value { font-size: 20px; font-weight: bold; color: #0d9488; margin-top: 5px; }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 15px 0;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 10px;
              text-align: left;
            }
            th { background-color: #f0f0f0; font-weight: bold; }
            .report-text {
              white-space: pre-wrap;
              margin-top: 20px;
              padding: 15px;
              background-color: #f9f9f9;
              border-radius: 5px;
            }
            @media print {
              body { margin: 0; }
              header { margin: 0 0 30px 0; }
              page-break-inside: avoid;
            }
          </style>
        </head>
        <body>
          <header>
            <h1>RAPPORT HOSPITALIER</h1>
            <p>${report.title}</p>
            <small>Généré le ${formatReportDate(report.generatedAt)}</small>
          </header>

          <h2>Résumé Statistique</h2>
          <div class="stats-grid">
            ${report.summaryStats.map(stat => `
              <div class="stat-card">
                <div class="stat-label">${stat.label}</div>
                <div class="stat-value">${stat.value}${stat.unit ?? ''}</div>
              </div>
            `).join('')}
          </div>

          <h2>Données Détaillées</h2>
          ${report.charts.map(chart => `
            <h3>${chart.title}</h3>
            <table>
              <thead>
                <tr>
                  ${(chart.data as any[])[0] ? Object.keys((chart.data as any[])[0]).map(key => `<th>${key}</th>`).join('') : ''}
                </tr>
              </thead>
              <tbody>
                ${(chart.data as any[]).map(row => `
                  <tr>
                    ${Object.values(row).map(val => `<td>${val}</td>`).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `).join('')}

          ${report.textReport ? `
            <h2>Rapport Complet</h2>
            <div class="report-text">${report.textReport}</div>
          ` : ''}
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    
    // Auto-print after content loads
    printWindow.onload = () => {
      printWindow.print();
    };
  } catch (error) {
    console.error('Erreur lors de l\'impression:', error);
    alert('Erreur lors de l\'impression.');
  }
}

/** Render a single chart from report chart data */
function ReportChart({ chart }: { chart: ReportChartData }) {
  const data = chart.data as MonthlyDataPoint[] & ServiceActivityData[] & { name: string; value: number }[];

  if (chart.type === 'line') {
    const lineData = data as MonthlyDataPoint[];
    return (
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={lineData} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
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
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={barData} layout="vertical" margin={{ top: 10, right: 30, left: 80, bottom: 30 }}>
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
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="45%"
            cy="45%"
            outerRadius={90}
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
    <div className="fixed bottom-0 left-0 right-0 top-24 z-50 overflow-y-auto bg-slate-900/50 p-4" aria-modal="true">
      <div className="mx-auto max-w-6xl rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">{report.title}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {report.dataType} — Généré le {formatReportDate(report.generatedAt)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white hover:bg-teal-700"
              onClick={() => handleDownloadPdf(report)}
            >
              Télécharger PDF
            </button>
            <button
              type="button"
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
              onClick={() => handlePrintReport(report)}
            >
              Imprimer
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
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
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
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white hover:bg-teal-700"
            onClick={onViewDetails}
          >
            Voir détail
          </button>
          <button
            type="button"
            className="rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white hover:bg-teal-700"
            onClick={onDownloadPdf}
          >
            PDF
          </button>
          <button
            type="button"
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            onClick={() => handlePrintReport(report)}
          >
            Imprimer
          </button>
        </div>
      </div>
    </div>
  );
}

export function GeneratedStatisticsPage() {
  const { reports, loading } = useAdminReports();
  const [detailReport, setDetailReport] = useState<GeneratedReport | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Statistiques générées</h2>
        <p className="mt-1 text-slate-600">
          Liste des rapports statistiques (base PostgreSQL). Consultez le détail ou téléchargez en PDF.
        </p>
        {loading && <p className="text-sm text-slate-500">Chargement…</p>}
      </div>
      {!loading && reports.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          Aucun rapport généré pour le moment. Utilisez « Générer rapport et diagramme » ou « Importer des données » pour en créer.
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

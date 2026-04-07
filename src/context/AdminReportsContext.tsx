import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { GeneratedReport } from '@/types';
import { api } from '@/api/client';

interface AdminReportsContextValue {
  reports: GeneratedReport[];
  setReports: React.Dispatch<React.SetStateAction<GeneratedReport[]>>;
  addReport: (report: GeneratedReport) => Promise<void>;
  loading: boolean;
}

const AdminReportsContext = createContext<AdminReportsContextValue | null>(null);

function mapRowToReport(row: { id: string; generatedAt: string; dataType: string; title: string; summaryStats: unknown; charts: unknown; textReport?: string }): GeneratedReport {
  return {
    id: row.id,
    generatedAt: row.generatedAt,
    dataType: row.dataType as GeneratedReport['dataType'],
    title: row.title,
    summaryStats: Array.isArray(row.summaryStats) ? row.summaryStats : [],
    charts: Array.isArray(row.charts) ? row.charts : [],
    textReport: row.textReport,
  };
}

/** Charge les rapports depuis l'API au montage; nouveaux rapports (import) sont envoyés à l'API et ajoutés au state. */
export function AdminReportsProvider({
  children,
  initialReports,
}: {
  children: ReactNode;
  initialReports: GeneratedReport[];
}) {
  const [reports, setReports] = useState<GeneratedReport[]>(initialReports);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.rapports
      .list()
      .then((rows: unknown[]) => {
        if (Array.isArray(rows) && rows.length >= 0) {
          setReports(rows.map((row) => mapRowToReport(row as Parameters<typeof mapRowToReport>[0])));
        }
      })
      .catch(() => { /* garde les initialReports si l'API n'est pas dispo */ })
      .finally(() => setLoading(false));
  }, []);

  const addReport = async (report: GeneratedReport & { source?: string }) => {
    try {
      const created = await api.rapports.create({
        generatedAt: report.generatedAt,
        dataType: report.dataType,
        title: report.title,
        summaryStats: report.summaryStats,
        charts: report.charts,
        textReport: report.textReport,
        source: report.source ?? 'import',
      });
      const createdReport = mapRowToReport(created as Parameters<typeof mapRowToReport>[0]);
      setReports((prev) => [createdReport, ...prev]);
      return;
    } catch (_e) {
      /* si l'API échoue, on ajoute en local avec l'id temporaire */
    }
    setReports((prev) => [report, ...prev]);
  };

  return (
    <AdminReportsContext.Provider value={{ reports, setReports, addReport, loading }}>
      {children}
    </AdminReportsContext.Provider>
  );
}

export function useAdminReports() {
  const ctx = useContext(AdminReportsContext);
  if (!ctx) throw new Error('useAdminReports must be used within AdminReportsProvider');
  return ctx;
}

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { GeneratedReport } from '@/types';

interface AdminReportsContextValue {
  reports: GeneratedReport[];
  setReports: React.Dispatch<React.SetStateAction<GeneratedReport[]>>;
  addReport: (report: GeneratedReport) => void;
}

const AdminReportsContext = createContext<AdminReportsContextValue | null>(null);

/** Initial reports come from mock data; new reports from Import are added to this state. */
export function AdminReportsProvider({
  children,
  initialReports,
}: {
  children: ReactNode;
  initialReports: GeneratedReport[];
}) {
  const [reports, setReports] = useState<GeneratedReport[]>(initialReports);

  const addReport = (report: GeneratedReport) => {
    setReports((prev) => [report, ...prev]);
  };

  return (
    <AdminReportsContext.Provider value={{ reports, setReports, addReport }}>
      {children}
    </AdminReportsContext.Provider>
  );
}

export function useAdminReports() {
  const ctx = useContext(AdminReportsContext);
  if (!ctx) throw new Error('useAdminReports must be used within AdminReportsProvider');
  return ctx;
}

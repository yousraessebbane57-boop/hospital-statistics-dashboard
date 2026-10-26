import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AdminReportsProvider } from '@/context/AdminReportsContext';
import { MOCK_GENERATED_REPORTS } from '@/data/mockReports';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PersonnelLayout } from '@/modules/personnel';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { BirthRecordsPage } from '@/pages/admin/BirthRecordsPage';
import { NursesPage } from '@/pages/admin/NursesPage';
import { ReportsPage } from '@/pages/admin/ReportsPage';
import { SettingsPage } from '@/pages/admin/SettingsPage';
import { LandingPage } from '@/pages/LandingPage';
import { PersonnelPage } from '@/pages/PersonnelPage';
import {
  FormulaireAccouchementPage,
  GeneratedStatisticsPage,
  GenererRapportPage,
  ImportDataPage,
  PatientsDatabasePage,
} from '@/modules/personnel';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/staff" element={<PersonnelPage />} />
        <Route
          path="/personnel"
          element={
            <AdminReportsProvider initialReports={MOCK_GENERATED_REPORTS}>
              <PersonnelLayout />
            </AdminReportsProvider>
          }
        >
          <Route index element={<FormulaireAccouchementPage />} />
          <Route path="statistiques" element={<GeneratedStatisticsPage />} />
          <Route path="rapport" element={<GenererRapportPage />} />
          <Route path="import" element={<ImportDataPage />} />
          <Route path="patients" element={<PatientsDatabasePage />} />
        </Route>
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="birth-records" element={<BirthRecordsPage />} />
          <Route path="nurses" element={<NursesPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

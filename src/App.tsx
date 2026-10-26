import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from '@/pages/LandingPage';
import { PersonnelPage } from '@/pages/PersonnelPage';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { BirthRecordsPage } from '@/pages/admin/BirthRecordsPage';
import { NursesPage } from '@/pages/admin/NursesPage';
import { ReportsPage } from '@/pages/admin/ReportsPage';
import { SettingsPage } from '@/pages/admin/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/staff" element={<PersonnelPage />} />
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

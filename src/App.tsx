import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import {
  PersonnelLayout,
  FormulaireAccouchementPage,
  GeneratedStatisticsPage,
  GenererRapportPage,
  ImportDataPage,
  PatientsDatabasePage,
} from '@/modules/personnel';
import { AdminReportsProvider } from '@/context/AdminReportsContext';
import { MOCK_GENERATED_REPORTS } from '@/data/mockReports';
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { PersonnelManagementPage } from '@/pages/admin/PersonnelManagementPage';
import { AdministratorManagementPage } from '@/pages/admin/AdministratorManagementPage';
import { AdminLayout } from '@/layouts/AdminLayout';
import { HomePage } from '@/pages/HomePage';

function SuperAdminOnly() {
  const { user, loading } = useAdminAuth();
  if (loading) return <div className="p-10 text-center text-slate-500">Vérification de la session…</div>;
  return user?.role === 'SUPER_ADMIN' ? <Outlet /> : <Navigate to="/admin" replace />;
}

function SignedInOnly() {
  const { user, loading } = useAdminAuth();
  if (loading) return <div className="p-10 text-center text-slate-500">Vérification de la session…</div>;
  return user ? <Outlet /> : <Navigate to="/connexion" replace />;
}

/** Application with separate medical personnel and administrator workspaces. */
function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <Routes>
          <Route path="/connexion" element={<AdminLoginPage />} />
          <Route path="/admin/login" element={<Navigate to="/connexion?role=admin" replace />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="personnel" element={<PersonnelManagementPage />} />
            <Route element={<SuperAdminOnly />}>
              <Route path="administrateurs" element={<AdministratorManagementPage />} />
            </Route>
          </Route>
          <Route path="/" element={<HomePage />} />
          <Route
            element={<SignedInOnly />}
          >
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
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { InfirmiereLayout } from '@/layouts/InfirmiereLayout';
import {
  FormulaireAccouchementPage,
  GeneratedStatisticsPage,
  ImportDataPage,
  PatientsDatabasePage,
} from '@/pages/infirmiere';
import { AdminReportsProvider } from '@/context/AdminReportsContext';
import { MOCK_GENERATED_REPORTS } from '@/data/mockReports';

/**
 * Application : tout regroupé sous l'espace infirmier (pages/infirmiere).
 * Formulaire accouchement, statistiques, import, base patients.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AdminReportsProvider initialReports={MOCK_GENERATED_REPORTS}>
              <InfirmiereLayout />
            </AdminReportsProvider>
          }
        >
          <Route index element={<FormulaireAccouchementPage />} />
          <Route path="statistiques" element={<GeneratedStatisticsPage />} />
          <Route path="import" element={<ImportDataPage />} />
          <Route path="patients" element={<PatientsDatabasePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

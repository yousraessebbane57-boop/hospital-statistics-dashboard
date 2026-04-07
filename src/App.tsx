import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

/**
 * Application : tout regroupé sous l'espace personnel (modules/personnel).
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

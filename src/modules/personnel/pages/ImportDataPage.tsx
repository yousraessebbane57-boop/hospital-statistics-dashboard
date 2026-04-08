import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminReports } from '@/context/AdminReportsContext';
import { api } from '@/api/client';
import { generateCompleteReport } from '@/utils/reportGenerator';
import type { GeneratedReport } from '@/types';

const ALLOWED_EXTENSIONS = ['.csv', '.xlsx'];
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

type ImportStatus = 'idle' | 'validating' | 'parsing' | 'success' | 'error';

/**
 * Validates file type (.csv or .xlsx) and size.
 * Returns error message or null if valid.
 */
function validateFile(file: File): string | null {
  const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return `Format non accepté. Utilisez ${ALLOWED_EXTENSIONS.join(' ou ')}.`;
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `Fichier trop volumineux (max ${MAX_FILE_SIZE_MB} Mo).`;
  }
  return null;
}

/**
 * Mock parsing: simulates reading rows and inferring data type from filename or content.
 * In production this would use a real CSV/Excel parser (e.g. papaparse, xlsx).
 */

/**
 * Builds a generated report from imported data using generateCompleteReport.
 * Fetches all accouchements to generate accurate stats and charts.
 */
async function buildReportFromImportedData(
  fileName: string
): Promise<GeneratedReport> {
  // Fetch all accouchements (no date filter)
  const rows = await api.accouchements.list();
  const list = Array.isArray(rows) ? rows : [];
  
  // Generate actual report with real data
  const report = generateCompleteReport(list, `Import — ${fileName.replace(/\.[^/.]+$/, '')}`);
  
  return report;
}

export function ImportDataPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ImportStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const { addReport } = useAdminReports();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = e.target.files?.[0];
    setError(null);
    setFile(chosen ?? null);
    setStatus('idle');
  };

  const handleImport = async () => {
    if (!file) {
      setError('Veuillez sélectionner un fichier.');
      return;
    }

    setError(null);
    setStatus('validating');

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setStatus('error');
      return;
    }

    setStatus('parsing');
    try {
      await api.accouchements.importFile(file);
      
      // Generate report with real imported data
      const report = await buildReportFromImportedData(file.name);
      await addReport(report);
      
      setStatus('success');
      setFile(null);
      if (inputRef.current) inputRef.current.value = '';
      setTimeout(() => navigate('/patients'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'import. Vérifiez le format (CSV : séparateur ;).');
      setStatus('error');
    }
  };

  const isBusy = status === 'validating' || status === 'parsing';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Importer des données</h2>
        <p className="mt-1 text-slate-600">
          Importez un fichier CSV (séparateur ;) ou Excel. Les lignes sont enregistrées dans la base de données
          et affichées dans « Base patients ». Un rapport est aussi ajouté à « Statistiques générées ».
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
        <label className="block text-sm font-medium text-slate-700">
          Fichier (CSV ou Excel)
        </label>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xlsx"
            onChange={handleFileChange}
            className="block w-full max-w-xs text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-teal-700 hover:file:bg-teal-100"
            disabled={isBusy}
          />
          <button
            type="button"
            onClick={handleImport}
            disabled={isBusy || !file}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
          >
            {isBusy ? 'Import en cours…' : 'Importer et générer le rapport'}
          </button>
        </div>
        {file && status === 'idle' && (
          <p className="mt-2 text-sm text-slate-500">
            Fichier sélectionné : {file.name} ({(file.size / 1024).toFixed(1)} Ko)
          </p>
        )}
        {error && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {status === 'success' && (
          <p className="mt-2 text-sm text-green-600" role="status">
            Import réussi. Données enregistrées en base. Redirection vers Base patients…
          </p>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <strong className="text-slate-700">Validation :</strong> seuls les fichiers .csv et .xlsx
        sont acceptés, taille max {MAX_FILE_SIZE_MB} Mo. Les données seront enregistrées en base et
        un rapport complet avec statistiques et graphiques sera généré automatiquement.
      </div>
    </div>
  );
}

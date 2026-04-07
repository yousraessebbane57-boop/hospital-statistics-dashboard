import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminReports } from '@/context/AdminReportsContext';
import { api } from '@/api/client';
import type { GeneratedReport, ReportDataType } from '@/types';

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
 * Builds a generated report from parsed mock data (stats + charts + text).
 * In production, stats and charts would be computed from actual parsed rows.
 */
function buildReportFromParsedData(
  dataType: ReportDataType,
  rowCount: number,
  fileName: string
): GeneratedReport {
  const now = new Date().toISOString();
  const id = `rpt-${Date.now()}`;
  const title = `Rapport import — ${dataType} (${fileName})`;

  const summaryStats = [
    { label: 'Lignes importées', value: rowCount },
    { label: 'Type de données', value: dataType },
    { label: 'Date d\'import', value: new Date(now).toLocaleDateString('fr-FR') },
  ];

  // Mock chart data based on data type
  const charts = [
    {
      type: 'line' as const,
      title: 'Répartition simulée (par période)',
      data: [
        { month: 'P1', value: Math.floor(rowCount * 0.25), deliveries: Math.floor(rowCount * 0.25) },
        { month: 'P2', value: Math.floor(rowCount * 0.3), deliveries: Math.floor(rowCount * 0.3) },
        { month: 'P3', value: Math.floor(rowCount * 0.22), deliveries: Math.floor(rowCount * 0.22) },
        { month: 'P4', value: rowCount - Math.floor(rowCount * 0.77), deliveries: rowCount - Math.floor(rowCount * 0.77) },
      ],
    },
    {
      type: 'pie' as const,
      title: 'Répartition par catégorie (simulée)',
      data: [
        { name: 'Catégorie A', value: Math.floor(rowCount * 0.5) },
        { name: 'Catégorie B', value: Math.floor(rowCount * 0.3) },
        { name: 'Catégorie C', value: rowCount - Math.floor(rowCount * 0.8) },
      ],
    },
  ];

  const textReport = `Rapport généré automatiquement à partir de l'import "${fileName}". Type: ${dataType}. Lignes traitées: ${rowCount}. Date: ${now}.`;

  return {
    id,
    generatedAt: now,
    dataType,
    title,
    summaryStats,
    charts,
    textReport,
  };
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
      const result = await api.accouchements.importFile(file);
      const count = result.count ?? 0;
      const report = buildReportFromParsedData('Accouchement', count, file.name);
      report.summaryStats = [
        { label: 'Lignes importées', value: count },
        { label: 'Total lignes fichier', value: result.total ?? count },
        { label: 'Date d\'import', value: new Date().toLocaleDateString('fr-FR') },
      ];
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
        sont acceptés, taille max {MAX_FILE_SIZE_MB} Mo. Le parsing et la génération des statistiques
        sont simulés (pas de backend).
      </div>
    </div>
  );
}

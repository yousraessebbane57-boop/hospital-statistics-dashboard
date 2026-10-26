import { useMemo, useState, useEffect } from 'react';
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable';
import { MOCK_PATIENTS_ACCOUCHEMENT } from '@/data/mockPatients';
import { api } from '@/api/client';
import type { PatientAccouchement } from '@/types';

const PAGE_SIZE = 5;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function mapRowToPatient(row: Record<string, unknown>): PatientAccouchement {
  return {
    id: String(row.id),
    patientId: String(row.patientId),
    cin: String(row.cin),
    age: Number(row.age),
    deliveryType: row.deliveryType as 'normal' | 'cesarean',
    admissionDate: String(row.admissionDate),
    deliveryDate: String(row.deliveryDate),
    complications: Boolean(row.complications),
    laborDuration: row.laborDuration != null ? String(row.laborDuration) : undefined,
    complicationsDescription: row.complicationsDescription != null ? String(row.complicationsDescription) : undefined,
    babySex: row.babySex === 'M' || row.babySex === 'F' ? row.babySex : undefined,
    babyWeightG: row.babyWeightG != null ? Number(row.babyWeightG) : undefined,
    apgar1: row.apgar1 != null ? Number(row.apgar1) : undefined,
    apgar5: row.apgar5 != null ? Number(row.apgar5) : undefined,
    responsibleDoctor: row.responsibleDoctor != null ? String(row.responsibleDoctor) : undefined,
    responsibleStaff: row.responsibleStaff != null ? String(row.responsibleStaff) : undefined,
  };
}

export function PatientsDatabasePage() {
  const [patients, setPatients] = useState<PatientAccouchement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.accouchements
      .list()
      .then((rows: unknown[]) => {
        if (Array.isArray(rows)) {
          setPatients(rows.map((row) => mapRowToPatient(row as Record<string, unknown>)));
        }
      })
      .catch(() => setPatients(MOCK_PATIENTS_ACCOUCHEMENT))
      .finally(() => setLoading(false));
  }, []);

  const columns: DataTableColumn<PatientAccouchement>[] = [
    { key: 'patientId', header: 'ID Patient' },
    { key: 'cin', header: 'CIN' },
    { key: 'age', header: 'Âge' },
    {
      key: 'deliveryType',
      header: 'Type d\'accouchement',
      render: (row) => (
        <span className={row.deliveryType === 'cesarean' ? 'text-blue-600 font-medium' : 'text-green-700'}>
          {row.deliveryType === 'cesarean' ? 'Césarienne' : 'Voie basse'}
        </span>
      ),
    },
    { key: 'admissionDate', header: 'Date d\'admission', render: (row) => formatDate(row.admissionDate) },
    { key: 'deliveryDate', header: 'Date d\'accouchement', render: (row) => formatDate(row.deliveryDate) },
    { key: 'laborDuration', header: 'Durée travail', render: (row) => row.laborDuration ?? '—' },
    {
      key: 'complications',
      header: 'Complications',
      render: (row) => (
        <span>
          {row.complications ? 'Oui' : 'Non'}
          {row.complications && row.complicationsDescription && (
            <span className="ml-1 text-slate-500" title={row.complicationsDescription}> (dét.)</span>
          )}
        </span>
      ),
    },
    { key: 'babySex', header: 'Sexe bébé', render: (row) => (row.babySex === 'M' ? 'M' : row.babySex === 'F' ? 'F' : '—') },
    {
      key: 'babyWeightG',
      header: 'Poids bébé (g)',
      render: (row) => (row.babyWeightG != null ? `${row.babyWeightG}` : '—'),
    },
    {
      key: 'apgar',
      header: 'Apgar 1/5',
      render: (row) =>
        row.apgar1 != null || row.apgar5 != null
          ? `${row.apgar1 ?? '—'}/${row.apgar5 ?? '—'}`
          : '—',
    },
    { key: 'responsibleDoctor', header: 'Médecin', render: (row) => row.responsibleDoctor ?? '—' },
    { key: 'responsibleStaff', header: 'Personnel', render: (row) => row.responsibleStaff ?? '—' },
  ];

  const listToUse = patients.length > 0 ? patients : MOCK_PATIENTS_ACCOUCHEMENT;

  const filteredAndPaginated = useMemo(() => {
    let list = [...listToUse];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.patientId.toLowerCase().includes(q) ||
          p.cin.toLowerCase().includes(q) ||
          String(p.age).includes(q) ||
          p.deliveryType.toLowerCase().includes(q) ||
          (p.complications && 'oui'.includes(q)) ||
          (!p.complications && 'non'.includes(q))
      );
    }
    if (dateFrom) list = list.filter((p) => p.deliveryDate.slice(0, 10) >= dateFrom);
    if (dateTo) list = list.filter((p) => p.deliveryDate.slice(0, 10) <= dateTo);
    const total = list.length;
    const start = (page - 1) * PAGE_SIZE;
    return { pageData: list.slice(start, start + PAGE_SIZE), total };
  }, [listToUse, search, dateFrom, dateTo, page]);

  const totalPages = Math.ceil(filteredAndPaginated.total / PAGE_SIZE) || 1;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Base patients — Accouchement</h2>
        <p className="mt-1 text-slate-600">
          Liste des dossiers accouchement (base PostgreSQL). Recherche, filtre par date et pagination.
        </p>
        {loading && <p className="text-sm text-slate-500">Chargement…</p>}
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-slate-700">Recherche</label>
            <input
              id="search"
              type="search"
              placeholder="ID, CIN, âge, type…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="mt-1 w-48 rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="dateFrom" className="block text-sm font-medium text-slate-700">Du</label>
            <input
              id="dateFrom"
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
              className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="dateTo" className="block text-sm font-medium text-slate-700">Au</label>
            <input
              id="dateTo"
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
              className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        <p className="text-sm text-slate-500">
          {filteredAndPaginated.total} résultat{filteredAndPaginated.total !== 1 ? 's' : ''}
        </p>
      </div>
      <DataTable<PatientAccouchement>
        columns={columns}
        data={filteredAndPaginated.pageData}
        keyExtractor={(row) => row.id}
        emptyMessage="Aucun enregistrement pour les critères sélectionnés."
      />
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Précédent
          </button>
          <span className="text-sm text-slate-600">Page {page} / {totalPages}</span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}

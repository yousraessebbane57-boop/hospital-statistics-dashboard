import { useEffect, useState } from 'react';
import { adminApi } from '@/api/admin';
import type { DashboardStats } from '@/api/admin';

const CARDS: { key: keyof DashboardStats; label: string; hint: string; color: string }[] = [
  { key: 'personnel', label: 'Personnel médical', hint: 'Comptes enregistrés', color: 'text-green-700 bg-green-50' },
  { key: 'activePersonnel', label: 'Comptes actifs', hint: 'Accès actuellement ouverts', color: 'text-blue-700 bg-blue-50' },
  { key: 'administrators', label: 'Administrateurs', hint: 'Comptes de gestion', color: 'text-indigo-700 bg-indigo-50' },
  { key: 'births', label: 'Accouchements', hint: 'Dossiers enregistrés', color: 'text-amber-700 bg-amber-50' },
  { key: 'birthsThisMonth', label: 'Ce mois-ci', hint: 'Accouchements enregistrés', color: 'text-rose-700 bg-rose-50' },
];

export function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.dashboard().then(setStats).catch((loadError: Error) => setError(loadError.message));
  }, []);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-7">
        <p className="text-sm font-semibold uppercase tracking-wide text-green-700">Vue générale</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-900">Tableau de bord</h2>
        <p className="mt-1 text-slate-500">Suivez l’activité et les accès de la plateforme hospitalière.</p>
      </div>
      {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {!stats && !error ? <p className="text-slate-500">Chargement des statistiques…</p> : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {CARDS.map(({ key, label, hint, color }) => (
            <article key={key} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">{label}</p>
                  <p className="mt-3 text-3xl font-bold text-slate-900">{stats?.[key] ?? '—'}</p>
                  <p className="mt-1 text-sm text-slate-500">{hint}</p>
                </div>
                <span className={`rounded-xl px-3 py-2 text-xs font-semibold ${color}`}>Données réelles</span>
              </div>
            </article>
          ))}
        </div>
      )}
      <section className="mt-7 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Administration de la plateforme</h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Gérez les comptes du personnel médical, leur statut d’accès et, selon vos droits, les comptes administrateurs.
          Les statistiques affichées proviennent des enregistrements PostgreSQL.
        </p>
      </section>
    </div>
  );
}

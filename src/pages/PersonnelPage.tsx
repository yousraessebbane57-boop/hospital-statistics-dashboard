import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  createBirthRecord,
  getBirthRecords,
  updateBirthRecord,
  getDashboardStats,
  type BirthRecord,
  type BirthRecordPayload,
} from '@/api/birthRecords';

const PERSONNEL_NAME_KEY = 'personnel_name';

const DELIVERY_OPTIONS: { value: 'normal' | 'c_section'; label: string }[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'c_section', label: 'Césarienne' },
];

const GENDER_OPTIONS: { value: 'male' | 'female'; label: string }[] = [
  { value: 'male', label: 'Garçon' },
  { value: 'female', label: 'Fille' },
];

const emptyForm: BirthRecordPayload = {
  motherName: '',
  age: 0,
  admissionDate: '',
  deliveryDate: '',
  deliveryType: 'normal',
  complications: false,
  complicationsDescription: '',
  babyGender: 'male',
  babyWeight: 0,
  apgarScore: undefined,
  responsiblePersonnel: '',
};

function formatDate(s: string) {
  if (!s) return '—';
  return new Date(s).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function PersonnelPage() {
  const [personnelName, setPersonnelName] = useState(() => localStorage.getItem(PERSONNEL_NAME_KEY) || '');
  const [tab, setTab] = useState<'add' | 'list' | 'activity'>('add');
  const [form, setForm] = useState<BirthRecordPayload>(() => ({ ...emptyForm, responsiblePersonnel: localStorage.getItem(PERSONNEL_NAME_KEY) || '' }));
  const [submitted, setSubmitted] = useState(false);
  const [records, setRecords] = useState<BirthRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<BirthRecord | null>(null);
  const [editForm, setEditForm] = useState<Partial<BirthRecordPayload>>({});
  const [myStats, setMyStats] = useState<{ total: number }>({ total: 0 });

  useEffect(() => {
    localStorage.setItem(PERSONNEL_NAME_KEY, personnelName);
    setForm((f) => ({ ...f, responsiblePersonnel: personnelName }));
  }, [personnelName]);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getBirthRecords({ search: search || undefined, page, limit: 15 });
      setRecords(res.records);
      setTotal(res.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur chargement');
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    if (tab === 'list') fetchRecords();
  }, [tab, fetchRecords]);

  const fetchMyStats = useCallback(async () => {
    if (!personnelName.trim()) return;
    try {
      const res = await getDashboardStats();
      const me = res.nurseActivity.find((n) => n.name.toLowerCase() === personnelName.trim().toLowerCase());
      setMyStats({ total: me?.records ?? 0 });
    } catch {
      setMyStats({ total: 0 });
    }
  }, [personnelName, tab]);

  useEffect(() => {
    if (tab === 'activity') fetchMyStats();
  }, [tab, fetchMyStats]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const payload = { ...form, responsiblePersonnel: form.responsiblePersonnel || personnelName || 'Personnel' };
    if (!payload.motherName || !payload.admissionDate || !payload.deliveryDate || payload.age < 1 || payload.babyWeight <= 0) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    setLoading(true);
    try {
      await createBirthRecord(payload);
      setSubmitted(true);
      setForm({ ...emptyForm, responsiblePersonnel: personnelName || '' });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editing) return;
    setError('');
    try {
      await updateBirthRecord(editing._id, editForm);
      setEditing(null);
      fetchRecords();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur mise à jour');
    }
  };

  const openEdit = (r: BirthRecord) => {
    setEditing(r);
    setEditForm({
      motherName: r.motherName,
      age: r.age,
      admissionDate: r.admissionDate.slice(0, 10),
      deliveryDate: r.deliveryDate.slice(0, 10),
      deliveryType: r.deliveryType,
      complications: r.complications,
      complicationsDescription: r.complicationsDescription || '',
      babyGender: r.babyGender,
      babyWeight: r.babyWeight,
      apgarScore: r.apgarScore,
      responsiblePersonnel: r.responsiblePersonnel,
    });
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              ← Accueil
            </Link>
            <span className="text-lg font-semibold text-slate-800">Espace personnel</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600">Connecté :</label>
            <input
              type="text"
              value={personnelName}
              onChange={(e) => setPersonnelName(e.target.value)}
              placeholder="Votre nom"
              className="w-40 rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 flex gap-2 border-b border-slate-200">
          {(['add', 'list', 'activity'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                tab === t
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-slate-600 hover:text-slate-800'
              }`}
            >
              {t === 'add' && 'Nouveau dossier'}
              {t === 'list' && 'Voir les dossiers'}
              {t === 'activity' && 'Mon activité'}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {tab === 'add' && (
          <>
            {submitted ? (
              <div className="rounded-xl border border-teal-200 bg-white p-8 shadow-sm">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-slate-800">Dossier enregistré</h2>
                  <p className="text-slate-600">
                    Les données ont été enregistrées dans la base. Le tableau de bord admin se met à jour automatiquement.
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
                    >
                      Saisir un autre dossier
                    </button>
                    <Link to="/" className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                      Retour à l'accueil
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800">Nouveau dossier d'accouchement</h2>
                <form onSubmit={handleSubmit} className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Mère (nom) *</label>
                    <input
                      required
                      value={form.motherName}
                      onChange={(e) => setForm((f) => ({ ...f, motherName: e.target.value }))}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Âge (mère) *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={120}
                      value={form.age || ''}
                      onChange={(e) => setForm((f) => ({ ...f, age: Number(e.target.value) || 0 }))}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Date d'admission *</label>
                    <input
                      type="date"
                      required
                      value={form.admissionDate || ''}
                      onChange={(e) => setForm((f) => ({ ...f, admissionDate: e.target.value }))}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Date d'accouchement *</label>
                    <input
                      type="date"
                      required
                      value={form.deliveryDate || ''}
                      onChange={(e) => setForm((f) => ({ ...f, deliveryDate: e.target.value }))}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Type d'accouchement *</label>
                    <div className="mt-2 flex gap-4">
                      {DELIVERY_OPTIONS.map((opt) => (
                        <label key={opt.value} className="flex cursor-pointer items-center gap-2">
                          <input
                            type="radio"
                            name="deliveryType"
                            value={opt.value}
                            checked={form.deliveryType === opt.value}
                            onChange={() => setForm((f) => ({ ...f, deliveryType: opt.value }))}
                            className="text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-slate-700">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700">Complications</label>
                    <div className="mt-2 flex flex-wrap items-center gap-4">
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={form.complications}
                          onChange={(e) => setForm((f) => ({ ...f, complications: e.target.checked }))}
                          className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-slate-700">Oui</span>
                      </label>
                      {form.complications && (
                        <input
                          type="text"
                          value={form.complicationsDescription || ''}
                          onChange={(e) => setForm((f) => ({ ...f, complicationsDescription: e.target.value }))}
                          placeholder="Description des complications"
                          className="flex-1 min-w-[200px] rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Sexe du bébé *</label>
                    <div className="mt-2 flex gap-4">
                      {GENDER_OPTIONS.map((opt) => (
                        <label key={opt.value} className="flex cursor-pointer items-center gap-2">
                          <input
                            type="radio"
                            name="babyGender"
                            value={opt.value}
                            checked={form.babyGender === opt.value}
                            onChange={() => setForm((f) => ({ ...f, babyGender: opt.value }))}
                            className="text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-slate-700">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Poids du bébé (kg) *</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      min="0"
                      max="10"
                      value={form.babyWeight || ''}
                      onChange={(e) => setForm((f) => ({ ...f, babyWeight: Number(e.target.value) || 0 }))}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Score Apgar (0-10)</label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={form.apgarScore ?? ''}
                      onChange={(e) => setForm((f) => ({ ...f, apgarScore: e.target.value ? Number(e.target.value) : undefined }))}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Personnel responsable *</label>
                    <input
                      type="text"
                      value={form.responsiblePersonnel}
                      onChange={(e) => setForm((f) => ({ ...f, responsiblePersonnel: e.target.value }))}
                      placeholder={personnelName || 'Votre nom'}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  <div className="sm:col-span-2 flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
                    >
                      {loading ? 'Enregistrement…' : 'Enregistrer'}
                    </button>
                    <Link to="/" className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                      Annuler
                    </Link>
                  </div>
                </form>
              </div>
            )}
          </>
        )}

        {tab === 'list' && (
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 p-4">
              <input
                type="search"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Rechercher par nom de la mère ou personnel..."
                className="flex-1 min-w-[200px] rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            {loading ? (
              <div className="p-8 text-center text-slate-500">Chargement…</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-4 py-3 text-left font-medium text-slate-700">Mère</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-700">Accouchement</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-700">Type</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-700">Bébé</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-700">Personnel</th>
                      <th className="px-4 py-3 text-right font-medium text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.length === 0 ? (
                      <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">Aucun dossier</td></tr>
                    ) : (
                      records.map((r) => (
                        <tr key={r._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="px-4 py-3">{r.motherName} ({r.age} ans)</td>
                          <td className="px-4 py-3">{formatDate(r.deliveryDate)}</td>
                          <td className="px-4 py-3">{r.deliveryType === 'c_section' ? 'Césarienne' : 'Normal'}{r.complications ? ' + compl.' : ''}</td>
                          <td className="px-4 py-3">{r.babyGender === 'male' ? 'Garçon' : 'Fille'} — {r.babyWeight} kg</td>
                          <td className="px-4 py-3">{r.responsiblePersonnel}</td>
                          <td className="px-4 py-3 text-right">
                            <button type="button" onClick={() => openEdit(r)} className="text-primary-600 hover:text-primary-700 font-medium">
                              Modifier
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
            {total > 15 && (
              <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2">
                <span className="text-sm text-slate-500">{total} dossier(s)</span>
                <div className="flex gap-2">
                  <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded border border-slate-300 px-3 py-1 text-sm disabled:opacity-50">Préc.</button>
                  <button type="button" disabled={page * 15 >= total} onClick={() => setPage((p) => p + 1)} className="rounded border border-slate-300 px-3 py-1 text-sm disabled:opacity-50">Suiv.</button>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'activity' && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800">Mon activité</h2>
            <p className="mt-1 text-sm text-slate-600">Nombre de dossiers enregistrés avec vous comme personnel responsable.</p>
            {personnelName.trim() ? (
              <div className="mt-6 flex items-center gap-4">
                <div className="rounded-xl border border-primary-100 bg-primary-50 px-8 py-6">
                  <p className="text-sm font-medium text-primary-700">Dossiers enregistrés</p>
                  <p className="text-3xl font-bold text-primary-800">{myStats.total}</p>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-slate-500">Saisissez votre nom en haut de page pour voir vos statistiques.</p>
            )}
          </div>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-800">Modifier le dossier</h3>
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700">Mère (nom)</label>
                <input
                  value={editForm.motherName || ''}
                  onChange={(e) => setEditForm((f) => ({ ...f, motherName: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Âge</label>
                  <input type="number" min={1} max={120} value={editForm.age || ''} onChange={(e) => setEditForm((f) => ({ ...f, age: Number(e.target.value) || 0 }))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Poids bébé (kg)</label>
                  <input type="number" step="0.01" value={editForm.babyWeight || ''} onChange={(e) => setEditForm((f) => ({ ...f, babyWeight: Number(e.target.value) || 0 }))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Score Apgar</label>
                <input type="number" min={0} max={10} value={editForm.apgarScore ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, apgarScore: e.target.value ? Number(e.target.value) : undefined }))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Annuler</button>
              <button type="button" onClick={handleUpdate} className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

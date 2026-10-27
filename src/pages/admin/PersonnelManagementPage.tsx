import { FormEvent, useCallback, useEffect, useState } from 'react';
import { adminApi } from '@/api/admin';
import type { AdminUser } from '@/api/admin';

type FormValues = { name: string; email: string; specialty: string; password: string };
const emptyForm: FormValues = { name: '', email: '', specialty: '', password: '' };
const inputClass = 'mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

export function PersonnelManagementPage() {
  const [people, setPeople] = useState<AdminUser[]>([]);
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadPeople = useCallback(async () => {
    setLoading(true);
    try {
      setPeople(await adminApi.personnel.list());
      setError('');
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Impossible de charger le personnel.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadPeople(); }, [loadPeople]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setError('');
    setShowForm(true);
  }

  function openEdit(person: AdminUser) {
    setEditing(person);
    setForm({ name: person.name, email: person.email, specialty: person.specialty ?? '', password: '' });
    setError('');
    setShowForm(true);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editing) {
        await adminApi.personnel.update(editing.id, {
          name: form.name, email: form.email, specialty: form.specialty, isActive: editing.isActive,
        });
        setNotice('Le compte personnel a été modifié.');
      } else {
        await adminApi.personnel.create(form);
        setNotice('Le compte personnel a été créé.');
      }
      setShowForm(false);
      await loadPeople();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Impossible d’enregistrer le compte.');
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(person: AdminUser) {
    setNotice('');
    setError('');
    try {
      await adminApi.personnel.setActive(person.id, !person.isActive);
      setNotice(`Le compte a été ${person.isActive ? 'désactivé' : 'activé'}.`);
      await loadPeople();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'Impossible de modifier l’accès.');
    }
  }

  async function remove(person: AdminUser) {
    if (!window.confirm(`Supprimer définitivement le compte de ${person.name} ?`)) return;
    setNotice('');
    setError('');
    try {
      await adminApi.personnel.remove(person.id);
      setNotice('Le compte personnel a été supprimé.');
      await loadPeople();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'Impossible de supprimer le compte.');
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-green-700">Comptes et accès</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">Gestion du personnel</h2>
          <p className="mt-1 text-slate-500">Ajoutez, modifiez et gérez les accès du personnel médical.</p>
        </div>
        <button onClick={openCreate} className="rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700">
          Ajouter un membre
        </button>
      </div>
      {error && !showForm && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {notice && <p role="status" className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">{notice}</p>}
      <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600"><tr>
            <th className="px-4 py-3 font-semibold">Nom</th><th className="px-4 py-3 font-semibold">E-mail</th>
            <th className="px-4 py-3 font-semibold">Spécialité</th><th className="px-4 py-3 font-semibold">Statut</th>
            <th className="px-4 py-3 font-semibold">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">Chargement…</td></tr>
              : people.length === 0 ? <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">Aucun membre du personnel enregistré.</td></tr>
                : people.map((person) => <tr key={person.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{person.name}</td>
                  <td className="px-4 py-3 text-slate-600">{person.email}</td>
                  <td className="px-4 py-3 text-slate-600">{person.specialty || '—'}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${person.isActive ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'}`}>{person.isActive ? 'Actif' : 'Désactivé'}</span></td>
                  <td className="px-4 py-3"><div className="flex flex-wrap gap-2">
                    <button onClick={() => openEdit(person)} className="font-medium text-blue-700 hover:underline">Modifier</button>
                    <button onClick={() => void toggleActive(person)} className="font-medium text-slate-600 hover:underline">{person.isActive ? 'Désactiver' : 'Activer'}</button>
                    <button onClick={() => void remove(person)} className="font-medium text-red-600 hover:underline">Supprimer</button>
                  </div></td>
                </tr>)}
          </tbody>
        </table>
      </div>
      {showForm && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" role="presentation">
        <section role="dialog" aria-modal="true" aria-labelledby="personnel-form-title" className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
          <h3 id="personnel-form-title" className="text-xl font-bold text-slate-900">{editing ? 'Modifier le compte' : 'Ajouter un membre du personnel'}</h3>
          <form onSubmit={submit} className="mt-5 space-y-4">
            <label className="block text-sm font-medium text-slate-700">Nom complet<input required minLength={2} maxLength={160} className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
            <label className="block text-sm font-medium text-slate-700">Adresse e-mail<input required type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
            <label className="block text-sm font-medium text-slate-700">Spécialité<input maxLength={160} className={inputClass} value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} /></label>
            {!editing && <label className="block text-sm font-medium text-slate-700">Mot de passe temporaire (12 caractères minimum)<input required minLength={12} type="password" autoComplete="new-password" className={inputClass} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>}
            {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700">Annuler</button>
              <button disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-60">{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
            </div>
          </form>
        </section>
      </div>}
    </div>
  );
}

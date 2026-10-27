import { FormEvent, useCallback, useEffect, useState } from 'react';
import { adminApi } from '@/api/admin';
import type { AdminUser } from '@/api/admin';

const fieldClass = 'mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

export function AdministratorManagementPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadAdmins = useCallback(async () => {
    setLoading(true);
    try {
      setAdmins(await adminApi.administrators.list());
      setError('');
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Impossible de charger les administrateurs.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadAdmins(); }, [loadAdmins]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await adminApi.administrators.create({ name, email, password });
      setName(''); setEmail(''); setPassword('');
      setShowForm(false);
      setNotice('Le compte administrateur a été créé.');
      await loadAdmins();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Impossible de créer ce compte.');
    } finally {
      setSaving(false);
    }
  }

  async function toggle(admin: AdminUser) {
    setError('');
    try {
      await adminApi.administrators.setActive(admin.id, !admin.isActive);
      setNotice(`Le compte a été ${admin.isActive ? 'désactivé' : 'activé'}.`);
      await loadAdmins();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'Impossible de modifier l’accès.');
    }
  }

  async function remove(admin: AdminUser) {
    if (!window.confirm(`Supprimer définitivement l’administrateur ${admin.name} ?`)) return;
    setError('');
    try {
      await adminApi.administrators.remove(admin.id);
      setNotice('Le compte administrateur a été supprimé.');
      await loadAdmins();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'Impossible de supprimer ce compte.');
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-sm font-semibold uppercase tracking-wide text-green-700">Accès privilégiés</p><h2 className="mt-1 text-2xl font-bold text-slate-900">Gestion des administrateurs</h2><p className="mt-1 text-slate-500">Seul un super-administrateur peut ajouter ou gérer ces comptes.</p></div>
        <button onClick={() => { setError(''); setShowForm(true); }} className="rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700">Ajouter un administrateur</button>
      </div>
      {error && !showForm && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {notice && <p role="status" className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">{notice}</p>}
      <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600"><tr><th className="px-4 py-3 font-semibold">Nom</th><th className="px-4 py-3 font-semibold">E-mail</th><th className="px-4 py-3 font-semibold">Rôle</th><th className="px-4 py-3 font-semibold">Statut</th><th className="px-4 py-3 font-semibold">Actions</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">Chargement…</td></tr>
              : admins.map((admin) => <tr key={admin.id} className="hover:bg-slate-50"><td className="px-4 py-3 font-medium text-slate-900">{admin.name}</td><td className="px-4 py-3 text-slate-600">{admin.email}</td><td className="px-4 py-3 text-slate-600">{admin.role === 'SUPER_ADMIN' ? 'Super-admin' : 'Admin'}</td><td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${admin.isActive ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'}`}>{admin.isActive ? 'Actif' : 'Désactivé'}</span></td><td className="px-4 py-3">{admin.role === 'ADMIN' ? <div className="flex gap-3"><button onClick={() => void toggle(admin)} className="font-medium text-slate-600 hover:underline">{admin.isActive ? 'Désactiver' : 'Activer'}</button><button onClick={() => void remove(admin)} className="font-medium text-red-600 hover:underline">Supprimer</button></div> : <span className="text-slate-400">Compte initial protégé</span>}</td></tr>)}
            {!loading && admins.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">Aucun administrateur.</td></tr>}
          </tbody>
        </table>
      </div>
      {showForm && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
        <section role="dialog" aria-modal="true" aria-labelledby="admin-form-title" className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
          <h3 id="admin-form-title" className="text-xl font-bold text-slate-900">Ajouter un administrateur</h3>
          <form onSubmit={submit} className="mt-5 space-y-4">
            <label className="block text-sm font-medium text-slate-700">Nom complet<input required minLength={2} maxLength={160} className={fieldClass} value={name} onChange={(e) => setName(e.target.value)} /></label>
            <label className="block text-sm font-medium text-slate-700">Adresse e-mail<input required type="email" className={fieldClass} value={email} onChange={(e) => setEmail(e.target.value)} /></label>
            <label className="block text-sm font-medium text-slate-700">Mot de passe temporaire (12 caractères minimum)<input required minLength={12} type="password" autoComplete="new-password" className={fieldClass} value={password} onChange={(e) => setPassword(e.target.value)} /></label>
            {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700">Annuler</button><button disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-60">{saving ? 'Enregistrement…' : 'Créer le compte'}</button></div>
          </form>
        </section>
      </div>}
    </div>
  );
}

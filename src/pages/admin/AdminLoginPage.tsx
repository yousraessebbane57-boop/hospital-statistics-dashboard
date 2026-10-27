import { FormEvent, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useAdminAuth } from '@/context/AdminAuthContext';

export function AdminLoginPage() {
  const { user, loading, login } = useAdminAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accessRole = searchParams.get('role') === 'personnel' ? 'personnel' : 'admin';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <div className="p-10 text-center text-slate-500">Vérification de la session…</div>;
  if (user) return <Navigate to={user.role === 'PERSONNEL' ? '/personnel' : '/admin'} replace />;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const sessionUser = await login(email, password);
      navigate(sessionUser.role === 'PERSONNEL' ? '/personnel' : '/admin', { replace: true });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Connexion impossible.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <section className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="bg-green-600 px-8 py-7 text-white">
          <p className="text-sm font-semibold uppercase tracking-wide text-green-100">Plateforme hospitalière</p>
          <h1 className="mt-2 text-2xl font-bold">Connexion {accessRole === 'personnel' ? 'du personnel' : 'administrateur'}</h1>
          <p className="mt-1 text-sm text-green-50">Accédez à votre espace sécurisé avec votre compte.</p>
        </div>
        <form className="space-y-5 p-8" onSubmit={submit}>
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
            <Link to="/connexion?role=personnel" className={`rounded-lg px-3 py-2 text-center text-sm font-semibold ${accessRole === 'personnel' ? 'bg-white text-green-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>Personnel</Link>
            <Link to="/connexion?role=admin" className={`rounded-lg px-3 py-2 text-center text-sm font-semibold ${accessRole === 'admin' ? 'bg-white text-green-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>Administrateur</Link>
          </div>
          <label className="block text-sm font-medium text-slate-700">
            Adresse e-mail
            <input
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Mot de passe
            <input
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <button
            disabled={submitting}
            className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-wait disabled:opacity-60"
            type="submit"
          >
            {submitting ? 'Connexion…' : 'Se connecter'}
          </button>
          <Link className="block text-center text-sm font-medium text-green-700 hover:underline" to="/">
            Retour à l’accueil
          </Link>
        </form>
      </section>
    </main>
  );
}

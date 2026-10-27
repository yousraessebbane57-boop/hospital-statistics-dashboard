import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/context/AdminAuthContext';

/** Top navbar for the admin dashboard. Displays app title and user/actions area. */
export function Navbar() {
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();

  async function signOut() {
    await logout();
    navigate('/admin/login', { replace: true });
  }

  return (
    <header className="sticky top-0 z-30 flex min-h-14 flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-2 shadow-sm lg:px-6">
      <h1 className="text-lg font-semibold text-slate-800">
        Tableau de bord admin — Statistiques hospitalières
      </h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-600">
          {user?.name} <span className="text-slate-400">({user?.role === 'SUPER_ADMIN' ? 'Super-admin' : 'Admin'})</span>
        </span>
        <Link
          to="/personnel"
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Espace personnel
        </Link>
        <button onClick={() => void signOut()} className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700">
          Déconnexion
        </button>
      </div>
    </header>
  );
}

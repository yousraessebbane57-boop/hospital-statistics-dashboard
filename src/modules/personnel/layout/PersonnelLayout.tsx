import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/context/AdminAuthContext';

/** Sidebar pour l'espace personnel : formulaire, statistiques, import, base patients */
const NAV_ITEMS = [
  { to: '/personnel', end: true, label: 'Formulaire accouchement' },
  { to: '/personnel/statistiques', end: false, label: 'Statistiques générées' },
  { to: '/personnel/rapport', end: false, label: 'Générer rapport et diagramme' },
  { to: '/personnel/import', end: false, label: 'Importer des données' },
  { to: '/personnel/patients', end: false, label: 'Base patients' },
] as const;

export function PersonnelLayout() {
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();

  async function signOut() {
    await logout();
    navigate('/', { replace: true });
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <div className="bg-green-600 px-4 py-2.5 text-center text-sm font-medium text-white">
        Session personnel — Tableau de bord personnel
      </div>
      <header className="sticky top-0 z-30 flex h-14 items-center border-b border-slate-200 bg-white px-4 shadow-sm lg:px-6">
        <h1 className="text-lg font-semibold text-slate-800">
          Tableau de bord personnel — Statistiques hospitalières
        </h1>
        {user?.role !== 'PERSONNEL' && (
          <Link to="/admin" className="ml-auto rounded-lg border border-green-200 px-3 py-1.5 text-sm font-medium text-green-700 hover:bg-green-50">
            Espace admin
          </Link>
        )}
        <button onClick={() => void signOut()} className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-green-700">
          Déconnexion
        </button>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="flex w-56 flex-col border-r border-slate-200 bg-white">
          <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Navigation personnel">
            {NAV_ITEMS.map(({ to, end, label }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }: { isActive: boolean }) =>
                  `rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? 'bg-green-50 text-green-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

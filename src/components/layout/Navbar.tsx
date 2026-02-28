import { Link } from 'react-router-dom';

/** Top navbar for the admin dashboard. Displays app title and user/actions area. */
export function Navbar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm lg:px-6">
      <h1 className="text-lg font-semibold text-slate-800">
        Tableau de bord admin — Statistiques hospitalières
      </h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500" aria-hidden>
          Session admin
        </span>
        <Link
          to="/"
          className="rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50"
        >
          Espace infirmier
        </Link>
      </div>
    </header>
  );
}

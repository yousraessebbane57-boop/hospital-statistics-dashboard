import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] backdrop-blur supports-[backdrop-filter]:bg-white/90">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8" aria-label="Navigation principale">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <img
            src="/chu-logo.png"
            alt="CHU Souss Massa"
            className="h-14 w-auto max-w-[260px] flex-shrink-0 object-contain sm:h-16 sm:max-w-[320px] md:h-[72px] md:max-w-[380px]"
          />
          <span className="truncate text-base font-semibold text-slate-800 sm:text-lg">
            Système de Gestion Hospitalière
          </span>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
          <Link
            to="/staff"
            className="inline-flex items-center justify-center rounded-lg border-2 border-primary-500 bg-transparent px-4 py-2 text-sm font-semibold text-primary-600 transition-all duration-200 hover:border-primary-600 hover:bg-primary-50 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:px-5 sm:py-2.5"
          >
            Connexion Personnel
          </Link>
          <Link
            to="/admin"
            className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:px-5 sm:py-2.5"
          >
            Connexion Administrateur
          </Link>
        </div>
      </nav>
    </header>
  );
}

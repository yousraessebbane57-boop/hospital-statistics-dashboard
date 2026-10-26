import { NavLink } from 'react-router-dom';

/** Sidebar navigation links. Active route is highlighted. */
const NAV_ITEMS = [
  { to: '/admin', end: true, label: 'Statistiques générées' },
  { to: '/admin/import', end: false, label: 'Importer des données' },
  { to: '/admin/patients', end: false, label: 'Base patients' },
] as const;

export function Sidebar() {
  return (
    <aside className="flex w-56 flex-col border-r border-slate-200 bg-white">
      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Navigation principale">
        {NAV_ITEMS.map(({ to, end, label }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }: { isActive: boolean }) =>
              `rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

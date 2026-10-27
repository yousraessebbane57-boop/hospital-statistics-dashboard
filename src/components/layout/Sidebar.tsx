import { NavLink } from 'react-router-dom';

/** Sidebar navigation links. Active route is highlighted. */
interface SidebarProps {
  role: 'ADMIN' | 'SUPER_ADMIN';
}

export function Sidebar({ role }: SidebarProps) {
  const navItems = [
    { to: '/admin', end: true, label: 'Vue générale' },
    { to: '/admin/personnel', end: false, label: 'Gestion du personnel' },
    ...(role === 'SUPER_ADMIN' ? [{ to: '/admin/administrateurs', end: false, label: 'Administrateurs' }] : []),
  ];

  return (
    <aside className="w-full shrink-0 border-b border-slate-200 bg-white sm:flex sm:w-60 sm:flex-col sm:border-b-0 sm:border-r">
      <nav className="flex flex-row gap-1 overflow-x-auto p-2 sm:flex-1 sm:flex-col sm:p-3" aria-label="Navigation principale">
        {navItems.map(({ to, end, label }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }: { isActive: boolean }) =>
              `rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-green-50 text-green-700'
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

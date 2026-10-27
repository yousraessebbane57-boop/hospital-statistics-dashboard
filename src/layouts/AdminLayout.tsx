import { Navigate, Outlet } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAdminAuth } from '@/context/AdminAuthContext';

/**
 * Admin layout: top navbar + sidebar + main content.
 * Desktop-first; sidebar can be collapsed on small screens (future enhancement).
 */
export function AdminLayout() {
  const { user, loading } = useAdminAuth();

  if (loading) return <div className="p-10 text-center text-slate-500">Vérification de la session…</div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (user.role === 'PERSONNEL') return <Navigate to="/personnel" replace />;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <div className="bg-green-600 px-4 py-2 text-center text-sm font-medium text-white">
        Espace administrateur — Gestion de la plateforme hospitalière
      </div>
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar role={user.role} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { adminApi } from '@/api/admin';
import type { AdminSessionUser } from '@/api/admin';

interface AdminAuthContextValue {
  user: AdminSessionUser | null;
  loading: boolean;
  login: (email: string, password: string, accessRole: 'admin' | 'personnel') => Promise<AdminSessionUser>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminSessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.me()
      .then(({ user: sessionUser }) => setUser(sessionUser))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string, accessRole: 'admin' | 'personnel') => {
    const { user: sessionUser } = await adminApi.login(email, password, accessRole);
    setUser(sessionUser);
    return sessionUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await adminApi.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading, login, logout]);
  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth doit être utilisé dans AdminAuthProvider.');
  return context;
}

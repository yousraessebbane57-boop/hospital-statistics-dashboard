const API_BASE = import.meta.env.VITE_API_URL || '';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'PERSONNEL' | 'ADMIN' | 'SUPER_ADMIN';
  specialty: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface AdminSessionUser {
  id: string;
  name: string;
  email: string;
  role: 'PERSONNEL' | 'ADMIN' | 'SUPER_ADMIN';
}

export interface DashboardStats {
  personnel: number;
  activePersonnel: number;
  administrators: number;
  births: number;
  birthsThisMonth: number;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}/api/admin${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(body.error || 'Une erreur est survenue.');
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

const json = (data: unknown): RequestInit => ({
  method: 'POST',
  body: JSON.stringify(data),
});

export const adminApi = {
  login: (email: string, password: string) =>
    request<{ user: AdminSessionUser }>('/auth/login', json({ email, password })),
  logout: () => request<void>('/auth/logout', { method: 'POST' }),
  me: () => request<{ user: AdminSessionUser }>('/auth/me'),
  dashboard: () => request<DashboardStats>('/dashboard'),
  personnel: {
    list: () => request<AdminUser[]>('/personnel'),
    create: (data: { name: string; email: string; password: string; specialty: string }) =>
      request<AdminUser>('/personnel', json(data)),
    update: (id: string, data: { name: string; email: string; specialty: string; isActive: boolean }) =>
      request<AdminUser>(`/personnel/${id}`, { ...json(data), method: 'PATCH' }),
    setActive: (id: string, isActive: boolean) =>
      request(`/personnel/${id}/status`, { ...json({ isActive }), method: 'PATCH' }),
    remove: (id: string) => request<void>(`/personnel/${id}`, { method: 'DELETE' }),
  },
  administrators: {
    list: () => request<AdminUser[]>('/administrators'),
    create: (data: { name: string; email: string; password: string }) =>
      request<AdminUser>('/administrators', json(data)),
    setActive: (id: string, isActive: boolean) =>
      request(`/administrators/${id}/status`, { ...json({ isActive }), method: 'PATCH' }),
    remove: (id: string) => request<void>(`/administrators/${id}`, { method: 'DELETE' }),
  },
};

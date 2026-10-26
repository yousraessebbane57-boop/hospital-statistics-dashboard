const BIRTH_RECORDS_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const MATERNITY_BASE = import.meta.env.VITE_MATERNITY_API_URL || 'http://localhost:3001';

async function request<T>(base: string, path: string, options: RequestInit = {}): Promise<T> {
  const url = path.startsWith('http') ? path : `${base}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

async function requestMaternity(path: string, options: RequestInit = {}) {
  return request<unknown>(MATERNITY_BASE, path, options);
}

export const api = {
  get: <T>(path: string) => request<T>(BIRTH_RECORDS_BASE, path),
  post: <T>(path: string, body: unknown) =>
    request<T>(BIRTH_RECORDS_BASE, path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(BIRTH_RECORDS_BASE, path, { method: 'PUT', body: JSON.stringify(body) }),
  accouchements: {
    list: (params?: { dateFrom?: string; dateTo?: string }) => {
      const q = new URLSearchParams();
      if (params?.dateFrom) q.set('dateFrom', params.dateFrom);
      if (params?.dateTo) q.set('dateTo', params.dateTo);
      const query = q.toString();
      return requestMaternity(`/api/accouchements${query ? `?${query}` : ''}`);
    },
    create: (data: Record<string, unknown>) =>
      requestMaternity('/api/accouchements', { method: 'POST', body: JSON.stringify(data) }),
    importFile: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${MATERNITY_BASE}/api/accouchements/import`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || res.statusText);
      }
      return res.json();
    },
  },
  rapports: {
    list: () => requestMaternity('/api/rapports'),
    create: (data: Record<string, unknown>) =>
      requestMaternity('/api/rapports', { method: 'POST', body: JSON.stringify(data) }),
  },
  health: () => requestMaternity('/api/health'),
};

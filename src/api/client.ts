/**
 * Client API pour le backend (PostgreSQL via Express).
 * Base URL : VITE_API_URL ou http://localhost:3001
 */
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function fetchApi(path: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${path}`;
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

export const api = {
  /** Accouchements (formulaire + import) */
  accouchements: {
    list: (params?: { dateFrom?: string; dateTo?: string }) => {
      const q = new URLSearchParams();
      if (params?.dateFrom) q.set('dateFrom', params.dateFrom);
      if (params?.dateTo) q.set('dateTo', params.dateTo);
      const suffix = q.toString() ? `?${q.toString()}` : '';
      return fetchApi(`/api/accouchements${suffix}`);
    },
    create: (data: Record<string, unknown>) =>
      fetchApi('/api/accouchements', { method: 'POST', body: JSON.stringify(data) }),
    /** Import CSV/Excel : envoie le fichier, les lignes sont insérées en base et visibles dans Base patients */
    importFile: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const url = `${BASE_URL}/api/accouchements/import`;
      const res = await fetch(url, { method: 'POST', body: formData });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || res.statusText);
      }
      return res.json();
    },
  },
  /** Rapports (imports / statistiques générées) */
  rapports: {
    list: () => fetchApi('/api/rapports'),
    create: (data: Record<string, unknown>) =>
      fetchApi('/api/rapports', { method: 'POST', body: JSON.stringify(data) }),
  },
  health: () => fetchApi('/api/health'),
};

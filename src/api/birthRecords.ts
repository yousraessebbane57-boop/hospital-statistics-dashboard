import { api } from './client';

export interface BirthRecordPayload {
  motherName: string;
  age: number;
  admissionDate: string;
  deliveryDate: string;
  deliveryType: 'normal' | 'c_section';
  complications: boolean;
  complicationsDescription?: string;
  babyGender: 'male' | 'female';
  babyWeight: number;
  apgarScore?: number;
  responsiblePersonnel: string;
}

export interface BirthRecord extends BirthRecordPayload {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListResponse {
  records: BirthRecord[];
  total: number;
  page: number;
  limit: number;
}

export interface DashboardStats {
  kpis: {
    totalPregnancies: number;
    totalBirths: number;
    cSectionRate: number;
    complicationRate: number;
    bedOccupancy: number;
    totalBoys: number;
    totalGirls: number;
  };
  monthlyData: Array<{
    yearMonth: string;
    month: string;
    births: number;
    normal: number;
    c_section: number;
    complications: number;
    boys: number;
    girls: number;
  }>;
  deliveryTypes: Array<{ name: string; value: number; color: string }>;
  genderData: Array<{ name: string; value: number; color: string }>;
  nurseActivity: Array<{ name: string; records: number; month: string }>;
  bedOccupancyData: Array<{ name: string; value: number; color: string }>;
}

export function createBirthRecord(data: BirthRecordPayload) {
  return api.post<BirthRecord>('/birth-records', data);
}

export function getBirthRecords(params?: {
  search?: string;
  page?: number;
  limit?: number;
  personnel?: string;
}) {
  const sp = new URLSearchParams();
  if (params?.search) sp.set('search', params.search);
  if (params?.page) sp.set('page', String(params.page));
  if (params?.limit) sp.set('limit', String(params.limit));
  if (params?.personnel) sp.set('personnel', params.personnel);
  const q = sp.toString();
  return api.get<ListResponse>(`/birth-records${q ? `?${q}` : ''}`);
}

export function getBirthRecordById(id: string) {
  return api.get<BirthRecord>(`/birth-records/${id}`);
}

export function updateBirthRecord(id: string, data: Partial<BirthRecordPayload>) {
  return api.put<BirthRecord>(`/birth-records/${id}`, data);
}

export function getDashboardStats(params?: { from?: string; to?: string }) {
  const sp = new URLSearchParams();
  if (params?.from) sp.set('from', params.from);
  if (params?.to) sp.set('to', params.to);
  const q = sp.toString();
  return api.get<DashboardStats>(`/birth-records/stats/dashboard${q ? `?${q}` : ''}`);
}

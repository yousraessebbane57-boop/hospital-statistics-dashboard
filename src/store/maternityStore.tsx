import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { monthlyBirthsData, type MonthlyBirthRecord } from '@/data/maternityData';

const STORAGE_KEY = 'maternity_birth_records';

export type DeliveryType = 'normal' | 'c_section' | 'complication';
export type Gender = 'male' | 'female';

export interface BirthRecord {
  id: string;
  date: string; // ISO date
  deliveryType: DeliveryType;
  gender: Gender;
  nurseName: string;
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Expand static monthly data into individual records for initial seed */
function seedFromMonthlyData(): BirthRecord[] {
  const records: BirthRecord[] = [];
  let id = 1;
  monthlyBirthsData.forEach((row, monthIndex) => {
    const year = 2024;
    const dateBase = `${year}-${String(monthIndex + 1).padStart(2, '0')}-`;
    for (let i = 0; i < row.normal; i++) {
      records.push({
        id: `seed-${id++}`,
        date: `${dateBase}${String((i % 28) + 1).padStart(2, '0')}`,
        deliveryType: 'normal',
        gender: i % 2 === 0 ? 'male' : 'female',
        nurseName: 'Données initiales',
      });
    }
    for (let i = 0; i < row.c_section; i++) {
      records.push({
        id: `seed-${id++}`,
        date: `${dateBase}${String((i % 28) + 1).padStart(2, '0')}`,
        deliveryType: 'c_section',
        gender: i % 2 === 0 ? 'male' : 'female',
        nurseName: 'Données initiales',
      });
    }
    for (let i = 0; i < row.complications; i++) {
      records.push({
        id: `seed-${id++}`,
        date: `${dateBase}${String((i % 28) + 1).padStart(2, '0')}`,
        deliveryType: 'complication',
        gender: i % 2 === 0 ? 'male' : 'female',
        nurseName: 'Données initiales',
      });
    }
  });
  return records;
}

function loadRecords(): BirthRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedFromMonthlyData();
    const parsed = JSON.parse(raw) as BirthRecord[];
    if (!Array.isArray(parsed) || parsed.length === 0) return seedFromMonthlyData();
    return parsed;
  } catch {
    return seedFromMonthlyData();
  }
}

function saveRecords(records: BirthRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export interface MonthlyBirthRecordWithKey extends MonthlyBirthRecord {
  yearMonth: string; // "2024-0" .. "2024-11" for filtering
}

/** Aggregate raw records into monthly stats for charts */
function aggregateMonthly(records: BirthRecord[]): MonthlyBirthRecordWithKey[] {
  const byKey: Record<string, { normal: number; c_section: number; complications: number; boys: number; girls: number }> = {};
  records.forEach((r) => {
    const d = new Date(r.date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!byKey[key]) {
      byKey[key] = { normal: 0, c_section: 0, complications: 0, boys: 0, girls: 0 };
    }
    const bucket = byKey[key];
    if (r.deliveryType === 'normal') bucket.normal += 1;
    else if (r.deliveryType === 'c_section') bucket.c_section += 1;
    else bucket.complications += 1;
    if (r.gender === 'male') bucket.boys += 1;
    else bucket.girls += 1;
  });
  const sortedKeys = Object.keys(byKey).sort();
  return sortedKeys.map((key) => {
    const [y, m] = key.split('-').map(Number);
    const b = byKey[key];
    const births = b.normal + b.c_section + b.complications;
    return {
      yearMonth: key,
      month: MONTH_LABELS[m],
      births,
      normal: b.normal,
      c_section: b.c_section,
      complications: b.complications,
      boys: b.boys,
      girls: b.girls,
    };
  });
}

export interface NurseActivityRecord {
  name: string;
  records: number;
  month: string;
}

function aggregateNurseActivity(records: BirthRecord[]): NurseActivityRecord[] {
  const byName: Record<string, number> = {};
  records.forEach((r) => {
    const name = r.nurseName || 'Non renseigné';
    byName[name] = (byName[name] || 0) + 1;
  });
  return Object.entries(byName)
    .map(([name, records]) => ({ name, records, month: '' }))
    .sort((a, b) => b.records - a.records)
    .slice(0, 10);
}

interface MaternityContextValue {
  birthRecords: BirthRecord[];
  monthlyData: MonthlyBirthRecordWithKey[];
  nurseActivity: NurseActivityRecord[];
  addBirthRecord: (record: Omit<BirthRecord, 'id'>) => void;
}

const MaternityContext = createContext<MaternityContextValue | null>(null);

export function MaternityProvider({ children }: { children: ReactNode }) {
  const [birthRecords, setBirthRecords] = useState<BirthRecord[]>(() => loadRecords());

  useEffect(() => {
    saveRecords(birthRecords);
  }, [birthRecords]);

  const addBirthRecord = useCallback((record: Omit<BirthRecord, 'id'>) => {
    const id = `rec-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setBirthRecords((prev) => [...prev, { ...record, id }]);
  }, []);

  const monthlyData = useMemo(() => aggregateMonthly(birthRecords), [birthRecords]);
  const nurseActivity = useMemo(() => aggregateNurseActivity(birthRecords), [birthRecords]);

  const value = useMemo(
    () => ({ birthRecords, monthlyData, nurseActivity, addBirthRecord }),
    [birthRecords, monthlyData, nurseActivity, addBirthRecord]
  );

  return <MaternityContext.Provider value={value}>{children}</MaternityContext.Provider>;
}

export function useMaternity() {
  const ctx = useContext(MaternityContext);
  if (!ctx) throw new Error('useMaternity must be used within MaternityProvider');
  return ctx;
}

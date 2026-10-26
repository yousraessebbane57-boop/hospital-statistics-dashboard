/**
 * Mock data for Gynecology & Maternity Admin Dashboard
 */

export interface MonthlyBirthRecord {
  month: string;
  births: number;
  normal: number;
  c_section: number;
  complications: number;
  boys: number;
  girls: number;
}

export interface NurseActivityRecord {
  name: string;
  records: number;
  month: string;
}

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const monthlyBirthsData: MonthlyBirthRecord[] = [
  { month: 'Jan', births: 45, normal: 30, c_section: 12, complications: 3, boys: 24, girls: 21 },
  { month: 'Feb', births: 52, normal: 35, c_section: 14, complications: 3, boys: 27, girls: 25 },
  { month: 'Mar', births: 48, normal: 32, c_section: 13, complications: 3, boys: 26, girls: 22 },
  { month: 'Apr', births: 61, normal: 42, c_section: 15, complications: 4, boys: 32, girls: 29 },
  { month: 'May', births: 55, normal: 38, c_section: 14, complications: 3, boys: 29, girls: 26 },
  { month: 'Jun', births: 58, normal: 40, c_section: 15, complications: 3, boys: 31, girls: 27 },
  { month: 'Jul', births: 62, normal: 43, c_section: 16, complications: 3, boys: 33, girls: 29 },
  { month: 'Aug', births: 59, normal: 41, c_section: 15, complications: 3, boys: 31, girls: 28 },
  { month: 'Sep', births: 56, normal: 39, c_section: 14, complications: 3, boys: 30, girls: 26 },
  { month: 'Oct', births: 64, normal: 44, c_section: 17, complications: 3, boys: 34, girls: 30 },
  { month: 'Nov', births: 51, normal: 35, c_section: 13, complications: 3, boys: 27, girls: 24 },
  { month: 'Dec', births: 47, normal: 31, c_section: 13, complications: 3, boys: 25, girls: 22 },
];

export const nurseActivityData: NurseActivityRecord[] = [
  { name: 'Nurse A', records: 142, month: 'Dec' },
  { name: 'Nurse B', records: 118, month: 'Dec' },
  { name: 'Nurse C', records: 95, month: 'Dec' },
  { name: 'Nurse D', records: 88, month: 'Dec' },
  { name: 'Nurse E', records: 76, month: 'Dec' },
];

/** Aggregated KPIs from monthly data (current period) */
export function getMaternityKpis(data: MonthlyBirthRecord[]) {
  const totalBirths = data.reduce((s, d) => s + d.births, 0);
  const totalNormal = data.reduce((s, d) => s + d.normal, 0);
  const totalCsection = data.reduce((s, d) => s + d.c_section, 0);
  const totalComplications = data.reduce((s, d) => s + d.complications, 0);
  const totalBoys = data.reduce((s, d) => s + d.boys, 0);
  const totalGirls = data.reduce((s, d) => s + d.girls, 0);
  const totalPregnancies = totalBirths + Math.floor(totalBirths * 0.15); // mock: active pregnancies ~15% of births
  const cSectionRate = totalBirths > 0 ? (totalCsection / totalBirths) * 100 : 0;
  const complicationRate = totalBirths > 0 ? (totalComplications / totalBirths) * 100 : 0;
  const bedOccupancy = 78.5; // mock fixed %
  return {
    totalPregnancies,
    totalBirths,
    cSectionRate,
    complicationRate,
    bedOccupancy,
    totalBoys,
    totalGirls,
    totalNormal,
    totalCsection,
    totalComplications,
  };
}

/** Delivery types for Pie chart */
export function getDeliveryTypesData(data: MonthlyBirthRecord[]) {
  const t = data.reduce(
    (acc, d) => ({
      normal: acc.normal + d.normal,
      c_section: acc.c_section + d.c_section,
      complications: acc.complications + d.complications,
    }),
    { normal: 0, c_section: 0, complications: 0 }
  );
  return [
    { name: 'Normal', value: t.normal, color: '#14b8a6' },
    { name: 'C-Section', value: t.c_section, color: '#0ea5e9' },
    { name: 'Complications', value: t.complications, color: '#f59e0b' },
  ];
}

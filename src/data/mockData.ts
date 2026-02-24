import type { MonthlyDataPoint, ServiceActivityData } from '@/types';

export const monthlyDeliveriesData: MonthlyDataPoint[] = [
  { month: 'Janv.', value: 142, deliveries: 142 },
  { month: 'Févr.', value: 138, deliveries: 138 },
  { month: 'Mars', value: 156, deliveries: 156 },
  { month: 'Avr.', value: 149, deliveries: 149 },
  { month: 'Mai', value: 163, deliveries: 163 },
  { month: 'Juin', value: 158, deliveries: 158 },
  { month: 'Juil.', value: 171, deliveries: 171 },
  { month: 'Août', value: 165, deliveries: 165 },
  { month: 'Sept.', value: 152, deliveries: 152 },
  { month: 'Oct.', value: 168, deliveries: 168 },
  { month: 'Nov.', value: 161, deliveries: 161 },
  { month: 'Déc.', value: 155, deliveries: 155 },
];

export const serviceActivityData: ServiceActivityData[] = [
  { name: 'Obstétrique', count: 1842, fill: '#0d9488' },
  { name: 'Chirurgie', count: 1256, fill: '#0284c7' },
  { name: 'Urgences', count: 2103, fill: '#0ea5e9' },
  { name: 'Pédiatrie', count: 987, fill: '#2dd4bf' },
  { name: 'Médecine interne', count: 1456, fill: '#38bdf8' },
];

export const dashboardStats = {
  totalDeliveriesCurrentYear: 1778,
  monthlyAdmissions: 1247,
  cesareanRate: 24.3,
  bedOccupancyRate: 82.5,
};

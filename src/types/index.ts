export interface MonthlyDataPoint {
  month: string;
  value: number;
  deliveries?: number;
}

export interface ServiceActivityData {
  name: string;
  count: number;
  fill?: string;
}

export interface StatCardData {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export type DateFilterOption = 'year' | 'month' | 'custom';

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

// --- Admin Dashboard types ---

/** Data type for a generated statistical report (e.g. Accouchement, Hospitalisation, Urgences) */
export type ReportDataType = 'Accouchement' | 'Hospitalisation' | 'Urgences' | 'Autre';

/** Summary statistics displayed on a report card */
export interface ReportSummaryStats {
  label: string;
  value: string | number;
  unit?: string;
}

/** Chart data attached to a report (for bar/line/pie) */
export interface ReportChartData {
  type: 'bar' | 'line' | 'pie';
  title: string;
  data: MonthlyDataPoint[] | ServiceActivityData[] | { name: string; value: number }[];
}

/** Full generated report stored in "Generated Statistics" */
export interface GeneratedReport {
  id: string;
  generatedAt: string; // ISO date
  dataType: ReportDataType;
  title: string;
  summaryStats: ReportSummaryStats[];
  charts: ReportChartData[];
  /** Textual report content (e.g. for PDF export - mocked) */
  textReport?: string;
}

/** Patient record for Accouchement (childbirth) domain — formulaire complet à valeur médicale */
export interface PatientAccouchement {
  id: string;
  patientId: string;
  cin: string;
  /** Âge de la mère */
  age: number;
  deliveryType: 'normal' | 'cesarean';
  admissionDate: string;
  deliveryDate: string;
  /** Durée du travail (ex. "2h30" ou "45 min") */
  laborDuration?: string;
  complications: boolean;
  /** Description des complications si oui */
  complicationsDescription?: string;
  /** Sexe du nouveau-né */
  babySex?: 'M' | 'F';
  /** Poids du bébé en grammes */
  babyWeightG?: number;
  /** Score Apgar à 1 minute (0-10) */
  apgar1?: number;
  /** Score Apgar à 5 minutes (0-10) */
  apgar5?: number;
  /** Médecin responsable */
  responsibleDoctor?: string;
  /** Personnel soignant responsable (sage-femme, personnel soignant, etc.) */
  responsibleStaff?: string;
}

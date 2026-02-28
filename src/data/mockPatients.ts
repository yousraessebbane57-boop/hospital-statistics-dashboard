import type { PatientAccouchement } from '@/types';

/** Mock patient records for Accouchement (childbirth) - used in Patients Database page */
export const MOCK_PATIENTS_ACCOUCHEMENT: PatientAccouchement[] = [
  { id: '1', patientId: 'PAT-2025-001', cin: 'AB123456', age: 28, deliveryType: 'normal', admissionDate: '2025-02-01T08:00:00.000Z', deliveryDate: '2025-02-01T14:32:00.000Z', complications: false },
  { id: '2', patientId: 'PAT-2025-002', cin: 'AB123457', age: 34, deliveryType: 'cesarean', admissionDate: '2025-02-01T10:15:00.000Z', deliveryDate: '2025-02-01T12:45:00.000Z', complications: false },
  { id: '3', patientId: 'PAT-2025-003', cin: 'AB123458', age: 22, deliveryType: 'normal', admissionDate: '2025-02-02T02:20:00.000Z', deliveryDate: '2025-02-02T06:10:00.000Z', complications: true },
  { id: '4', patientId: 'PAT-2025-004', cin: 'AB123459', age: 31, deliveryType: 'normal', admissionDate: '2025-02-02T14:00:00.000Z', deliveryDate: '2025-02-02T22:15:00.000Z', complications: false },
  { id: '5', patientId: 'PAT-2025-005', cin: 'AB123460', age: 29, deliveryType: 'cesarean', admissionDate: '2025-02-03T07:30:00.000Z', deliveryDate: '2025-02-03T09:00:00.000Z', complications: false },
  { id: '6', patientId: 'PAT-2025-006', cin: 'AB123461', age: 26, deliveryType: 'normal', admissionDate: '2025-02-03T18:45:00.000Z', deliveryDate: '2025-02-04T01:20:00.000Z', complications: false },
  { id: '7', patientId: 'PAT-2025-007', cin: 'AB123462', age: 38, deliveryType: 'cesarean', admissionDate: '2025-02-04T09:00:00.000Z', deliveryDate: '2025-02-04T10:30:00.000Z', complications: true },
  { id: '8', patientId: 'PAT-2025-008', cin: 'AB123463', age: 24, deliveryType: 'normal', admissionDate: '2025-02-05T11:00:00.000Z', deliveryDate: '2025-02-05T16:45:00.000Z', complications: false },
  { id: '9', patientId: 'PAT-2025-009', cin: 'AB123464', age: 33, deliveryType: 'normal', admissionDate: '2025-02-06T03:00:00.000Z', deliveryDate: '2025-02-06T08:30:00.000Z', complications: false },
  { id: '10', patientId: 'PAT-2025-010', cin: 'AB123465', age: 27, deliveryType: 'cesarean', admissionDate: '2025-02-06T14:20:00.000Z', deliveryDate: '2025-02-06T15:50:00.000Z', complications: false },
  { id: '11', patientId: 'PAT-2025-011', cin: 'AB123466', age: 30, deliveryType: 'normal', admissionDate: '2025-02-07T20:00:00.000Z', deliveryDate: '2025-02-08T02:15:00.000Z', complications: false },
  { id: '12', patientId: 'PAT-2025-012', cin: 'AB123467', age: 25, deliveryType: 'normal', admissionDate: '2025-02-08T08:30:00.000Z', deliveryDate: '2025-02-08T12:00:00.000Z', complications: true },
  { id: '13', patientId: 'PAT-2025-013', cin: 'AB123468', age: 35, deliveryType: 'cesarean', admissionDate: '2025-02-09T06:00:00.000Z', deliveryDate: '2025-02-09T07:45:00.000Z', complications: false },
  { id: '14', patientId: 'PAT-2025-014', cin: 'AB123469', age: 23, deliveryType: 'normal', admissionDate: '2025-02-10T15:00:00.000Z', deliveryDate: '2025-02-10T19:30:00.000Z', complications: false },
  { id: '15', patientId: 'PAT-2025-015', cin: 'AB123470', age: 32, deliveryType: 'normal', admissionDate: '2025-02-11T01:00:00.000Z', deliveryDate: '2025-02-11T05:20:00.000Z', complications: false },
];

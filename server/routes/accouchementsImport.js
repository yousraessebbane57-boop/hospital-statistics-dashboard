import { Router } from 'express';
import multer from 'multer';
import { parse } from 'csv-parse/sync';
import XLSX from 'xlsx';
import { query } from '../db.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
const router = Router();

/** Convert date string "2025-02-01 08:00" to ISO */
function toIsoDate(s) {
  if (!s || typeof s !== 'string') return null;
  const t = s.trim().replace(' ', 'T');
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(t)) {
    const d = new Date(t);
    return isNaN(d.getTime()) ? null : d.toISOString();
  }
  return null;
}

/** Map a row (object with keys matching CSV/Excel headers) to DB values */
function mapRowToDb(row) {
  const complications = String(row.complications || '').toLowerCase().trim() === 'oui';
  return {
    patientId: String(row.patientId || row.patient_id || '').trim() || null,
    cin: String(row.cin || '').trim() || null,
    age: row.age != null && row.age !== '' ? parseInt(String(row.age), 10) : null,
    deliveryType: String(row.deliveryType || row.delivery_type || '').trim().toLowerCase() || null,
    admissionDate: toIsoDate(row.admissionDate || row.admission_date),
    deliveryDate: toIsoDate(row.deliveryDate || row.delivery_date),
    laborDuration: String(row.laborDuration || row.labor_duration || '').trim() || null,
    complications,
    complicationsDescription: complications ? (String(row.complicationsDescription || row.complications_description || '').trim() || null) : null,
    babySex: ['M', 'F'].includes(String(row.babySex || row.baby_sex || '').trim().toUpperCase()) ? String(row.babySex || row.baby_sex).trim().toUpperCase() : null,
    babyWeightG: row.babyWeightG != null && row.babyWeightG !== '' ? parseInt(String(row.babyWeightG).replace(/\s/g, ''), 10) : null,
    apgar1: row.apgar1 != null && row.apgar1 !== '' ? parseInt(String(row.apgar1), 10) : null,
    apgar5: row.apgar5 != null && row.apgar5 !== '' ? parseInt(String(row.apgar5), 10) : null,
    responsibleDoctor: String(row.responsibleDoctor || row.responsible_doctor || '').trim() || null,
    responsibleStaff: String(row.responsibleStaff || row.responsible_staff || '').trim() || null,
  };
}

/** Insert one row into accouchements */
async function insertRow(r) {
  if (!r.patientId || !r.cin || r.age == null || !r.deliveryType || !r.admissionDate || !r.deliveryDate) return false;
  await query(
    `INSERT INTO accouchements (
      patient_id, cin, age, delivery_type, admission_date, delivery_date,
      labor_duration, complications, complications_description,
      baby_sex, baby_weight_g, apgar_1, apgar_5,
      responsible_doctor, responsible_staff
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
    [
      r.patientId, r.cin, r.age, r.deliveryType, r.admissionDate, r.deliveryDate,
      r.laborDuration, r.complications, r.complicationsDescription,
      r.babySex, r.babyWeightG, r.apgar1, r.apgar5,
      r.responsibleDoctor, r.responsibleStaff,
    ]
  );
  return true;
}

/** POST /api/accouchements/import — upload CSV or XLSX, parse and insert into accouchements */
router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier envoyé.' });
  }
  const ext = (req.file.originalname || '').toLowerCase().slice(req.file.originalname.lastIndexOf('.'));
  if (!['.csv', '.xlsx'].includes(ext)) {
    return res.status(400).json({ error: 'Format accepté : .csv ou .xlsx' });
  }

  let rows = [];
  try {
    if (ext === '.csv') {
      const text = req.file.buffer.toString('utf-8');
      const parsed = parse(text, {
        columns: true,
        delimiter: ';',
        skip_empty_lines: true,
        trim: true,
        relax_column_count: true,
      });
      rows = Array.isArray(parsed) ? parsed : [];
    } else {
      const wb = XLSX.read(req.file.buffer, { type: 'buffer' });
      const sh = wb.Sheets[wb.SheetNames[0]];
      if (!sh) {
        return res.status(400).json({ error: 'Feuille vide.' });
      }
      rows = XLSX.utils.sheet_to_json(sh, { defval: '' });
    }
  } catch (err) {
    console.error('Parse file', err);
    return res.status(400).json({ error: 'Impossible de lire le fichier. Vérifiez le format (CSV : séparateur ;).' });
  }

  let inserted = 0;
  const errors = [];
  for (let i = 0; i < rows.length; i++) {
    const r = mapRowToDb(rows[i]);
    try {
      const ok = await insertRow(r);
      if (ok) inserted++;
    } catch (e) {
      errors.push(`Ligne ${i + 2}: ${e.message || 'erreur'}`);
    }
  }

  res.status(200).json({
    count: inserted,
    total: rows.length,
    errors: errors.length > 0 ? errors.slice(0, 10) : undefined,
    message: `${inserted} enregistrement(s) importé(s) dans la base patients.`,
  });
});

export default router;

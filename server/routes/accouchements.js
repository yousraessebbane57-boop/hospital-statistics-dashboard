import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

/** POST /api/accouchements — enregistrer un accouchement (formulaire) */
router.post('/', async (req, res) => {
  try {
    const {
      patientId,
      cin,
      age,
      deliveryType,
      admissionDate,
      deliveryDate,
      laborDuration,
      complications,
      complicationsDescription,
      babySex,
      babyWeightG,
      apgar1,
      apgar5,
      responsibleDoctor,
      responsibleStaff,
    } = req.body;

    if (!patientId || !cin || age == null || !deliveryType || !admissionDate || !deliveryDate) {
      return res.status(400).json({
        error: 'Champs obligatoires manquants: patientId, cin, age, deliveryType, admissionDate, deliveryDate',
      });
    }

    const result = await query(
      `INSERT INTO accouchements (
        patient_id, cin, age, delivery_type, admission_date, delivery_date,
        labor_duration, complications, complications_description,
        baby_sex, baby_weight_g, apgar_1, apgar_5,
        responsible_doctor, responsible_staff
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING id, patient_id, cin, age, delivery_type, admission_date, delivery_date,
        labor_duration, complications, complications_description,
        baby_sex, baby_weight_g, apgar_1, apgar_5,
        responsible_doctor, responsible_staff, created_at`,
      [
        patientId,
        cin,
        Number(age),
        deliveryType,
        admissionDate,
        deliveryDate,
        laborDuration || null,
        Boolean(complications),
        complicationsDescription || null,
        babySex || null,
        babyWeightG ?? null,
        apgar1 != null ? Number(apgar1) : null,
        apgar5 != null ? Number(apgar5) : null,
        responsibleDoctor || null,
        responsibleStaff || null,
      ]
    );

    const row = result.rows[0];
    res.status(201).json({
      id: row.id,
      patientId: row.patient_id,
      cin: row.cin,
      age: row.age,
      deliveryType: row.delivery_type,
      admissionDate: row.admission_date,
      deliveryDate: row.delivery_date,
      laborDuration: row.labor_duration,
      complications: row.complications,
      complicationsDescription: row.complications_description,
      babySex: row.baby_sex,
      babyWeightG: row.baby_weight_g,
      apgar1: row.apgar_1,
      apgar5: row.apgar_5,
      responsibleDoctor: row.responsible_doctor,
      responsibleStaff: row.responsible_staff,
      createdAt: row.created_at,
    });
  } catch (err) {
    console.error('POST /api/accouchements', err);
    res.status(500).json({ error: 'Erreur serveur lors de l\'enregistrement.' });
  }
});

/** GET /api/accouchements — liste des accouchements. Optionnel : dateFrom, dateTo (YYYY-MM-DD) pour filtrer par période. */
router.get('/', async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;
    let sql = `SELECT id, patient_id, cin, age, delivery_type, admission_date, delivery_date,
              labor_duration, complications, complications_description,
              baby_sex, baby_weight_g, apgar_1, apgar_5,
              responsible_doctor, responsible_staff, created_at
       FROM accouchements`;
    const params = [];
    if (dateFrom && dateTo) {
      params.push(String(dateFrom).slice(0, 10), String(dateTo).slice(0, 10));
      sql += ` WHERE (delivery_date AT TIME ZONE 'UTC')::date >= $1 AND (delivery_date AT TIME ZONE 'UTC')::date <= $2`;
    }
    sql += ` ORDER BY delivery_date DESC`;
    const result = await query(sql, params.length ? params : []);

    const rows = result.rows.map((row) => ({
      id: row.id,
      patientId: row.patient_id,
      cin: row.cin,
      age: row.age,
      deliveryType: row.delivery_type,
      admissionDate: row.admission_date,
      deliveryDate: row.delivery_date,
      laborDuration: row.labor_duration,
      complications: row.complications,
      complicationsDescription: row.complications_description,
      babySex: row.baby_sex,
      babyWeightG: row.baby_weight_g,
      apgar1: row.apgar_1,
      apgar5: row.apgar_5,
      responsibleDoctor: row.responsible_doctor,
      responsibleStaff: row.responsible_staff,
      createdAt: row.created_at,
    }));

    res.json(rows);
  } catch (err) {
    console.error('GET /api/accouchements', err);
    res.status(500).json({ error: 'Erreur serveur lors de la lecture.' });
  }
});

export default router;

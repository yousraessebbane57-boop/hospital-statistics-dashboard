import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

/** GET /api/rapports/statistics/accouchements?mois=YYYY-MM — statistiques complètes des accouchements */
router.get('/statistics/accouchements', async (req, res) => {
  try {
    const { mois } = req.query;
    let whereClause = '';
    let params = [];

    // Filter by month if provided
    if (mois) {
      whereClause = 'WHERE DATE_TRUNC(\'month\', delivery_date) = $1::date';
      params = [mois + '-01'];
    }

    // Requête SQL optimisée pour les statistiques
    const statsResult = await query(
      `SELECT
        COUNT(DISTINCT id) as total,
        SUM(CASE WHEN delivery_type = 'cesarean' THEN 1 ELSE 0 END) as cesariennes,
        SUM(CASE WHEN delivery_type = 'normal' THEN 1 ELSE 0 END) as voie_basse,
        SUM(CASE WHEN complications = true THEN 1 ELSE 0 END) as complications_count,
        SUM(CASE WHEN baby_sex = 'M' THEN 1 ELSE 0 END) as garcons,
        SUM(CASE WHEN baby_sex = 'F' THEN 1 ELSE 0 END) as filles,
        AVG(baby_weight_g) as poids_moyen,
        ROUND(100.0 * SUM(CASE WHEN complications = true THEN 1 ELSE 0 END) / COUNT(*), 2) as taux_complications,
        ROUND(100.0 * SUM(CASE WHEN delivery_type = 'cesarean' THEN 1 ELSE 0 END) / COUNT(*), 2) as taux_cesarienne,
        AVG(apgar_1) as apgar_moyen_1min,
        AVG(apgar_5) as apgar_moyen_5min
      FROM accouchements
      ${whereClause}`,
      params
    );

    const stats = statsResult.rows[0];

    // Données par semaine (pour graphique)
    const weeklyResult = await query(
      `SELECT
        DATE_TRUNC('week', delivery_date)::date as week_start,
        TO_CHAR(DATE_TRUNC('week', delivery_date), 'W') as week_number,
        COUNT(*) as deliveries
      FROM accouchements
      ${whereClause}
      GROUP BY DATE_TRUNC('week', delivery_date)
      ORDER BY week_start`,
      params
    );

    // Données de complications
    const complicationsResult = await query(
      `SELECT complications_description, COUNT(*) as count
      FROM accouchements
      WHERE complications = true ${whereClause ? 'AND ' + whereClause.substring(6) : ''}
      GROUP BY complications_description
      ORDER BY count DESC`,
      params
    );

    // Données par sexe et type
    const typeResult = await query(
      `SELECT delivery_type, COUNT(*) as count
      FROM accouchements
      ${whereClause}
      GROUP BY delivery_type`,
      params
    );

    res.json({
      summary: {
        total: parseInt(stats.total || 0),
        cesariennes: parseInt(stats.cesariennes || 0),
        voie_basse: parseInt(stats.voie_basse || 0),
        complications_count: parseInt(stats.complications_count || 0),
        garcons: parseInt(stats.garcons || 0),
        filles: parseInt(stats.filles || 0),
        poids_moyen: Math.round(stats.poids_moyen || 0),
        taux_complications: parseFloat(stats.taux_complications || 0),
        taux_cesarienne: parseFloat(stats.taux_cesarienne || 0),
        apgar_moyen_1min: parseFloat(stats.apgar_moyen_1min || 0),
        apgar_moyen_5min: parseFloat(stats.apgar_moyen_5min || 0),
      },
      weekly: weeklyResult.rows,
      complications: complicationsResult.rows,
      types: typeResult.rows,
    });
  } catch (err) {
    console.error('GET /api/rapports/statistics/accouchements', err);
    res.status(500).json({ error: 'Erreur serveur lors du calcul des statistiques.' });
  }
});

/** POST /api/rapports — enregistrer un rapport (après import ou génération) */
router.post('/', async (req, res) => {
  try {
    const { generatedAt, dataType, title, summaryStats, charts, textReport, source } = req.body;

    if (!generatedAt || !dataType || !title) {
      return res.status(400).json({
        error: 'Champs obligatoires manquants: generatedAt, dataType, title',
      });
    }

    const result = await query(
      `INSERT INTO rapports (generated_at, data_type, title, summary_stats, charts, text_report, source)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, generated_at, data_type, title, summary_stats, charts, text_report, source, created_at`,
      [
        generatedAt,
        dataType,
        title,
        JSON.stringify(summaryStats || []),
        JSON.stringify(charts || []),
        textReport || null,
        source || 'import',
      ]
    );

    const row = result.rows[0];
    res.status(201).json({
      id: row.id,
      generatedAt: row.generated_at,
      dataType: row.data_type,
      title: row.title,
      summaryStats: row.summary_stats,
      charts: row.charts,
      textReport: row.text_report,
      source: row.source,
      createdAt: row.created_at,
    });
  } catch (err) {
    console.error('POST /api/rapports', err);
    res.status(500).json({ error: 'Erreur serveur lors de l\'enregistrement du rapport.' });
  }
});

/** GET /api/rapports — liste des rapports (pour la page Statistiques générées) */
router.get('/', async (req, res) => {
  try {
    const result = await query(
      `SELECT id, generated_at, data_type, title, summary_stats, charts, text_report, source, created_at
       FROM rapports
       ORDER BY generated_at DESC`
    );

    const rows = result.rows.map((row) => ({
      id: row.id,
      generatedAt: row.generated_at,
      dataType: row.data_type,
      title: row.title,
      summaryStats: row.summary_stats,
      charts: row.charts,
      textReport: row.text_report,
      source: row.source,
      createdAt: row.created_at,
    }));

    res.json(rows);
  } catch (err) {
    console.error('GET /api/rapports', err);
    res.status(500).json({ error: 'Erreur serveur lors de la lecture des rapports.' });
  }
});

export default router;

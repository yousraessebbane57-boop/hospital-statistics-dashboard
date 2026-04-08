import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function cleanDatabase() {
  try {
    console.log('🗑️  Nettoyage de la base de données...\n');

    // Delete all rapports (reports)
    console.log('📋 Suppression des rapports...');
    const rapportsResult = await pool.query('DELETE FROM rapports');
    console.log(`   ✅ ${rapportsResult.rowCount} rapport(s) supprimé(s)\n`);

    // Delete all accouchements (deliveries)
    console.log('👶 Suppression des accouchements...');
    const accouchementsResult = await pool.query('DELETE FROM accouchements');
    console.log(`   ✅ ${accouchementsResult.rowCount} accouchement(s) supprimé(s)\n`);

    console.log('✨ Base de données réinitialisée avec succès!\n');
    
    // Show remaining counts
    const rapportsCount = await pool.query('SELECT COUNT(*) FROM rapports');
    const accouchementsCount = await pool.query('SELECT COUNT(*) FROM accouchements');
    
    console.log('📊 État actuel:');
    console.log(`   • Rapports: ${rapportsCount.rows[0].count}`);
    console.log(`   • Accouchements: ${accouchementsCount.rows[0].count}\n`);

    await pool.end();
  } catch (err) {
    console.error('❌ Erreur lors du nettoyage:', err.message);
    await pool.end();
    process.exit(1);
  }
}

cleanDatabase();

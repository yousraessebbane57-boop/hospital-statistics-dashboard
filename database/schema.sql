-- ============================================================
-- Base de données : Statistiques hospitalières (Accouchements)
-- PostgreSQL
-- ============================================================
-- Créer la base : créée manuellement ou via createdb
-- Puis exécuter ce script : psql -U postgres -d hospital_stats -f database/schema.sql
-- ============================================================

-- Table des accouchements (données du formulaire)
CREATE TABLE IF NOT EXISTS accouchements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id VARCHAR(50) NOT NULL,
  cin VARCHAR(30) NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 1 AND age <= 120),
  delivery_type VARCHAR(20) NOT NULL CHECK (delivery_type IN ('normal', 'cesarean')),
  admission_date TIMESTAMPTZ NOT NULL,
  delivery_date TIMESTAMPTZ NOT NULL,
  labor_duration VARCHAR(50),
  complications BOOLEAN NOT NULL DEFAULT FALSE,
  complications_description TEXT,
  baby_sex CHAR(1) CHECK (baby_sex IN ('M', 'F')),
  baby_weight_g INTEGER CHECK (baby_weight_g IS NULL OR (baby_weight_g >= 500 AND baby_weight_g <= 6000)),
  apgar_1 SMALLINT CHECK (apgar_1 IS NULL OR (apgar_1 >= 0 AND apgar_1 <= 10)),
  apgar_5 SMALLINT CHECK (apgar_5 IS NULL OR (apgar_5 >= 0 AND apgar_5 <= 10)),
  responsible_doctor VARCHAR(200),
  responsible_staff VARCHAR(200),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_accouchements_patient_id ON accouchements(patient_id);
CREATE INDEX IF NOT EXISTS idx_accouchements_cin ON accouchements(cin);
CREATE INDEX IF NOT EXISTS idx_accouchements_delivery_date ON accouchements(delivery_date);
CREATE INDEX IF NOT EXISTS idx_accouchements_created_at ON accouchements(created_at);

COMMENT ON TABLE accouchements IS 'Enregistrements du formulaire d''accouchement (espace personnel)';

-- ============================================================
-- Table des rapports générés (imports + statistiques générées)
-- ============================================================
CREATE TABLE IF NOT EXISTS rapports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generated_at TIMESTAMPTZ NOT NULL,
  data_type VARCHAR(50) NOT NULL,
  title VARCHAR(500) NOT NULL,
  summary_stats JSONB NOT NULL DEFAULT '[]',
  charts JSONB NOT NULL DEFAULT '[]',
  text_report TEXT,
  source VARCHAR(50) DEFAULT 'import',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rapports_generated_at ON rapports(generated_at);
CREATE INDEX IF NOT EXISTS idx_rapports_data_type ON rapports(data_type);
CREATE INDEX IF NOT EXISTS idx_rapports_created_at ON rapports(created_at);

COMMENT ON TABLE rapports IS 'Rapports statistiques générés (import fichier ou génération)';

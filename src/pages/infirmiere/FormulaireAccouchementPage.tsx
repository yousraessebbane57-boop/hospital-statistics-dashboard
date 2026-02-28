import { useState } from 'react';
import type { PatientAccouchement } from '@/types';

const formCardClass = 'rounded-xl border border-slate-200 bg-white p-6 shadow-card';
const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';
const labelClass = 'block text-sm font-medium text-slate-700';

/**
 * Formulaire d'accouchement complet à valeur médicale :
 * informations mère, bébé, responsables.
 */
export function FormulaireAccouchementPage() {
  const [patientId, setPatientId] = useState('');
  const [cin, setCin] = useState('');
  const [age, setAge] = useState('');
  const [admissionDate, setAdmissionDate] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryType, setDeliveryType] = useState<'normal' | 'cesarean'>('normal');
  const [laborDuration, setLaborDuration] = useState('');
  const [complications, setComplications] = useState(false);
  const [complicationsDescription, setComplicationsDescription] = useState('');
  const [babySex, setBabySex] = useState<'M' | 'F' | ''>('');
  const [babyWeightKg, setBabyWeightKg] = useState('');
  const [apgar1, setApgar1] = useState('');
  const [apgar5, setApgar5] = useState('');
  const [responsibleDoctor, setResponsibleDoctor] = useState('');
  const [responsibleStaff, setResponsibleStaff] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const resetForm = () => {
    setPatientId('');
    setCin('');
    setAge('');
    setAdmissionDate('');
    setDeliveryDate('');
    setDeliveryType('normal');
    setLaborDuration('');
    setComplications(false);
    setComplicationsDescription('');
    setBabySex('');
    setBabyWeightKg('');
    setApgar1('');
    setApgar5('');
    setResponsibleDoctor('');
    setResponsibleStaff('');
    setMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const ageNum = parseInt(age, 10);
    if (!patientId.trim()) {
      setMessage({ type: 'error', text: 'Veuillez saisir l\'identifiant patient.' });
      return;
    }
    if (!cin.trim()) {
      setMessage({ type: 'error', text: 'Veuillez saisir le CIN du patient.' });
      return;
    }
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      setMessage({ type: 'error', text: 'Veuillez saisir un âge valide (1–120).' });
      return;
    }
    if (!admissionDate || !deliveryDate) {
      setMessage({ type: 'error', text: 'Veuillez saisir les dates d\'admission et d\'accouchement.' });
      return;
    }
    const apgar1Num = apgar1 === '' ? undefined : parseInt(apgar1, 10);
    const apgar5Num = apgar5 === '' ? undefined : parseInt(apgar5, 10);
    if (apgar1Num !== undefined && (apgar1Num < 0 || apgar1Num > 10)) {
      setMessage({ type: 'error', text: 'Score Apgar à 1 min doit être entre 0 et 10.' });
      return;
    }
    if (apgar5Num !== undefined && (apgar5Num < 0 || apgar5Num > 10)) {
      setMessage({ type: 'error', text: 'Score Apgar à 5 min doit être entre 0 et 10.' });
      return;
    }
    const weightKg = babyWeightKg === '' ? undefined : parseFloat(babyWeightKg.replace(',', '.'));
    if (weightKg !== undefined && (weightKg < 0.5 || weightKg > 6)) {
      setMessage({ type: 'error', text: 'Poids du bébé doit être entre 0,5 et 6 kg.' });
      return;
    }

    const admissionIso = new Date(admissionDate).toISOString();
    const deliveryIso = new Date(deliveryDate).toISOString();

    const record: Omit<PatientAccouchement, 'id'> = {
      patientId: patientId.trim(),
      cin: cin.trim(),
      age: ageNum,
      deliveryType,
      admissionDate: admissionIso,
      deliveryDate: deliveryIso,
      laborDuration: laborDuration.trim() || undefined,
      complications,
      complicationsDescription: complications ? complicationsDescription.trim() || undefined : undefined,
      babySex: babySex === '' ? undefined : babySex,
      babyWeightG: weightKg !== undefined ? Math.round(weightKg * 1000) : undefined,
      apgar1: apgar1Num,
      apgar5: apgar5Num,
      responsibleDoctor: responsibleDoctor.trim() || undefined,
      responsibleStaff: responsibleStaff.trim() || undefined,
    };

    console.log('Formulaire accouchement soumis (mock):', { ...record, id: `PAT-${Date.now()}` });
    setMessage({
      type: 'success',
      text: 'Accouchement enregistré (simulation). En production, les données seraient envoyées au serveur.',
    });
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Formulaire d'accouchement</h2>
        <p className="mt-1 text-slate-600">
          Saisie complète des informations médicales : mère, nouveau-né et responsables. Les champs marqués d'un astérisque sont obligatoires.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ——— Informations de la mère ——— */}
        <div className={formCardClass}>
          <h3 className="mb-4 text-lg font-semibold text-slate-800">Informations de la mère</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="patientId" className={labelClass}>
                Identifiant patient <span className="text-red-500">*</span>
              </label>
              <input
                id="patientId"
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="ex. PAT-2025-001"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="cin" className={labelClass}>
                CIN du patient <span className="text-red-500">*</span>
              </label>
              <input
                id="cin"
                type="text"
                value={cin}
                onChange={(e) => setCin(e.target.value)}
                placeholder="ex. AB123456"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="age" className={labelClass}>
                Âge <span className="text-red-500">*</span>
              </label>
              <input
                id="age"
                type="number"
                min={1}
                max={120}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="ex. 28"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="admissionDate" className={labelClass}>
                Date d'admission <span className="text-red-500">*</span>
              </label>
              <input
                id="admissionDate"
                type="datetime-local"
                value={admissionDate}
                onChange={(e) => setAdmissionDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="deliveryDate" className={labelClass}>
                Date d'accouchement <span className="text-red-500">*</span>
              </label>
              <input
                id="deliveryDate"
                type="datetime-local"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Type d'accouchement <span className="text-red-500">*</span></label>
              <div className="mt-2 flex gap-4">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="deliveryType"
                    checked={deliveryType === 'normal'}
                    onChange={() => setDeliveryType('normal')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">Voie basse (normal)</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="deliveryType"
                    checked={deliveryType === 'cesarean'}
                    onChange={() => setDeliveryType('cesarean')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">Césarienne</span>
                </label>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="laborDuration" className={labelClass}>Durée du travail</label>
              <input
                id="laborDuration"
                type="text"
                value={laborDuration}
                onChange={(e) => setLaborDuration(e.target.value)}
                placeholder="ex. 2h30, 45 min"
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={complications}
                  onChange={(e) => setComplications(e.target.checked)}
                  className="rounded border-slate-300 text-green-600 focus:ring-green-500"
                />
                <span className={labelClass}>Complications (oui/non)</span>
              </label>
              {complications && (
                <div className="mt-2">
                  <label htmlFor="complicationsDescription" className="text-sm text-slate-600">
                    Description des complications
                  </label>
                  <textarea
                    id="complicationsDescription"
                    rows={3}
                    value={complicationsDescription}
                    onChange={(e) => setComplicationsDescription(e.target.value)}
                    placeholder="Décrire la nature des complications..."
                    className={inputClass}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ——— Informations du bébé ——— */}
        <div className={formCardClass}>
          <h3 className="mb-4 text-lg font-semibold text-slate-800">Informations du bébé</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Sexe du bébé</label>
              <div className="mt-2 flex gap-4">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="babySex"
                    checked={babySex === 'M'}
                    onChange={() => setBabySex('M')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">Masculin</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="babySex"
                    checked={babySex === 'F'}
                    onChange={() => setBabySex('F')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">Féminin</span>
                </label>
              </div>
            </div>
            <div>
              <label htmlFor="babyWeightKg" className={labelClass}>Poids du bébé (kg)</label>
              <input
                id="babyWeightKg"
                type="text"
                inputMode="decimal"
                value={babyWeightKg}
                onChange={(e) => setBabyWeightKg(e.target.value)}
                placeholder="ex. 3,250"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="apgar1" className={labelClass}>Score Apgar à 1 min (0-10)</label>
              <input
                id="apgar1"
                type="number"
                min={0}
                max={10}
                value={apgar1}
                onChange={(e) => setApgar1(e.target.value)}
                placeholder="0-10"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="apgar5" className={labelClass}>Score Apgar à 5 min (0-10)</label>
              <input
                id="apgar5"
                type="number"
                min={0}
                max={10}
                value={apgar5}
                onChange={(e) => setApgar5(e.target.value)}
                placeholder="0-10"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* ——— Responsables ——— */}
        <div className={formCardClass}>
          <h3 className="mb-4 text-lg font-semibold text-slate-800">Responsables</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="responsibleDoctor" className={labelClass}>Médecin responsable</label>
              <input
                id="responsibleDoctor"
                type="text"
                value={responsibleDoctor}
                onChange={(e) => setResponsibleDoctor(e.target.value)}
                placeholder="ex. Dr. Nom Prénom"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="responsibleStaff" className={labelClass}>Personnel responsable</label>
              <input
                id="responsibleStaff"
                type="text"
                value={responsibleStaff}
                onChange={(e) => setResponsibleStaff(e.target.value)}
                placeholder="ex. Sage-femme, infirmier(ère)"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {message && (
          <div
            role="alert"
            className={`rounded-lg px-4 py-3 text-sm ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Enregistrer l'accouchement
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Réinitialiser
          </button>
        </div>
      </form>
    </div>
  );
}

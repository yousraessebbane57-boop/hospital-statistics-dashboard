import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMaternity, type DeliveryType, type Gender } from '@/store/maternityStore';

const DELIVERY_OPTIONS: { value: DeliveryType; label: string }[] = [
  { value: 'normal', label: 'Accouchement normal' },
  { value: 'c_section', label: 'Césarienne' },
  { value: 'complication', label: 'Complication' },
];

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Garçon' },
  { value: 'female', label: 'Fille' },
];

export function StaffFormPage() {
  const { addBirthRecord } = useMaternity();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    deliveryType: 'normal' as DeliveryType,
    gender: 'male' as Gender,
    nurseName: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBirthRecord({
      date: form.date,
      deliveryType: form.deliveryType,
      gender: form.gender,
      nurseName: form.nurseName.trim() || 'Personnel',
    });
    setSubmitted(true);
    setForm({
      date: new Date().toISOString().slice(0, 10),
      deliveryType: 'normal',
      gender: 'male',
      nurseName: form.nurseName.trim() || '',
    });
  };

  if (submitted) {
    return (
      <div className="mx-auto min-h-screen max-w-lg bg-slate-50 px-4 py-12">
        <div className="rounded-xl border border-teal-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-teal-600">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-800">Enregistrement enregistré</h2>
            <p className="text-slate-600">
              Les données ont été enregistrées dans la base. Le tableau de bord administrateur se met à jour automatiquement.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
              >
                Saisir un autre enregistrement
              </button>
              <Link
                to="/"
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-slate-50 px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <Link to="/" className="text-sm font-medium text-primary-600 hover:text-primary-700">
          ← Retour à l'accueil
        </Link>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
          Saisie d'un accouchement
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Formulaire réservé au personnel. Les données sont enregistrées et visibles sur le tableau de bord admin.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-slate-700">
              Date de l'accouchement
            </label>
            <input
              id="date"
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Type d'accouchement</label>
            <div className="mt-2 space-y-2">
              {DELIVERY_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="deliveryType"
                    value={opt.value}
                    checked={form.deliveryType === opt.value}
                    onChange={() => setForm((f) => ({ ...f, deliveryType: opt.value }))}
                    className="border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-slate-700">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Sexe du nouveau-né</label>
            <div className="mt-2 flex gap-4">
              {GENDER_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="gender"
                    value={opt.value}
                    checked={form.gender === opt.value}
                    onChange={() => setForm((f) => ({ ...f, gender: opt.value }))}
                    className="border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-slate-700">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="nurseName" className="block text-sm font-medium text-slate-700">
              Nom de l'infirmier(ère) (optionnel)
            </label>
            <input
              id="nurseName"
              type="text"
              value={form.nurseName}
              onChange={(e) => setForm((f) => ({ ...f, nurseName: e.target.value }))}
              placeholder="Ex. Fatima Z."
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Enregistrer
            </button>
            <Link
              to="/"
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Annuler
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

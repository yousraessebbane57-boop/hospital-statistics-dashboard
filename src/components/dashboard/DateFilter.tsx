import { useRef } from 'react';

export type DateFilterMode = 'day' | 'month' | 'year';

interface DateFilterProps {
  from: string;
  to: string;
  mode: DateFilterMode;
  onFromChange: (v: string) => void;
  onToChange: (v: string) => void;
  onModeChange: (m: DateFilterMode) => void;
}

export function DateFilter({
  from,
  to,
  mode,
  onFromChange,
  onToChange,
  onModeChange,
}: DateFilterProps) {
  const fromId = useRef(`date-from-${Math.random().toString(36).slice(2)}`).current;
  const toId = useRef(`date-to-${Math.random().toString(36).slice(2)}`).current;

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <span className="text-sm font-medium text-slate-700">Période :</span>
      <div className="flex flex-wrap items-center gap-2">
        {(['day', 'month', 'year'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onModeChange(m)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
              mode === m ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {m === 'day' ? 'Jour' : m === 'month' ? 'Mois' : 'Année'}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor={fromId} className="text-sm text-slate-600">
          Du
        </label>
        <input
          id={fromId}
          type="date"
          value={from}
          onChange={(e) => onFromChange(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
        <label htmlFor={toId} className="text-sm text-slate-600">
          au
        </label>
        <input
          id={toId}
          type="date"
          value={to}
          onChange={(e) => onToChange(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>
    </div>
  );
}

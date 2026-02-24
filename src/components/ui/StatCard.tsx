import type { StatCardData } from '@/types';

interface StatCardProps {
  data: StatCardData;
  className?: string;
}

export function StatCard({ data, className = '' }: StatCardProps) {
  const trendColors = {
    up: 'text-teal-600',
    down: 'text-red-600',
    neutral: 'text-slate-500',
  };
  const trendColor = data.trend ? trendColors[data.trend] : '';

  return (
    <div
      className={`rounded-xl bg-white p-5 shadow-card border border-slate-100 transition-shadow hover:shadow-soft ${className}`}
    >
      <p className="text-sm font-medium text-slate-500">{data.label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-slate-800">
          {typeof data.value === 'number'
            ? data.value.toLocaleString('fr-FR')
            : data.value}
        </span>
        {data.unit && (
          <span className="text-sm text-slate-500">{data.unit}</span>
        )}
      </div>
      {data.trendValue && (
        <p className={`mt-1 text-sm font-medium ${trendColor}`}>
          {data.trendValue}
        </p>
      )}
    </div>
  );
}

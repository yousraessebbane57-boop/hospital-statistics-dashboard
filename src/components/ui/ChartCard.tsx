import type { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function ChartCard({ title, children, className = '' }: ChartCardProps) {
  return (
    <div
      className={`rounded-xl bg-white p-5 shadow-card border border-slate-100 overflow-hidden ${className}`}
    >
      <h3 className="text-base font-semibold text-slate-800 mb-4">{title}</h3>
      <div className="min-h-[220px] flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

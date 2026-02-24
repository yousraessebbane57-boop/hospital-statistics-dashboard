import type { ReactNode } from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  className?: string;
}

export function FeatureCard({
  title,
  description,
  icon,
  className = '',
}: FeatureCardProps) {
  return (
    <div
      className={`rounded-xl bg-white p-6 shadow-card border border-slate-100 transition-all hover:shadow-soft hover:border-primary-100 ${className}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-800">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}

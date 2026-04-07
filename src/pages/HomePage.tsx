import { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { StatCard } from '@/components/ui/StatCard';
import { ChartCard } from '@/components/ui/ChartCard';
import { FeatureCard } from '@/components/ui/FeatureCard';
import {
  SecureDataIcon,
  DatabaseIcon,
  ReportsIcon,
  SecurityIcon,
} from '@/components/icons/FeatureIcons';
import {
  monthlyDeliveriesData,
  serviceActivityData,
  dashboardStats,
} from '@/data/mockData';
import type { DateFilterOption } from '@/types';

const DATE_FILTER_OPTIONS: { value: DateFilterOption; label: string }[] = [
  { value: 'year', label: 'Cette année' },
  { value: 'month', label: 'Ce mois' },
  { value: 'custom', label: 'Plage personnalisée' },
];

export function HomePage() {
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('year');

  const statCards = [
    {
      label: 'Total des accouchements (année en cours)',
      value: dashboardStats.totalDeliveriesCurrentYear,
      trend: 'up' as const,
      trendValue: '+5,2 % par rapport à l\'année dernière',
    },
    {
      label: 'Entrées mensuelles',
      value: dashboardStats.monthlyAdmissions,
      trend: 'neutral' as const,
      trendValue: 'Mois en cours',
    },
    {
      label: 'Taux de césariennes',
      value: dashboardStats.cesareanRate,
      unit: '%',
      trend: 'down' as const,
      trendValue: '-1,1 % par rapport à l\'année dernière',
    },
    {
      label: 'Taux d\'occupation des lits',
      value: dashboardStats.bedOccupancyRate,
      unit: '%',
      trend: 'up' as const,
      trendValue: 'Objectif : 85 %',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-white to-slate-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Plateforme d'analyse et de gestion des statistiques hospitalières
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Centralisation sécurisée des données, tableaux de bord interactifs et
            indicateurs en temps réel pour la direction. Suivez les tendances,
            pilotez les indicateurs clés et prenez des décisions éclairées.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/admin"
              className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 text-base font-semibold text-white shadow-soft transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Connexion (Tableau de bord admin)
            </a>
            <a
              href="/personnel"
              className="inline-flex items-center justify-center rounded-lg border-2 border-primary-600 bg-white px-6 py-3 text-base font-semibold text-primary-600 transition-colors hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Espace personnel — Formulaire accouchement
            </a>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8" id="features">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            Fonctionnalités clés
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
            Tout pour gérer et analyser les statistiques hospitalières en toute
            sécurité.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              title="Saisie sécurisée des données"
              description="Saisie via formulaires web ou import en masse (CSV/Excel). Données validées et chiffrées à la saisie."
              icon={<SecureDataIcon />}
            />
            <FeatureCard
              title="Base de données centralisée"
              description="Source unique pour toutes les statistiques médicales. Fiable, traçable et toujours disponible."
              icon={<DatabaseIcon />}
            />
            <FeatureCard
              title="Rapports statistiques dynamiques"
              description="Indicateurs et graphiques générés automatiquement par période. Accouchements, entrées et tendances."
              icon={<ReportsIcon />}
            />
            <FeatureCard
              title="Accès et sécurité par rôles"
              description="Rôles admin, direction, service et saisie. Journal d'audit complet pour la conformité."
              icon={<SecurityIcon />}
            />
          </div>
        </div>
      </section>

      {/* Statistics Preview / Dashboard Preview */}
      <section
        className="bg-white px-4 py-16 shadow-sm sm:px-6 lg:px-8"
        id="dashboard-demo"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Aperçu des statistiques
              </h2>
              <p className="mt-1 text-slate-600">
                Exemples d'indicateurs et de graphiques du tableau de bord.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label
                htmlFor="date-filter"
                className="text-sm font-medium text-slate-700"
              >
                Période
              </label>
              <select
                id="date-filter"
                value={dateFilter}
                onChange={(e) =>
                  setDateFilter(e.target.value as DateFilterOption)
                }
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                {DATE_FILTER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((data) => (
              <StatCard key={data.label} data={data} />
            ))}
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <ChartCard title="Accouchements mensuels">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart
                  data={monthlyDeliveriesData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickFormatter={(v) => v.toString()}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                    }}
                    formatter={(value: number) => [value, 'Accouchements']}
                    labelFormatter={(label) => `Mois : ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="deliveries"
                    name="Accouchements"
                    stroke="#0d9488"
                    strokeWidth={2}
                    dot={{ fill: '#0d9488', strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#0f766e' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Comparaison de l'activité par service">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={serviceActivityData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={55}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                    }}
                    formatter={(value: number) => [value, 'Entrées']}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '12px' }}
                    formatter={() => 'Entrées'}
                  />
                  <Bar
                    dataKey="count"
                    name="Entrées"
                    radius={[0, 4, 4, 0]}
                    maxBarSize={32}
                  >
                    {serviceActivityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill ?? '#0d9488'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      </section>

      {/* Security & Compliance Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            Sécurité et conformité
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
            Conçu pour la santé : authentification, rôles et traçabilité complète.
          </p>
          <div className="mt-10 rounded-xl bg-white p-8 shadow-card border border-slate-100">
            <ul className="space-y-4 text-slate-700">
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-500" />
                <span>
                  <strong className="text-slate-800">Authentification :</strong>{' '}
                  Connexion sécurisée avec gestion de session. SSO et MFA
                  possibles pour les rôles sensibles.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-500" />
                <span>
                  <strong className="text-slate-800">Rôles :</strong> Admin
                  (accès complet), Direction (tableaux de bord et rapports),
                  Service (données du service), Saisie (formulaires et import
                  uniquement). Droits granulaires et configurables.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-500" />
                <span>
                  <strong className="text-slate-800">Journal d'audit :</strong>{' '}
                  Toutes les modifications et actions sensibles sont enregistrées
                  (utilisateur, date, contexte) pour la conformité et la
                  traçabilité.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm font-medium text-slate-700">
            Plateforme d'analyse et de gestion des statistiques hospitalières
          </p>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}

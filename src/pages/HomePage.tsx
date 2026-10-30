import { Link } from 'react-router-dom';
import { FeatureCard } from '@/components/ui/FeatureCard';
import {
  SecureDataIcon,
  DatabaseIcon,
  ReportsIcon,
  SecurityIcon,
} from '@/components/icons/FeatureIcons';

export function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <header className="border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
          <Link to="/" className="flex items-center gap-3 font-semibold text-slate-800">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white" aria-hidden="true">+</span>
            <span>Statistiques hospitalières</span>
          </Link>
          <Link to="/connexion?role=admin" className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700">
            Se connecter
          </Link>
        </div>
      </header>
      <section className="relative overflow-hidden bg-gradient-to-b from-green-50 via-white to-slate-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
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
            <Link
              to="/connexion?role=admin"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-6 py-3 text-base font-semibold text-white shadow-soft transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Connexion administrateur
            </Link>
            <Link
              to="/connexion?role=personnel"
              className="inline-flex items-center justify-center rounded-lg border-2 border-green-600 bg-white px-6 py-3 text-base font-semibold text-green-700 transition-colors hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Espace personnel — Formulaire accouchement
            </Link>
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

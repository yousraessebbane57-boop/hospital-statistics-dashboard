import { HeroIllustration } from './HeroIllustration';

export function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-white via-primary-50/40 to-teal-50/30 px-4 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-20 lg:px-8 lg:pt-20 lg:pb-24"
      aria-labelledby="hero-title"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 lg:flex-row lg:gap-16">
        <div className="flex-1 text-center lg:text-left">
          <h1
            id="hero-title"
            className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl xl:text-[2.75rem]"
          >
            Plateforme de Gestion Hospitalière
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-slate-600 lg:mx-0">
            Optimisation des soins, gestion intelligente des patients et coordination médicale efficace.
          </p>
          <div className="mt-8">
            <a
              href="#acceder"
              className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3.5 text-base font-semibold text-white shadow-md transition-all duration-200 hover:bg-primary-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Accéder à la plateforme
            </a>
          </div>
        </div>
        <div className="w-full max-w-md flex-shrink-0 lg:max-w-lg">
          <HeroIllustration />
        </div>
      </div>
    </section>
  );
}

import { Navbar, Hero, Features, Footer } from '@/components/landing';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main>
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
}

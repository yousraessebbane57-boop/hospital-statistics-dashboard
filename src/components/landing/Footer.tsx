export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-sm font-medium text-slate-700">
            CHU Agadir
          </p>
          <p className="text-sm text-slate-500">
            Agadir, Maroc
          </p>
          <p className="text-sm text-slate-500">
            © {year}
          </p>
        </div>
      </div>
    </footer>
  );
}

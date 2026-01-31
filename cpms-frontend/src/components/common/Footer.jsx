export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-200 bg-white px-6 py-3">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-500">
        <p>
          © {year} Construction Management System
        </p>

        <p className="text-xs text-slate-400">
          Built for Admin & Staff Operations
        </p>
      </div>
    </footer>
  );
}

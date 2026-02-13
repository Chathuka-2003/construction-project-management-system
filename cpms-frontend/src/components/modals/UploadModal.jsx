export default function UploadModal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-3xl bg-slate-950 border border-white/10 backdrop-blur-xl p-6 shadow-xl shadow-black/20 ring-1 ring-white/10" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between gap-4 mb-4">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button className="px-2 py-1 text-white/60 hover:text-white transition" onClick={onClose}>✕</button>
        </div>
        <div className="border-t border-white/10 mb-4" />
        {children}
      </div>
    </div>
  );
}

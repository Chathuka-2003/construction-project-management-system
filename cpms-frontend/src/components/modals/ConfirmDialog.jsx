export default function ConfirmDialog({ message, onNo, onYes }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-sm" onClick={onNo}>
      <div className="w-full max-w-md rounded-3xl bg-slate-950 border border-white/10 backdrop-blur-xl p-6 shadow-xl shadow-black/20 ring-1 ring-white/10" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-white mb-3">Confirm</h3>
        <p className="text-white/70 mb-6">{message}</p>
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 rounded-lg bg-white/10 text-white/80 border border-white/20 hover:bg-white/15 transition font-semibold text-sm" onClick={onNo}>No</button>
          <button className="px-4 py-2 rounded-lg bg-red-600/30 text-red-300 border border-red-500/30 hover:bg-red-600/50 transition font-semibold text-sm" onClick={onYes}>Yes</button>
        </div>
      </div>
    </div>
  );
}

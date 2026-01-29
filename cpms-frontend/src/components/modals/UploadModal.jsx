export default function UploadModal({ title, onClose, children }) {
  return (
    <div
      className="
        fixed inset-0 z-[999]
        bg-black/45
        flex items-center justify-center
      "
      onClick={onClose}
    >
      <div
        className="
          w-[min(640px,92vw)]
          bg-white
          rounded-[14px]
          p-4
          shadow-[0_10px_22px_rgba(0,0,0,.10)]
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <h3 className="m-0 font-bold text-[18px]">{title}</h3>

          <button
            onClick={onClose}
            className="
              cursor-pointer font-bold
              px-[10px] py-2 text-[13px]
              rounded-[10px]
              bg-transparent
              border border-[#ddd]
              leading-none
            "
            aria-label="Close"
            type="button"
          >
            ✕
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#eee] my-3" />

        {/* Content */}
        {children}
      </div>
    </div>
  );
}

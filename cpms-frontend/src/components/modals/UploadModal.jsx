import React from "react";

export default function UploadModal({ title, onClose, children }) {
  return (
    <div
      className="
        fixed inset-0 z-[999]
        bg-black/40
        flex items-center justify-center
      "
      onClick={onClose}
    >
      <div
        className="
          w-[min(640px,92vw)]
          bg-white
          rounded-[14px]
          p-5
          shadow-[0_10px_22px_rgba(0,0,0,.12)]
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="text-[18px] font-extrabold">
            {title}
          </h3>

          <button
            onClick={onClose}
            className="
              px-3 py-1
              rounded-[10px]
              border border-[#ddd]
              text-[13px]
              font-bold
              hover:bg-gray-50
            "
            type="button"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#eee] mb-4" />

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}

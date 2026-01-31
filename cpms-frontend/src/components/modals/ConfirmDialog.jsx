import React from "react";

export default function ConfirmDialog({
  title = "Confirm Action",
  message,
  onYes,
  onNo,
}) {
  return (
    <div
      className="
        fixed inset-0 z-[999]
        bg-black/40
        flex items-center justify-center
      "
      onClick={onNo}
    >
      <div
        className="
          w-[min(420px,92vw)]
          bg-white
          rounded-[14px]
          p-5
          shadow-[0_10px_22px_rgba(0,0,0,.12)]
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h3 className="text-[18px] font-extrabold mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-[14px] text-[#333] mb-4">
          {message}
        </p>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onNo}
            className="
              px-4 py-2
              rounded-[10px]
              border border-[#ddd]
              bg-transparent
              font-bold
              text-[13px]
              hover:bg-gray-50
            "
            type="button"
          >
            Cancel
          </button>

          <button
            onClick={onYes}
            className="
              px-4 py-2
              rounded-[10px]
              bg-[#c0392b]
              text-white
              font-bold
              text-[13px]
              hover:opacity-90
            "
            type="button"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";

export default function ExpandSection({ title, count, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-[14px] shadow-[0_10px_22px_rgba(0,0,0,.10)] p-4">
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 cursor-pointer select-none text-left"
        aria-expanded={open}
      >
        <div>
          <b className="text-[14px]">{title}</b>
          <span className="text-[#6f6f6f] text-[13px]"> ({count})</span>
        </div>

        <span className="text-[18px]">{open ? "▾" : "▸"}</span>
      </button>

      {/* Content */}
      {open ? (
        <>
          <div className="h-px bg-[#eee] my-3" />
          {children}
        </>
      ) : null}
    </div>
  );
}

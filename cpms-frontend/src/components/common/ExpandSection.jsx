import { useState } from "react";

export default function ExpandSection({
  title,
  count = 0,
  defaultOpen = false,
  children,
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-[14px] shadow-[0_10px_22px_rgba(0,0,0,.10)] p-4">
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between text-left cursor-pointer"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          <h3 className="font-extrabold text-[15px]">{title}</h3>
          <span className="text-[12px] text-[#6f6f6f]">({count})</span>
        </div>

        <span className="text-[18px] select-none">
          {open ? "▾" : "▸"}
        </span>
      </button>

      {/* Content */}
      {open && (
        <>
          <div className="h-px bg-[#eee] my-3" />
          <div>{children}</div>
        </>
      )}
    </div>
  );
}

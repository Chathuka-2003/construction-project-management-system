import { useState } from "react";

export default function ExpandSection({ title, count, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="card">
      <div
        className="row"
        style={{ justifyContent: "space-between", cursor: "pointer" }}
        onClick={() => setOpen(o => !o)}
      >
        <div>
          <b>{title}</b>
          <span className="card-sub"> ({count})</span>
        </div>
        <span>{open ? "▾" : "▸"}</span>
      </div>
      

      {open && (
        <>
          <div className="hr" />
          {children}
        </>
      )}
    </div>
  );
}

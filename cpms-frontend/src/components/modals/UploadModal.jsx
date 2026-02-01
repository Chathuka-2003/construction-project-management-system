export default function UploadModal({ title, onClose, children }) {
  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalBox" onClick={(e) => e.stopPropagation()}>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button className="btn ghost small" onClick={onClose}>✕</button>
        </div>
        <div className="hr" />
        {children}
      </div>
    </div>
  );
}

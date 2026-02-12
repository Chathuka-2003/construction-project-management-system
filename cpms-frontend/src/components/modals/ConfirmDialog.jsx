export default function ConfirmDialog({ message, onNo, onYes }) {
  return (
    <div className="modalOverlay" onClick={onNo}>
      <div className="modalBox" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginTop: 0 }}>Confirm</h3>
        <p>{message}</p>
        <div className="row" style={{ justifyContent: "flex-end" }}>
          <button className="btn ghost" onClick={onNo}>No</button>
          <button className="btn danger" onClick={onYes}>Yes</button>
        </div>
      </div>
    </div>
  );
}

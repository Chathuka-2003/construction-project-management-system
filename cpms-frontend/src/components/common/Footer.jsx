import "..app.css";

export default function Card({ title, subtitle, right, accentColor, onClick, children }) {
  return (
    <div
      className={`card ${onClick ? "clickable" : ""}`}
      onClick={onClick}
      style={accentColor ? { borderLeft: `8px solid ${accentColor}` } : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <p className="card-title">{title}</p>
          {subtitle ? <p className="card-sub">{subtitle}</p> : null}
        </div>
        {right ? <div>{right}</div> : null}
      </div>
      {children}
    </div>
  );
}

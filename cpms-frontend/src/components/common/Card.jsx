export default function Card({
  title,
  subtitle,
  right,
  accentColor,
  onClick,
  children,
}) {
  return (
    <div
      className={[
        "bg-white rounded-[14px]",
        "shadow-[0_10px_22px_rgba(0,0,0,.10)]",
        "p-4",
        onClick
          ? "cursor-pointer transition-transform duration-100 ease-out hover:-translate-y-[2px]"
          : "",
      ].join(" ")}
      onClick={onClick}
      style={
        accentColor
          ? { borderLeft: `8px solid ${accentColor}` }
          : undefined
      }
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onClick();
            }
          : undefined
      }
    >
      {/* Header */}
      <div className="flex justify-between gap-3">
        <div>
          <p className="font-extrabold text-[16px] mb-2">
            {title}
          </p>
          {subtitle && (
            <p className="text-[#6f6f6f] text-[13px]">
              {subtitle}
            </p>
          )}
        </div>

        {right && <div>{right}</div>}
      </div>

      {/* Content */}
      {children}
    </div>
  );
}

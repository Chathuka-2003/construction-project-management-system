import React from "react";

export default function StatCard({ icon: Icon, title, value, color = "blue", onClick }) {
  return (
    <div
      onClick={onClick}
      className="
        cursor-pointer
        bg-white
        rounded-[14px]
        p-5
        shadow-[0_6px_16px_rgba(0,0,0,.10)]
        hover:-translate-y-[2px]
        transition
        flex
        items-center
        justify-between
      "
    >
      <div>
        <p className="text-[13px] text-gray-500">{title}</p>
        <h2 className="text-[26px] font-extrabold mt-1">{value}</h2>
      </div>

      {Icon && (
        <div
          className={`
            p-3
            rounded-[12px]
            ${
              color === "blue"
                ? "bg-blue-100 text-blue-600"
                : color === "green"
                ? "bg-green-100 text-green-600"
                : color === "orange"
                ? "bg-orange-100 text-orange-600"
                : color === "purple"
                ? "bg-purple-100 text-purple-600"
                : "bg-gray-100 text-gray-600"
            }
          `}
        >
          <Icon size={26} />
        </div>
      )}
    </div>
  );
}

import React from "react";

export default function OutlineCard({ title, subtitle, value }) {
  return (
    <div
      className="bg-white border border-amber-200 rounded-lg p-4
                 flex justify-between items-center
                 hover:shadow-sm transition duration-100"
    >
      <div>
        <p className="text-sm font-semibold text-gray-700">{title}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>

      {value && (
        <p className="text-sm font-semibold text-amber-700">{value}</p>
      )}

      
    </div>

    
  );
}

import React from "react";

function StatCard({ title, value, color, icon: Icon }) {
  return (
    <div className="bg-white rounded-lg shadow p-5 w-full flex items-center gap-4">
      {Icon && (
        <div className={`p-3 rounded-lg bg-gray-100`}>
          <Icon className={`${color}`} size={28} />
        </div>
      )}
      
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className={`text-2xl font-semibold mt-1 ${color}`}>{value}</h2>
      </div>
    </div>
  );
}

export default StatCard;

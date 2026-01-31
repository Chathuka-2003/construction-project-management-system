// src/pages/vehicle/VehicleDashboard.jsx
export default function VehicleDashboard() {
  const stats = [
    ["Total Vehicles", 34],
    ["Active Vehicles", 32],
    ["Assigned Vehicles", 26],
    ["Under Maintenance", 2],
  ];

  return (
    <div className="bg-white rounded-[14px] shadow-[0_10px_22px_rgba(0,0,0,.10)] p-6">
      <h1 className="text-[22px] font-extrabold mb-1">
        Construction Vehicle Management
      </h1>
      <p className="text-[#6f6f6f] text-[13px] mb-6">
        Sri Lankan Construction Fleet System
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(([title, value]) => (
          <div
            key={title}
            className="bg-[#E7D6C1] rounded-[14px] p-4 shadow-[0_6px_16px_rgba(0,0,0,.08)]"
          >
            <p className="text-[13px] text-[#3a2f2a] font-bold">{title}</p>
            <p className="text-[28px] font-black mt-2 text-[#1f1a17]">
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

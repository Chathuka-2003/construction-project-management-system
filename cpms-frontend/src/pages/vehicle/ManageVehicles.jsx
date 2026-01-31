// src/pages/vehicle/ManageVehicles.jsx
import { useMemo, useState } from "react";

export default function ManageVehicles() {
  const vehicles = [
    {
      number: "LK-CAA-2146",
      type: "Tipper Truck",
      fuel: "Diesel",
      capacity: "10 Tons",
      machine: "TATA 2618",
      condition: "Good",
      status: "Available",
    },
    {
      number: "LK-WP-6032",
      type: "JCB",
      fuel: "Diesel",
      capacity: "1.5 Cubic Meter",
      machine: "JCB 3DX",
      condition: "Excellent",
      status: "Assigned",
    },
  ];

  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return vehicles;

    return vehicles.filter((v) => {
      return (
        v.number.toLowerCase().includes(needle) ||
        v.type.toLowerCase().includes(needle) ||
        v.machine.toLowerCase().includes(needle)
      );
    });
  }, [q]);

  const statusPill = (status) => {
    if (status === "Available") return "bg-green-100 text-green-700";
    if (status === "Assigned") return "bg-orange-100 text-orange-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="bg-white rounded-[14px] shadow-[0_10px_22px_rgba(0,0,0,.10)] p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="m-0 text-[22px] font-extrabold">Manage Vehicles</h1>
          <p className="text-[#6f6f6f] text-[13px] mt-1 mb-0">
            Add, edit, and manage your construction vehicle fleet
          </p>
        </div>

        <button
          className="border-0 cursor-pointer font-bold rounded-[10px] px-3 py-2 bg-[#4b3f3a] text-white"
          type="button"
          onClick={() => alert("Add Vehicle form coming next 😄")}
        >
          + Add Vehicle
        </button>
      </div>

      <div className="h-px bg-[#eee] my-3" />

      {/* Search */}
      <div className="flex gap-2 flex-wrap items-center">
        <input
          type="text"
          placeholder="Search by number, type, or machine..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="min-w-[260px] px-3 py-2 rounded-[10px] border border-[#ddd] bg-white outline-none"
        />
      </div>

      <div className="h-px bg-[#eee] my-3" />

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#eee]">
              <th className="text-left p-[10px_8px]">Vehicle Number</th>
              <th className="text-left p-[10px_8px]">Vehicle Type</th>
              <th className="text-left p-[10px_8px]">Fuel</th>
              <th className="text-left p-[10px_8px]">Capacity</th>
              <th className="text-left p-[10px_8px]">Machine</th>
              <th className="text-left p-[10px_8px]">Condition</th>
              <th className="text-left p-[10px_8px]">Status</th>
              <th className="text-left p-[10px_8px] w-[140px]">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((v) => (
              <tr key={v.number} className="border-b border-[#eee]">
                <td className="p-[10px_8px]">
                  <b className="block">{v.number}</b>
                </td>
                <td className="p-[10px_8px]">{v.type}</td>
                <td className="p-[10px_8px]">{v.fuel}</td>
                <td className="p-[10px_8px]">{v.capacity}</td>
                <td className="p-[10px_8px]">{v.machine}</td>
                <td className="p-[10px_8px]">{v.condition}</td>
                <td className="p-[10px_8px]">
                  <span
                    className={`inline-block px-[10px] py-[5px] rounded-full text-[12px] font-bold ${statusPill(
                      v.status
                    )}`}
                  >
                    {v.status}
                  </span>
                </td>
                <td className="p-[10px_8px]">
                  <div className="flex gap-2 flex-wrap items-center">
                    <button
                      className="cursor-pointer font-bold rounded-[10px] border border-[#ddd] bg-transparent px-[10px] py-2 text-[13px]"
                      type="button"
                      onClick={() => alert(`Edit ${v.number}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="cursor-pointer font-bold rounded-[10px] bg-[#c0392b] text-white px-[10px] py-2 text-[13px]"
                      type="button"
                      onClick={() => alert(`Delete ${v.number}`)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-[#6f6f6f] text-[13px] p-[14px]">
                  No vehicles found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

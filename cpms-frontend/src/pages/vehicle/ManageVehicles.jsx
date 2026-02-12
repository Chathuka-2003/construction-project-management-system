import { useState } from "react";



export default function ManageVehicles() {
  const role = localStorage.getItem("role") || "admin";

  // 🚫 hard stop if not admin
  if (role !== "admin") {
    return (
      <div className="min-h-screen grid place-items-center text-red-600 font-semibold">
        Access denied. Admins only.
      </div>
    );
  }

  const [activeMenu, setActiveMenu] = useState("vehicles");

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

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#F7F6F4]">
     
      {/* MAIN CONTENT */}
      <main className="lg:col-span-10 p-8">
        <h1 className="text-2xl font-bold mb-2">Manage Vehicles</h1>
        <p className="text-gray-600 mb-6">
          Add, edit, and manage your construction vehicle fleet
        </p>

        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search by vehicle number, type, or machine..."
            className="border rounded px-4 py-2 w-1/2"
          />
          <button className="bg-orange-600 text-white px-4 py-2 rounded">
            + Add Vehicle
          </button>
        </div>

        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-3 text-left">Vehicle Number</th>
                <th className="p-3">Vehicle Type</th>
                <th className="p-3">Fuel</th>
                <th className="p-3">Capacity</th>
                <th className="p-3">Machine</th>
                <th className="p-3">Condition</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.number} className="border-b text-sm">
                  <td className="p-3">{v.number}</td>
                  <td className="p-3 text-center">{v.type}</td>
                  <td className="p-3 text-center">{v.fuel}</td>
                  <td className="p-3 text-center">{v.capacity}</td>
                  <td className="p-3 text-center">{v.machine}</td>
                  <td className="p-3 text-center">{v.condition}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        v.status === "Available"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">✏️ 🗑️</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

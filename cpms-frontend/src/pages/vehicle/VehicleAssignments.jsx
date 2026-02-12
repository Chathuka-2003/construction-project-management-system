import { useState } from "react";

export default function VehicleAssignment() {
  const role = localStorage.getItem("role") || "staff";
  const [activeMenu, setActiveMenu] = useState("assignments");
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#F7F6F4]">
   

      {/* MAIN CONTENT */}
      <main className="lg:col-span-10 p-8">
        <h1 className="text-2xl font-bold mb-1">Vehicle Assignment</h1>
        <p className="text-gray-600 mb-6">
          Assign construction vehicles to sites and operators
        </p>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input className="border p-2 rounded" placeholder="Vehicle" />
            <input className="border p-2 rounded" placeholder="Site" />
            <input className="border p-2 rounded" placeholder="Operator" />
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="mt-4 bg-[#C07A4D] text-white px-4 py-2 rounded"
          >
            Create Assignment
          </button>
        </div>
      </main>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              Create Vehicle Assignment
            </h2>

            <div className="space-y-3">
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Vehicle Number"
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Site Location"
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Operator Name"
              />
              <input
                className="w-full border rounded px-3 py-2"
                type="date"
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Status (Assigned / Completed)"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-[#C07A4D] text-white rounded">
                Save Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

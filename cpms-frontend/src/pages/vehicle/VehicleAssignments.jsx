import { Link } from "react-router-dom";
import { useState } from "react";
import DashboardLayout from "../../components/common/DashboardLayout";

export default function VehicleAssignment() {
  const [showForm, setShowForm] = useState(false);

  return (
    <DashboardLayout role={"staff"}>
      <div className="min-h-screen flex bg-[#F7F6F4]">
        {/* Sidebar */}

        {/* Main */}
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold mb-1">Vehicle Assignment</h1>
          <p className="text-gray-600 mb-6">
            Assign construction vehicles to sites and operators
          </p>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="grid grid-cols-3 gap-4">
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

      {/* Assignment Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-[480px] rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Create Vehicle Assignment</h2>

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
                placeholder="Assignment Date"
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
    </DashboardLayout>
  );
}
// src/pages/vehicle/VehicleAssignments.jsx
import { useState } from "react";
import UploadModal from "../../components/modals/UploadModal.jsx";

export default function VehicleAssignment() {
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    vehicle: "",
    site: "",
    operator: "",
    date: "",
    status: "Assigned",
  });

  const save = () => {
    if (!form.vehicle.trim()) return alert("Vehicle number is required");
    if (!form.site.trim()) return alert("Site location is required");
    if (!form.operator.trim()) return alert("Operator name is required");
    if (!form.date) return alert("Assignment date is required");

    console.log("Saved assignment:", form);

    setShowForm(false);
    setForm({ vehicle: "", site: "", operator: "", date: "", status: "Assigned" });
  };

  return (
    <div className="bg-white rounded-[14px] shadow-[0_10px_22px_rgba(0,0,0,.10)] p-6">
      <h1 className="text-[22px] font-extrabold mb-1">Vehicle Assignment</h1>
      <p className="text-[#6f6f6f] text-[13px] mb-6">
        Assign construction vehicles to sites and operators
      </p>

      <div className="bg-white rounded-[14px] border border-[#eee] p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            className="border border-[#ddd] rounded-[10px] px-3 py-2 outline-none"
            placeholder="Vehicle"
          />
          <input
            className="border border-[#ddd] rounded-[10px] px-3 py-2 outline-none"
            placeholder="Site"
          />
          <input
            className="border border-[#ddd] rounded-[10px] px-3 py-2 outline-none"
            placeholder="Operator"
          />
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="mt-4 bg-[#4b3f3a] text-white px-4 py-2 rounded-[10px] font-bold"
          type="button"
        >
          + Create Assignment
        </button>
      </div>

      {showForm && (
        <UploadModal title="Create Vehicle Assignment" onClose={() => setShowForm(false)}>
          <div className="grid gap-3">
            <input
              className="w-full border border-[#ddd] rounded-[10px] px-3 py-2 outline-none"
              placeholder="Vehicle Number"
              value={form.vehicle}
              onChange={(e) => setForm((f) => ({ ...f, vehicle: e.target.value }))}
            />
            <input
              className="w-full border border-[#ddd] rounded-[10px] px-3 py-2 outline-none"
              placeholder="Site Location"
              value={form.site}
              onChange={(e) => setForm((f) => ({ ...f, site: e.target.value }))}
            />
            <input
              className="w-full border border-[#ddd] rounded-[10px] px-3 py-2 outline-none"
              placeholder="Operator Name"
              value={form.operator}
              onChange={(e) => setForm((f) => ({ ...f, operator: e.target.value }))}
            />
            <input
              type="date"
              className="w-full border border-[#ddd] rounded-[10px] px-3 py-2 outline-none"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />

            <select
              className="w-full border border-[#ddd] rounded-[10px] px-3 py-2 outline-none"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            >
              <option value="Assigned">Assigned</option>
              <option value="Completed">Completed</option>
            </select>

            <div className="flex justify-end gap-2 mt-1">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-[#ddd] rounded-[10px] font-bold"
                type="button"
              >
                Cancel
              </button>

              <button
                onClick={save}
                className="px-4 py-2 bg-[#4b3f3a] text-white rounded-[10px] font-bold"
                type="button"
              >
                Save
              </button>
            </div>
          </div>
        </UploadModal>
      )}
    </div>
  );
}

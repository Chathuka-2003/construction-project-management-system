import { X } from "lucide-react";

const EMPTY_FORM = {
  name: "",
  customer: "",
  location: "",
  startDate: "",
  status: "Planning",
  description: "",
};

export default function NewProjectModal({
  onClose,
  onSave,
  form = EMPTY_FORM,   // 👈 DEFAULT
  setForm = () => {},  // 👈 DEFAULT
  isEdit,
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">
            {isEdit ? "Edit Project" : "New Project"}
          </h2>
          <button onClick={onClose} type="button">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4">
          <input
            placeholder="Project name"
            value={form.name}
            onChange={(e) =>
              setForm((f) => ({ ...f, name: e.target.value }))
            }
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            placeholder="Customer name"
            value={form.customer}
            onChange={(e) =>
              setForm((f) => ({ ...f, customer: e.target.value }))
            }
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            placeholder="Location"
            value={form.location}
            onChange={(e) =>
              setForm((f) => ({ ...f, location: e.target.value }))
            }
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            type="date"
            value={form.startDate}
            onChange={(e) =>
              setForm((f) => ({ ...f, startDate: e.target.value }))
            }
            className="w-full border rounded-xl px-4 py-3"
          />

          <select
            value={form.status}
            onChange={(e) =>
              setForm((f) => ({ ...f, status: e.target.value }))
            }
            className="w-full border rounded-xl px-4 py-3"
          >
            <option>Planning</option>
            <option>Design</option>
            <option>Construction</option>
            <option>Finishing</option>
            <option>Handover</option>
            <option>On Hold</option>
          </select>

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            rows={4}
            className="w-full border rounded-xl px-4 py-3"
          />

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              type="button"
              className="px-5 py-2 rounded-xl bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              type="button"
              className="px-5 py-2 rounded-xl bg-blue-600 text-white"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

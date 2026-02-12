import { X } from "lucide-react";

export default function NewTaskModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">New Task</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form className="px-6 py-5 space-y-4">
          <div>
            <label className="text-sm font-medium">Title *</label>
            <input
              type="text"
              placeholder="Task title"
              className="w-full mt-1 border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Location</label>
            <input
              type="text"
              placeholder="Location"
              className="w-full mt-1 border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Due date *</label>
            <input
              type="date"
              className="w-full mt-1 border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Priority</label>
            <select className="w-full mt-1 border rounded-xl px-4 py-3">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Status</label>
            <select className="w-full mt-1 border rounded-xl px-4 py-3">
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Notes</label>
            <textarea
              placeholder="Notes"
              rows="4"
              className="w-full mt-1 border rounded-xl px-4 py-3 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gray-100 text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState } from "react";

export default function WorkerTasks() {
  const [showForm, setShowForm] = useState(false);

  const tasks = [
    {
      name: "Foundation Inspection",
      status: "Completed",
      location: "Colombo Site A",
      vehicle: "LK-CAA-2145",
    },
    {
      name: "Brick Laying",
      status: "In Progress",
      location: "Kandy Highway Project",
      vehicle: "LK-WP-5632",
    },
    {
      name: "Material Transport",
      status: "Pending",
      location: "Galle Port Site",
      vehicle: "LK-SP-7821",
    },
    {
      name: "Steel Frame Assembly",
      status: "In Progress",
      location: "Negombo Beach Resort",
      vehicle: "LK-WP-3344",
    },
    {
      name: "Concrete Pouring",
      status: "Pending",
      location: "Matara Expressway Site",
      vehicle: "LK-SP-9012",
    },
  ];

  const statusStyle = (status) => {
    if (status === "Completed") return "bg-green-100 text-green-700";
    if (status === "In Progress") return "bg-amber-100 text-amber-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="p-8 bg-[#FFF7ED] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#5A2D0C]">
            Worker Tasks
          </h1>
          <p className="text-gray-600">
            Manage and track daily tasks assigned to construction workers
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="bg-[#F59E0B] hover:bg-[#D97706] text-white px-5 py-2 rounded-lg shadow"
        >
          + Add Task
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#7C3F14] text-white">
            <tr>
              <th className="text-left px-6 py-3">Task Name</th>
              <th className="text-left px-6 py-3">Status</th>
              <th className="text-left px-6 py-3">Location</th>
              <th className="text-left px-6 py-3">Vehicle Number</th>
              <th className="text-center px-6 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((task, index) => (
              <tr
                key={index}
                className="border-b last:border-none hover:bg-gray-50"
              >
                <td className="px-6 py-4">{task.name}</td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyle(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>
                </td>

                <td className="px-6 py-4">{task.location}</td>
                <td className="px-6 py-4">{task.vehicle}</td>

                <td className="px-6 py-4 text-center space-x-2">
                  <button className="px-3 py-1 border border-amber-400 text-amber-600 rounded hover:bg-amber-50">
                    View
                  </button>
                  <button className="px-3 py-1 bg-amber-500 text-white rounded hover:bg-amber-600">
                    Edit
                  </button>
                  <button className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Task Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-[480px] rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-[#5A2D0C]">
              Add Worker Task
            </h2>

            <div className="space-y-3">
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Task Name"
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Location"
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Vehicle Number"
              />
              <select className="w-full border rounded px-3 py-2">
                <option>Status</option>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
              <input
                type="date"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-[#F59E0B] text-white rounded">
                Save Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
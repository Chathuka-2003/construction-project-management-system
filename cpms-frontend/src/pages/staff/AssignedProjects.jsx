import { useMemo, useState } from "react";
import { useStore } from "../../components/store/AppStore.jsx";
import UploadModal from "../../components/modals/UploadModal.jsx";
import ConfirmDialog from "../../components/modals/ConfirmDialog.jsx";

const STATUSES = [
  "Planning",
  "Design",
  "Construction",
  "Finishing",
  "Handover",
  "On Hold",
];

function emptyForm() {
  return {
    name: "",
    customer: "",
    location: "",
    description: "",
    startDate: "",
    status: "Planning",
  };
}

export default function AssignedProjects() {
  const { data, addProject, updateProject, deleteProject } = useStore();

  const [q, setQ] = useState("");
  const [sort, setSort] = useState("new");
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [confirm, setConfirm] = useState(null);

  const projects = useMemo(() => {
    let list = [...(data.projects || [])];

    if (q.trim()) {
      const needle = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(needle) ||
          p.location.toLowerCase().includes(needle)
      );
    }

    list.sort((a, b) => {
      const da = new Date(a.startDate || 0);
      const db = new Date(b.startDate || 0);
      return sort === "new" ? db - da : da - db;
    });

    return list;
  }, [data.projects, q, sort]);

  const startAdd = () => {
    setEditing(null);
    setForm(emptyForm());
    setOpenForm(true);
  };

  const startEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name || "",
      customer: p.customer || "",
      location: p.location || "",
      description: p.description || "",
      startDate: p.startDate || "",
      status: p.status || "Planning",
    });
    setOpenForm(true);
  };

  const save = () => {
    if (!form.name.trim()) return alert("Project name required");
    if (!form.location.trim()) return alert("Location required");
    if (!form.startDate) return alert("Start date required");

    if (editing) {
      updateProject(editing.id, form);
    } else {
      addProject(form);
    }

    setOpenForm(false);
  };

  return (
    <div className="bg-white rounded-[14px] shadow p-4">
      {/* Header */}
      <div className="flex justify-between items-start gap-3 flex-wrap">
        <div>
          <h2 className="text-[22px] font-extrabold">Assigned Projects</h2>
          <p className="text-[13px] text-gray-500 mt-1">
            Manage your assigned construction projects
          </p>
        </div>

        <button
          onClick={startAdd}
          className="bg-[#4b3f3a] text-white font-bold px-3 py-2 rounded-[10px]"
        >
          + New Project
        </button>
      </div>

      <div className="h-px bg-[#eee] my-3" />

      {/* Controls */}
      <div className="flex gap-2 flex-wrap">
        <input
          className="border rounded-[10px] px-3 py-2 min-w-[220px]"
          placeholder="Search by name or location..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <select
          className="border rounded-[10px] px-3 py-2 min-w-[220px]"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="new">Date: New → Old</option>
          <option value="old">Date: Old → New</option>
        </select>
      </div>

      <div className="h-px bg-[#eee] my-3" />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Project</th>
              <th className="text-left p-2">Customer</th>
              <th className="text-left p-2">Location</th>
              <th className="text-left p-2">Start</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2 w-[160px]">Actions</th>
            </tr>
          </thead>

          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="p-2">
                  <b>{p.name}</b>
                  {p.description && (
                    <div className="text-[13px] text-gray-500">
                      {p.description}
                    </div>
                  )}
                </td>
                <td className="p-2">{p.customer}</td>
                <td className="p-2">{p.location}</td>
                <td className="p-2">{p.startDate}</td>
                <td className="p-2">
                  <span className="px-3 py-1 rounded-full text-[12px] bg-gray-100 font-bold">
                    {p.status}
                  </span>
                </td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(p)}
                      className="border rounded-[10px] px-3 py-1 text-[13px] font-bold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setConfirm(p.id)}
                      className="bg-[#c0392b] text-white rounded-[10px] px-3 py-1 text-[13px] font-bold"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {projects.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-gray-500 text-sm">
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {openForm && (
        <UploadModal
          title={editing ? "Edit Project" : "New Project"}
          onClose={() => setOpenForm(false)}
        >
          <div className="grid gap-3">
            <input
              className="border rounded px-3 py-2"
              placeholder="Project name"
              value={form.name}
              onChange={(e) =>
                setForm((f) => ({ ...f, name: e.target.value }))
              }
            />
            <input
              className="border rounded px-3 py-2"
              placeholder="Customer"
              value={form.customer}
              onChange={(e) =>
                setForm((f) => ({ ...f, customer: e.target.value }))
              }
            />
            <input
              className="border rounded px-3 py-2"
              placeholder="Location"
              value={form.location}
              onChange={(e) =>
                setForm((f) => ({ ...f, location: e.target.value }))
              }
            />
            <input
              type="date"
              className="border rounded px-3 py-2"
              value={form.startDate}
              onChange={(e) =>
                setForm((f) => ({ ...f, startDate: e.target.value }))
              }
            />
            <select
              className="border rounded px-3 py-2"
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({ ...f, status: e.target.value }))
              }
            >
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <textarea
              className="border rounded px-3 py-2"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpenForm(false)}
                className="border rounded px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="bg-[#4b3f3a] text-white rounded px-4 py-2"
              >
                Save
              </button>
            </div>
          </div>
        </UploadModal>
      )}

      {/* Delete Confirm */}
      {confirm && (
        <ConfirmDialog
          message="Are you sure you want to delete this project?"
          onNo={() => setConfirm(null)}
          onYes={() => {
            deleteProject(confirm);
            setConfirm(null);
          }}
        />
      )}
    </div>
  );
}

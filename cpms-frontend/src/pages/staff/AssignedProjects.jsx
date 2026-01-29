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
  const [sort, setSort] = useState("new"); // new or old
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null); // project object or null
  const [form, setForm] = useState(emptyForm());
  const [confirm, setConfirm] = useState(null); // project id to delete

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = [...(data.projects || [])];

    if (needle) {
      list = list.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(needle) ||
          (p.location || "").toLowerCase().includes(needle)
      );
    }

    list.sort((a, b) => {
      const da = new Date(a.startDate || "1970-01-01").getTime();
      const db = new Date(b.startDate || "1970-01-01").getTime();
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
    if (!form.name.trim()) return alert("Project name is required");
    if (!form.location.trim()) return alert("Location is required");
    if (!form.startDate) return alert("Starting date is required");

    if (editing) updateProject(editing.id, form);
    else addProject(form);

    setOpenForm(false);
  };

  return (
    <div className="bg-white rounded-[14px] shadow-[0_10px_22px_rgba(0,0,0,.10)] p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="m-0 text-[22px] font-extrabold">Projects</h2>
          <div className="text-[#6f6f6f] text-[13px] mt-1">
            Search by project name or location • Sort by date
          </div>
        </div>

        <button
          className="border-0 cursor-pointer font-bold rounded-[10px] px-3 py-2 bg-[#4b3f3a] text-white"
          onClick={startAdd}
          type="button"
        >
          + New Project
        </button>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#eee] my-3" />

      {/* Controls */}
      <div className="flex gap-2 flex-wrap items-center">
        <input
          className="min-w-[220px] px-3 py-2 rounded-[10px] border border-[#ddd] bg-white outline-none"
          placeholder="Search by name or location..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <select
          className="min-w-[220px] px-3 py-2 rounded-[10px] border border-[#ddd] bg-white outline-none"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="new">Date: New → Old</option>
          <option value="old">Date: Old → New</option>
        </select>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#eee] my-3" />

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-[10px_8px] border-b border-[#eee] align-top">
                Project
              </th>
              <th className="text-left p-[10px_8px] border-b border-[#eee] align-top">
                Customer
              </th>
              <th className="text-left p-[10px_8px] border-b border-[#eee] align-top">
                Location
              </th>
              <th className="text-left p-[10px_8px] border-b border-[#eee] align-top">
                Start
              </th>
              <th className="text-left p-[10px_8px] border-b border-[#eee] align-top">
                Status
              </th>
              <th className="text-left p-[10px_8px] border-b border-[#eee] align-top w-[160px]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td className="text-left p-[10px_8px] border-b border-[#eee] align-top">
                  <b className="block">{p.name}</b>
                  <div className="text-[#6f6f6f] text-[13px] mt-1">
                    {p.description}
                  </div>
                </td>

                <td className="text-left p-[10px_8px] border-b border-[#eee] align-top">
                  {p.customer}
                </td>
                <td className="text-left p-[10px_8px] border-b border-[#eee] align-top">
                  {p.location}
                </td>
                <td className="text-left p-[10px_8px] border-b border-[#eee] align-top">
                  {p.startDate}
                </td>

                <td className="text-left p-[10px_8px] border-b border-[#eee] align-top">
                  <span className="inline-block px-[10px] py-[5px] rounded-full bg-[#f3f3f3] text-[12px] font-bold">
                    {p.status}
                  </span>
                </td>

                <td className="text-left p-[10px_8px] border-b border-[#eee] align-top">
                  <div className="flex gap-2 flex-wrap items-center">
                    <button
                      className="cursor-pointer font-bold rounded-[10px] border border-[#ddd] bg-transparent px-[10px] py-2 text-[13px]"
                      onClick={() => startEdit(p)}
                      type="button"
                    >
                      Edit
                    </button>

                    <button
                      className="cursor-pointer font-bold rounded-[10px] bg-[#c0392b] text-white px-[10px] py-2 text-[13px]"
                      onClick={() => setConfirm(p.id)}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-[#6f6f6f] text-[13px] p-[14px]"
                >
                  No projects found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {openForm ? (
        <UploadModal
          title={editing ? "Edit Project" : "New Project"}
          onClose={() => setOpenForm(false)}
        >
          <div className="flex gap-2 flex-wrap items-center">
            <input
              className="min-w-[220px] px-3 py-2 rounded-[10px] border border-[#ddd] bg-white outline-none"
              placeholder="Project name"
              value={form.name}
              onChange={(e) =>
                setForm((f) => ({ ...f, name: e.target.value }))
              }
            />
            <input
              className="min-w-[220px] px-3 py-2 rounded-[10px] border border-[#ddd] bg-white outline-none"
              placeholder="Customer name"
              value={form.customer}
              onChange={(e) =>
                setForm((f) => ({ ...f, customer: e.target.value }))
              }
            />
          </div>

          <div className="flex gap-2 flex-wrap items-center mt-[10px]">
            <input
              className="min-w-[220px] px-3 py-2 rounded-[10px] border border-[#ddd] bg-white outline-none"
              placeholder="Location"
              value={form.location}
              onChange={(e) =>
                setForm((f) => ({ ...f, location: e.target.value }))
              }
            />
            <input
              className="min-w-[220px] px-3 py-2 rounded-[10px] border border-[#ddd] bg-white outline-none"
              type="date"
              value={form.startDate}
              onChange={(e) =>
                setForm((f) => ({ ...f, startDate: e.target.value }))
              }
            />
          </div>

          <div className="flex gap-2 flex-wrap items-center mt-[10px]">
            <select
              className="min-w-[220px] px-3 py-2 rounded-[10px] border border-[#ddd] bg-white outline-none"
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({ ...f, status: e.target.value }))
              }
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-[10px]">
            <textarea
              className="w-full min-h-[90px] px-3 py-2 rounded-[10px] border border-[#ddd] bg-white outline-none"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </div>

          <div className="flex gap-2 flex-wrap items-center justify-end mt-[10px]">
            <button
              className="cursor-pointer font-bold rounded-[10px] border border-[#ddd] bg-transparent px-3 py-2"
              onClick={() => setOpenForm(false)}
              type="button"
            >
              Cancel
            </button>
            <button
              className="cursor-pointer font-bold rounded-[10px] px-3 py-2 bg-[#4b3f3a] text-white"
              onClick={save}
              type="button"
            >
              Save
            </button>
          </div>
        </UploadModal>
      ) : null}

      {/* Confirm */}
      {confirm ? (
        <ConfirmDialog
          message="Are you sure you want to delete this project?"
          onNo={() => setConfirm(null)}
          onYes={() => {
            deleteProject(confirm);
            setConfirm(null);
          }}
        />
      ) : null}
    </div>
  );
}

// src/pages/projects/AssignedProjects.jsx
import { useEffect, useMemo, useState } from "react";

const STATUSES = ["Planning", "Design", "Construction", "Finishing", "Handover", "On Hold"];
const STORAGE_KEY = "cpms_staff_projects_v1";

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

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

function StatusPill({ value }) {
  const map = {
    Planning: "bg-slate-100 text-slate-700",
    Design: "bg-indigo-100 text-indigo-700",
    Construction: "bg-orange-100 text-orange-700",
    Finishing: "bg-emerald-100 text-emerald-700",
    Handover: "bg-blue-100 text-blue-700",
    "On Hold": "bg-red-100 text-red-700",
  };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        map[value] || "bg-gray-100 text-gray-700",
      ].join(" ")}
    >
      {value}
    </span>
  );
}

function Modal({ title, children, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-sm font-semibold text-gray-600 hover:bg-gray-100"
            type="button"
          >
            ✕
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function ConfirmDialog({ message, onNo, onYes }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="px-6 py-5">
          <h3 className="text-base font-bold text-gray-900">Confirm</h3>
          <p className="mt-2 text-sm text-gray-600">{message}</p>
          <div className="mt-5 flex justify-end gap-2">
            <button
              onClick={onNo}
              className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-200"
              type="button"
            >
              No
            </button>
            <button
              onClick={onYes}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              type="button"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AssignedProjects() {
  const role = localStorage.getItem("role") || "staff";

  const [projects, setProjects] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  const [q, setQ] = useState("");
  const [sort, setSort] = useState("new");
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [confirmId, setConfirmId] = useState(null);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = [...projects];

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
  }, [projects, q, sort]);

  const startAdd = () => {
    setEditingId(null);
    setForm(emptyForm());
    setOpenForm(true);
  };

  const startEdit = (p) => {
    setEditingId(p.id);
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

    if (editingId) {
      setProjects((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, ...form } : p))
      );
    } else {
      setProjects((prev) => [{ id: uid(), ...form }, ...prev]);
    }

    setOpenForm(false);
  };

  const doDelete = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
            <p className="mt-1 text-sm text-gray-500">
              Search by project name or location • Sort by date
            </p>
          </div>

          <button
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            onClick={startAdd}
            type="button"
          >
            + New Project
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="md:col-span-2">
            <input
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="Search by name or location..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <select
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="new">Date: New → Old</option>
            <option value="old">Date: Old → New</option>
          </select>
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Start</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" style={{ width: 180 }}>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-900">{p.name}</div>
                    <div className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {p.description}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{p.customer}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{p.location}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{p.startDate}</td>
                  <td className="px-4 py-3">
                    <StatusPill value={p.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-200"
                        onClick={() => startEdit(p)}
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
                        onClick={() => setConfirmId(p.id)}
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-500">
                    No projects found. Click <b>+ New Project</b> to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {openForm && (
        <Modal
          title={editingId ? "Edit Project" : "New Project"}
          onClose={() => setOpenForm(false)}
        >
          <div className="grid gap-3 md:grid-cols-2">
            <input
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="Project name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <input
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="Customer name"
              value={form.customer}
              onChange={(e) => setForm((f) => ({ ...f, customer: e.target.value }))}
            />
            <input
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            />
            <input
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              type="date"
              value={form.startDate}
              onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
            />
            <select
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 md:col-span-2"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <textarea
              className="min-h-[110px] w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 md:col-span-2"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <button
              className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-200"
              onClick={() => setOpenForm(false)}
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              onClick={save}
              type="button"
            >
              Save
            </button>
          </div>
        </Modal>
      )}

      {confirmId && (
        <ConfirmDialog
          message="Are you sure you want to delete this project?"
          onNo={() => setConfirmId(null)}
          onYes={() => {
            doDelete(confirmId);
            setConfirmId(null);
          }}
        />
      )}
    </div>
  );
}

// src/pages/staff/TaskManagement.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  ClipboardList,
  Calendar as CalendarIcon,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Pencil,
} from "lucide-react";

// Safe ID generator
function uid() {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID)
      return crypto.randomUUID();
  } catch (_) {}
  return `t_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

// LocalStorage key
const STORAGE_KEY = "cpms_tasks_v1";

const PRIORITIES = ["High", "Medium", "Low"];
const STATUSES = ["Pending", "In Progress", "Done"];

function priorityBadge(priority) {
  if (priority === "High") return "bg-red-100 text-red-700 ring-red-200";
  if (priority === "Medium") return "bg-amber-100 text-amber-700 ring-amber-200";
  return "bg-blue-100 text-blue-700 ring-blue-200";
}

function statusBadge(status) {
  if (status === "Done") return "bg-emerald-100 text-emerald-700 ring-emerald-200";
  if (status === "In Progress") return "bg-indigo-100 text-indigo-700 ring-indigo-200";
  return "bg-slate-100 text-slate-700 ring-slate-200";
}

function emptyForm() {
  return {
    title: "",
    location: "",
    dueDate: "",
    priority: "Medium",
    status: "Pending",
    notes: "",
  };
}

// ---------- MAIN COMPONENT ----------
export default function TaskManagement() {
  // optional for conditional UI
  // const role = localStorage.getItem("role") || "staff";

  const [tasks, setTasks] = useState([]);
  const [q, setQ] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [sort, setSort] = useState("due_asc");

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm());

  const [confirmId, setConfirmId] = useState(null);

  // ---------- load & persist ----------
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      const today = new Date().toISOString().slice(0, 10);
      const seed = [
        {
          id: uid(),
          title: "Inspect concrete pour",
          location: "Site A",
          dueDate: today,
          priority: "High",
          status: "Pending",
          notes: "",
          createdAt: new Date().toISOString(),
        },
        {
          id: uid(),
          title: "Update progress report",
          location: "Office",
          dueDate: today,
          priority: "Medium",
          status: "In Progress",
          notes: "",
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      setTasks(seed);
      return;
    }

    try {
      setTasks(JSON.parse(raw) || []);
    } catch {
      setTasks([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // ---------- derived ----------
  const stats = useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter((t) => t.status !== "Done").length;
    const done = tasks.filter((t) => t.status === "Done").length;
    const high = tasks.filter((t) => t.priority === "High" && t.status !== "Done").length;
    return { total, pending, done, high };
  }, [tasks]);

  const filtered = useMemo(() => {
    let list = [...tasks];
    const needle = q.trim().toLowerCase();

    if (needle) {
      list = list.filter((t) =>
        [t.title, t.location, t.notes].some((s) =>
          (s || "").toLowerCase().includes(needle)
        )
      );
    }

    if (filterStatus !== "All") {
      list = list.filter((t) => t.status === filterStatus);
    }

    if (filterPriority !== "All") {
      list = list.filter((t) => t.priority === filterPriority);
    }

    list.sort((a, b) => {
      if (sort === "new") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === "old") return new Date(a.createdAt) - new Date(b.createdAt);

      const da = new Date(a.dueDate || "9999-12-31").getTime();
      const db = new Date(b.dueDate || "9999-12-31").getTime();
      return sort === "due_desc" ? db - da : da - db;
    });

    return list;
  }, [tasks, q, filterStatus, filterPriority, sort]);

  // ---------- actions ----------
  const resetForm = () => {
    setForm(emptyForm());
    setEditingId(null);
  };

  const openCreate = () => {
    resetForm();
    setOpen(true);
  };

  const openEdit = (t) => {
    setEditingId(t.id);
    setForm({
      title: t.title || "",
      location: t.location || "",
      dueDate: t.dueDate || "",
      priority: t.priority || "Medium",
      status: t.status || "Pending",
      notes: t.notes || "",
    });
    setOpen(true);
  };

  const save = () => {
    if (!form.title.trim()) return alert("Title required");
    if (!form.dueDate) return alert("Due date required");

    if (editingId) {
      setTasks((prev) => prev.map((t) => (t.id === editingId ? { ...t, ...form } : t)));
    } else {
      setTasks((prev) => [{ id: uid(), ...form, createdAt: new Date().toISOString() }, ...prev]);
    }

    setOpen(false);
    resetForm();
  };

  const toggleDone = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === "Done" ? "Pending" : "Done" } : t
      )
    );
  };

  const askDelete = (id) => setConfirmId(id);

  const confirmDelete = () => {
    setTasks((prev) => prev.filter((t) => t.id !== confirmId));
    setConfirmId(null);
  };

  // ---------- RENDER ----------
  return (
    <div className="flex-1 min-h-screen p-6 bg-gray-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create, track, and complete your tasks.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          type="button"
        >
          <Plus size={18} /> New Task
        </button>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={<ClipboardList size={18} />} label="Total" value={stats.total} />
        <StatCard icon={<AlertTriangle size={18} />} label="Open" value={stats.pending} />
        <StatCard icon={<CheckCircle2 size={18} />} label="Done" value={stats.done} />
        <StatCard icon={<AlertTriangle size={18} />} label="High Priority" value={stats.high} />
      </div>

      {/* Search + filters */}
      <div className="mt-6 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="grid gap-3 md:grid-cols-12">
          <div className="md:col-span-6 flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2">
            <Search size={16} className="text-gray-400" />
            <input
              placeholder="Search tasks..."
              className="w-full text-sm outline-none bg-transparent"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={["All", ...STATUSES]}
              icon={<Filter size={16} className="text-gray-400" />}
            />
          </div>

          <div className="md:col-span-2">
            <Select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              options={["All", ...PRIORITIES]}
              icon={<Filter size={16} className="text-gray-400" />}
            />
          </div>

          <div className="md:col-span-2">
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              options={[
                { value: "due_asc", label: "Due: Soon → Late" },
                { value: "due_desc", label: "Due: Late → Soon" },
                { value: "new", label: "Created: New → Old" },
                { value: "old", label: "Created: Old → New" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="mt-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-900">
            Tasks <span className="text-gray-400">({filtered.length})</span>
          </h2>
        </div>

        {filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-500">No tasks found.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((t) => (
              <div
                key={t.id}
                className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 px-5 py-4"
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleDone(t.id)}
                    className={`mt-0.5 grid h-6 w-6 place-items-center rounded-lg border ${
                      t.status === "Done"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                    type="button"
                    title={t.status === "Done" ? "Mark as pending" : "Mark as done"}
                  >
                    <CheckCircle2 size={16} />
                  </button>

                  <div className="min-w-0">
                    <div
                      className={`flex flex-wrap items-center gap-2 truncate text-sm font-semibold ${
                        t.status === "Done" ? "text-gray-500 line-through" : "text-gray-900"
                      }`}
                    >
                      {t.title}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <CalendarIcon size={14} /> Due: {t.dueDate}
                      </span>

                      {t.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={14} /> {t.location}
                        </span>
                      )}

                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusBadge(
                          t.status
                        )}`}
                      >
                        {t.status}
                      </span>

                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${priorityBadge(
                          t.priority
                        )}`}
                      >
                        {t.priority}
                      </span>
                    </div>

                    {t.notes && <div className="mt-2 text-sm text-gray-600">{t.notes}</div>}
                  </div>
                </div>

                <div className="flex gap-2 md:justify-end">
                  <button
                    onClick={() => openEdit(t)}
                    className="px-3 py-2 text-xs bg-gray-100 rounded-xl hover:bg-gray-200 flex items-center gap-2"
                    type="button"
                  >
                    <Pencil size={14} /> Edit
                  </button>

                  <button
                    onClick={() => askDelete(t.id)}
                    className="px-3 py-2 text-xs bg-red-600 rounded-xl text-white hover:bg-red-700 flex items-center gap-2"
                    type="button"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {open && (
        <Modal
          title={editingId ? "Edit Task" : "New Task"}
          onClose={() => {
            setOpen(false);
            resetForm();
          }}
        >
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Title *">
              <input
                className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Task title"
              />
            </Field>

            <Field label="Location">
              <input
                className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="Location"
              />
            </Field>

            <Field label="Due date *">
              <input
                type="date"
                className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                value={form.dueDate}
                onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
              />
            </Field>

            <Field label="Priority">
              <select
                className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                value={form.priority}
                onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Status" className="md:col-span-2">
              <select
                className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Notes" className="md:col-span-2">
              <textarea
                className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Notes"
                rows={4}
              />
            </Field>
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <button
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
              className="px-4 py-2 rounded-xl bg-gray-100 text-gray-800 hover:bg-gray-200"
              type="button"
            >
              Cancel
            </button>

            <button
              onClick={save}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
              type="button"
            >
              Save
            </button>
          </div>
        </Modal>
      )}

      {/* Delete Confirm */}
      {confirmId && (
        <Modal title="Delete Task?" onClose={() => setConfirmId(null)}>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete this task? This cannot be undone.
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <button
              onClick={() => setConfirmId(null)}
              className="px-4 py-2 rounded-xl bg-gray-100 text-gray-800 hover:bg-gray-200"
              type="button"
            >
              No
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
              type="button"
            >
              Yes
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ---------- small components ----------
function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gray-100 text-gray-700">
          {icon}
        </div>
        <div>
          <div className="text-xl font-bold text-gray-900">{value}</div>
          <div className="text-xs text-gray-500">{label}</div>
        </div>
      </div>
    </div>
  );
}

function Select({ value, onChange, options, icon }) {
  return (
    <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-white">
      {icon ? icon : null}
      <select className="w-full text-sm outline-none bg-transparent" value={value} onChange={onChange}>
        {options.map((opt) =>
          typeof opt === "string" ? (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ) : (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          )
        )}
      </select>
    </div>
  );
}

function Field({ label, children, className }) {
  return (
    <div className={className || ""}>
      <div className="mb-1 text-xs font-semibold text-gray-600">{label}</div>
      {children}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div className="text-sm font-semibold text-gray-900">{title}</div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-gray-100 text-xs font-semibold text-gray-800 hover:bg-gray-200"
            type="button"
          >
            Close
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

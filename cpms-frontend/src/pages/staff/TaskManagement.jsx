// src/pages/staff/TaskManagement.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Plus,
  Search,
  ClipboardList,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Pencil,
} from "lucide-react";
import taskService from "../../services/taskService";
import NewTaskModal from "../model/NewTaskModal";

function cx(...c) {
  return c.filter(Boolean).join(" ");
}

function progressTone(p) {
  if (p >= 80) return "bg-emerald-500/15 text-emerald-200 ring-emerald-500/25";
  if (p >= 40) return "bg-amber-500/15 text-amber-200 ring-amber-500/25";
  return "bg-red-500/15 text-red-200 ring-red-500/25";
}

function ProgressPill({ value }) {
  return (
    <span className={cx("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1", progressTone(value))}>
      {value}%
    </span>
  );
}

function ConfirmDialog({ message, onNo, onYes }) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onNo} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-md overflow-hidden rounded-3xl bg-slate-950/60 shadow-2xl shadow-black/40 ring-1 ring-white/10 backdrop-blur-xl">
          <div className="px-6 py-5">
            <h3 className="text-base font-extrabold text-white">Confirm Delete</h3>
            <p className="mt-2 text-sm text-white/65">{message}</p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={onNo}
                className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/15 ring-1 ring-white/10"
                type="button"
              >
                No
              </button>
              <button
                onClick={onYes}
                className="rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 px-4 py-2 text-sm font-extrabold text-white shadow-lg shadow-red-600/20 hover:opacity-95"
                type="button"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [q, setQ] = useState("");

  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [confirmId, setConfirmId] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await taskService.getAll();
      setTasks(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to load tasks:", e);
      setError("Failed to load tasks. Please try again.");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = [...tasks];

    if (needle) {
      list = list.filter((t) =>
        [t.title, t.projectTitle, t.assignedTo?.name, t.assignedTo?.email]
          .filter(Boolean)
          .some((s) => String(s).toLowerCase().includes(needle))
      );
    }

    // sort by progress desc (example)
    list.sort((a, b) => (b.progress ?? 0) - (a.progress ?? 0));
    return list;
  }, [tasks, q]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => (t.progress ?? 0) >= 100).length;
    const openCount = total - done;
    const highAttention = tasks.filter((t) => (t.progress ?? 0) < 30).length;
    return { total, openCount, done, highAttention };
  }, [tasks]);

  const openCreate = () => {
    setSelectedTask(null);
    setOpen(true);
  };

  const openEdit = (t) => {
    setSelectedTask(t);
    setOpen(true);
  };

  const doDelete = async (id) => {
    try {
      setLoading(true);
      await taskService.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      console.error("Delete error:", e);
      alert(`Failed to delete: ${e.response?.data?.message || e.message}`);
    } finally {
      setLoading(false);
    }
  };

  // quick toggle: 0 <-> 100
  const toggleDone = async (t) => {
    try {
      const payload = {
        title: t.title,
        progress: t.progress >= 100 ? 0 : 100,
        projectId: t.projectId,
        assignedToId: t.assignedTo?.id ?? null,
      };

      const updated = await taskService.update(t.id, payload);
      setTasks((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
    } catch (e) {
      console.error("Toggle error:", e);
    }
  };

  return (
    <div className="flex-1 min-h-screen p-6 bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 h-[380px] w-[680px] rounded-full bg-cyan-500/15 blur-3xl" />
      </div>

      <div className="relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Task Management</h1>
            <p className="text-sm text-white/60 mt-1">
              Backend fields: title, progress, project, assignedTo
            </p>
            {error && (
              <div className="mt-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                {error}
              </div>
            )}
          </div>

          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:opacity-95"
            type="button"
          >
            <Plus size={18} /> New Task
          </button>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard icon={<ClipboardList size={18} />} label="Total" value={stats.total} />
          <StatCard icon={<AlertTriangle size={18} />} label="Open" value={stats.openCount} />
          <StatCard icon={<CheckCircle2 size={18} />} label="Done" value={stats.done} />
          <StatCard icon={<AlertTriangle size={18} />} label="Low Progress" value={stats.highAttention} />
        </div>

        {/* Search */}
        <div className="mt-6 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-xl ring-1 ring-white/10 shadow-lg shadow-black/20">
          <div className="flex items-center gap-2 border border-white/20 rounded-xl px-3 py-2 bg-white/5">
            <Search size={16} className="text-white/40" />
            <input
              placeholder="Search by title, project, assigned user..."
              className="w-full text-sm outline-none bg-transparent text-white placeholder-white/40"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>

        {/* List */}
        <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl ring-1 ring-white/10 shadow-lg shadow-black/20">
          <div className="border-b border-white/10 px-5 py-4">
            <h2 className="text-sm font-semibold text-white">
              Tasks <span className="text-white/45">({filtered.length})</span>
            </h2>
          </div>

          {filtered.length === 0 ? (
            <div className="p-10 text-center text-sm text-white/45">
              {loading ? "Loading..." : "No tasks found."}
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {filtered.map((t) => (
                <div
                  key={t.id}
                  className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 px-5 py-4 hover:bg-white/5 transition"
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleDone(t)}
                      className={cx(
                        "mt-0.5 grid h-6 w-6 place-items-center rounded-lg border",
                        t.progress >= 100
                          ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300"
                          : "border-white/20 bg-white/5 text-white/60 hover:bg-white/10"
                      )}
                      type="button"
                      title={t.progress >= 100 ? "Mark as not done" : "Mark as done"}
                    >
                      <CheckCircle2 size={16} />
                    </button>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-white">
                        {t.title}
                        <ProgressPill value={t.progress ?? 0} />
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-white/60">
                        <span className="rounded-full bg-white/5 px-2.5 py-1 ring-1 ring-white/10">
                          Project: <span className="text-white/80">{t.projectTitle || "-"}</span>
                        </span>

                        <span className="rounded-full bg-white/5 px-2.5 py-1 ring-1 ring-white/10">
                          Assigned:{" "}
                          <span className="text-white/80">
                            {t.assignedTo?.name || t.assignedTo?.email || "Unassigned"}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 md:justify-end">
                    <button
                      onClick={() => openEdit(t)}
                      className="px-3 py-2 text-xs bg-white/10 text-white/80 rounded-xl hover:bg-white/15 flex items-center gap-2 border border-white/20"
                      type="button"
                    >
                      <Pencil size={14} /> Edit
                    </button>

                    <button
                      onClick={() => setConfirmId(t.id)}
                      className="px-3 py-2 text-xs bg-red-600/20 text-red-300 rounded-xl hover:bg-red-600/30 flex items-center gap-2 border border-red-500/30"
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

        {/* Modal */}
        {open && (
          <NewTaskModal
            task={selectedTask}
            onClose={() => {
              setOpen(false);
              setSelectedTask(null);
            }}
            onSuccess={(saved) => {
              setTasks((prev) => {
                const exists = prev.some((t) => t.id === saved.id);
                if (exists) return prev.map((t) => (t.id === saved.id ? saved : t));
                return [saved, ...prev];
              });
              setOpen(false);
              setSelectedTask(null);
            }}
          />
        )}

        {/* Confirm Delete */}
        {confirmId && (
          <ConfirmDialog
            message="Are you sure you want to delete this task? This cannot be undone."
            onNo={() => setConfirmId(null)}
            onYes={() => {
              doDelete(confirmId);
              setConfirmId(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl ring-1 ring-white/10 shadow-lg shadow-black/20">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white/80">
          {icon}
        </div>
        <div>
          <div className="text-xl font-bold text-white">{value}</div>
          <div className="text-xs text-white/60">{label}</div>
        </div>
      </div>
    </div>
  );
}

// src/pages/model/NewTaskModal.jsx
import { X, Loader2, AlertTriangle } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const EMPTY_FORM = {
  id: null,
  title: "",
  progress: 0,
  projectId: "",
  assignedToId: "",
};

function cx(...c) {
  return c.filter(Boolean).join(" ");
}

function toNumberOrNull(v) {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function taskToForm(t) {
  if (!t) return { ...EMPTY_FORM };
  return {
    ...EMPTY_FORM,
    id: t.id ?? null,
    title: t.title ?? "",
    progress: typeof t.progress === "number" ? t.progress : 0,
    projectId: t.projectId != null ? String(t.projectId) : "",
    assignedToId: t.assignedTo?.id != null ? String(t.assignedTo.id) : "",
  };
}

function displayUser(u) {
  const name = u?.name || u?.fullName || u?.username || "";
  const email = u?.email || "";
  const role = u?.role || "";
  if (name && email) return `${name} (${email})`;
  if (name) return name;
  if (email) return email;
  return `User #${u?.id ?? ""}${role ? ` (${role})` : ""}`;
}

export default function NewTaskModal({ onClose, task = null, onSuccess }) {
  const [form, setForm] = useState(() => taskToForm(task));
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingDeps, setLoadingDeps] = useState(true);
  const [depsError, setDepsError] = useState("");

  useEffect(() => {
    setForm(taskToForm(task));
  }, [task]);

  const editMode = useMemo(() => Boolean(task?.id ?? form.id), [task?.id, form.id]);

  // ✅ ESC to close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const fetchDeps = useCallback(async () => {
    setLoadingDeps(true);
    setDepsError("");
    try {
      const projectsRes = await api.get("/api/projects");
      const projectsData = projectsRes?.data?.data ?? projectsRes?.data ?? [];
      setProjects(Array.isArray(projectsData) ? projectsData : []);

      const usersRes = await api.get("/api/users");
      const usersData = usersRes?.data?.data ?? usersRes?.data ?? [];
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data ||
        e?.message ||
        "Failed to load projects/users";
      setDepsError(String(msg));
      setProjects([]);
      setUsers([]);
    } finally {
      setLoadingDeps(false);
    }
  }, []);

  useEffect(() => {
    fetchDeps();
  }, [fetchDeps]);

  const assignableUsers = useMemo(() => {
    const allowed = new Set(["ENGINEER", "WORKER", "STAFF", "MANAGER"]);
    return users.filter((u) => allowed.has(String(u?.role || "").toUpperCase()));
  }, [users]);

  const validate = useCallback(() => {
    setFormError("");

    if (!form.title?.trim()) return "Title is required";
    const pid = toNumberOrNull(form.projectId);
    if (pid == null) return "Project is required";

    const prog = Number(form.progress);
    if (!Number.isFinite(prog) || prog < 0 || prog > 100) return "Progress must be 0-100";

    return "";
  }, [form]);

  const handleSave = useCallback(async () => {
    const err = validate();
    if (err) return setFormError(err);

    const payload = {
      title: form.title.trim(),
      progress: Number(form.progress),
      projectId: toNumberOrNull(form.projectId),
      assignedToId: toNumberOrNull(form.assignedToId),
    };

    setIsSaving(true);
    setFormError("");

    try {
      let res;
      if (editMode) {
        const id = task?.id ?? form.id;
        if (!id) throw new Error("Missing task id for update");
        res = await api.put(`/api/tasks/${id}`, payload);
      } else {
        res = await api.post(`/api/tasks`, payload);
      }

      // ✅ handle both: {data: ...} or direct dto
      const saved = res?.data?.data ?? res?.data;
      onSuccess?.(saved);
      onClose?.();
    } catch (e) {
      console.error("Task save error:", e);
      const msg =
        e?.response?.data?.message ||
        (typeof e?.response?.data === "string" ? e.response.data : "") ||
        e?.message ||
        "Save failed";
      setFormError(String(msg));
    } finally {
      setIsSaving(false);
    }
  }, [validate, form, editMode, task?.id, onSuccess, onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      // ✅ use onClick (NOT onMouseDown)
      onClick={() => onClose?.()}
    >
      <div
        className="bg-slate-950 w-full max-w-2xl rounded-3xl shadow-2xl shadow-black/40 ring-1 ring-white/10 backdrop-blur-xl"
        // ✅ stop bubbling so clicks inside don't close modal
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {editMode ? "Edit Task" : "New Task"}
            </h2>
            <p className="text-xs text-white/50 mt-1">
              Backend:{" "}
              <span className="font-mono">
                {editMode ? `PUT /api/tasks/{id}` : "POST /api/tasks"}
              </span>
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
            type="button"
            className="text-white/60 hover:text-white transition p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {depsError && (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="mt-0.5" />
                <div className="flex-1">
                  <div className="font-bold">Failed to load data</div>
                  <div className="text-rose-100/80">{depsError}</div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fetchDeps();
                    }}
                    className="mt-2 inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-bold ring-1 ring-white/15 hover:bg-white/15"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          )}

          {formError && (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              <div className="font-bold">Validation failed</div>
              <div className="text-amber-100/80">{formError}</div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-white/90 mb-2">
              Title <span className="text-red-300">*</span>
            </label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Task title"
              className="w-full border border-white/20 bg-white/5 rounded-xl px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-cyan-500/50 focus:bg-white/10 focus:ring-1 focus:ring-cyan-500/20"
            />
          </div>

          {/* Project + Assigned */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">
                Project <span className="text-red-300">*</span>
              </label>

              <div className="relative">
                <select
                  value={form.projectId}
                  onChange={(e) => setForm((f) => ({ ...f, projectId: e.target.value }))}
                  disabled={loadingDeps}
                  className="w-full border border-white/20 bg-white/5 rounded-xl px-4 py-3 text-white outline-none transition focus:border-cyan-500/50 focus:bg-white/10 focus:ring-1 focus:ring-cyan-500/20 appearance-none disabled:opacity-60"
                >
                  <option value="" className="bg-slate-900">
                    {loadingDeps ? "Loading projects..." : "Select project"}
                  </option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id} className="bg-slate-900">
                      {p.name || p.title || `Project #${p.id}`}
                    </option>
                  ))}
                </select>

                {loadingDeps && (
                  <Loader2
                    className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-white/50"
                    size={18}
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">
                Assigned To (optional)
              </label>

              <div className="relative">
                <select
                  value={form.assignedToId}
                  onChange={(e) => setForm((f) => ({ ...f, assignedToId: e.target.value }))}
                  disabled={loadingDeps}
                  className="w-full border border-white/20 bg-white/5 rounded-xl px-4 py-3 text-white outline-none transition focus:border-cyan-500/50 focus:bg-white/10 focus:ring-1 focus:ring-cyan-500/20 appearance-none disabled:opacity-60"
                >
                  <option value="" className="bg-slate-900">
                    {loadingDeps ? "Loading users..." : "Unassigned"}
                  </option>
                  {assignableUsers.map((u) => (
                    <option key={u.id} value={u.id} className="bg-slate-900">
                      {displayUser(u)}
                    </option>
                  ))}
                </select>

                {loadingDeps && (
                  <Loader2
                    className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-white/50"
                    size={18}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Progress */}
          <div>
            <label className="block text-sm font-semibold text-white/90 mb-2">
              Progress (0–100) <span className="text-red-300">*</span>
            </label>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min={0}
                max={100}
                value={form.progress}
                onChange={(e) => setForm((f) => ({ ...f, progress: e.target.value }))}
                className="w-40 border border-white/20 bg-white/5 rounded-xl px-4 py-3 text-white outline-none transition focus:border-cyan-500/50 focus:bg-white/10 focus:ring-1 focus:ring-cyan-500/20"
              />
              <div className="flex-1">
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-cyan-500"
                    style={{
                      width: `${Math.max(0, Math.min(100, Number(form.progress) || 0))}%`,
                    }}
                  />
                </div>
                <div className="mt-2 text-xs text-white/50">
                  {Math.max(0, Math.min(100, Number(form.progress) || 0))}% completed
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose?.();
              }}
              type="button"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl border border-white/20 bg-white/5 text-white/80 font-semibold hover:bg-white/10 hover:text-white transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              type="button"
              disabled={isSaving}
              className={cx(
                "px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-blue-600/20 hover:opacity-95 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
                isSaving && "pointer-events-none"
              )}
            >
              {isSaving ? "Saving..." : editMode ? "Update" : "Save"}
            </button>
          </div>

          <div className="text-xs text-white/45">
            Required: <span className="font-mono">title, projectId, progress</span>
          </div>
        </div>
      </div>
    </div>
  );
}

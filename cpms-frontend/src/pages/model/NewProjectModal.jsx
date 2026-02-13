import { X, Loader2, AlertTriangle } from "lucide-react";
import { useState, useCallback, useEffect, useMemo } from "react";
import axios from "axios";

const EMPTY_FORM = {
  id: null,
  name: "",
  description: "",
  location: "",
  startDate: "",
  status: "Planning",
  customerId: "",
  managerId: "",
  customer: "",
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function cx(...c) {
  return c.filter(Boolean).join(" ");
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

function toNumberOrNull(v) {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function projectToForm(p) {
  if (!p) return { ...EMPTY_FORM };
  return {
    ...EMPTY_FORM,
    id: p.id ?? null,
    name: p.name ?? "",
    description: p.description ?? "",
    location: p.location ?? "",
    startDate: p.startDate ?? "",
    status: p.status ?? "Planning",
    customerId: p.customerId != null ? String(p.customerId) : "",
    managerId: p.managerId != null ? String(p.managerId) : "",
    customer: p.customer ?? "",
  };
}

export default function NewProjectModal({
  onClose,
  project = null,
  isEdit = false,
  onSuccess,
}) {
  const [form, setForm] = useState(() => projectToForm(project));
  const [isSaving, setIsSaving] = useState(false);

  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");
  const [users, setUsers] = useState([]);

  const [formError, setFormError] = useState("");

  // ✅ ALWAYS keep form synced with project
  useEffect(() => {
    setForm(projectToForm(project));
  }, [project]);

  // ✅ derive editMode even if parent forgot isEdit
  const editMode = useMemo(() => {
    const pid = project?.id ?? form?.id;
    return Boolean(pid); // if we have an id -> update mode
  }, [project?.id, form?.id]);

  const handleClose = useCallback(() => {
    if (onClose && typeof onClose === "function") onClose();
  }, [onClose]);

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    setUsersError("");
    try {
      const res = await api.get("/api/users");
      const data = res?.data?.data ?? res?.data ?? [];
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data ||
        e?.message ||
        "Failed to load users";
      setUsersError(String(msg));
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const customers = useMemo(
    () => users.filter((u) => String(u?.role || "").toUpperCase() === "CUSTOMER"),
    [users]
  );

  const managers = useMemo(
    () => users.filter((u) => String(u?.role || "").toUpperCase() === "MANAGER"),
    [users]
  );

  const validate = useCallback(() => {
    setFormError("");

    if (!form.name?.trim()) return "Project name is required";
    if (!form.location?.trim()) return "Location is required";
    if (!form.startDate?.trim()) return "Start date is required";
    if (!form.status?.trim()) return "Status is required";

    const mid = toNumberOrNull(form.managerId);
    if (mid === null) return "Manager is required";

    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.startDate.trim())) {
      return "Start date must be YYYY-MM-DD";
    }

    if (editMode && !(project?.id ?? form.id)) {
      return "Missing project id for update";
    }

    return "";
  }, [form, editMode, project?.id]);

  const buildPayload = useCallback(() => {
    return {
      name: form.name.trim(),
      description: form.description?.trim() || null,
      location: form.location.trim(),
      startDate: form.startDate.trim(),
      status: form.status.trim(),

      customerId: toNumberOrNull(form.customerId),
      managerId: toNumberOrNull(form.managerId),

      customer: form.customer?.trim() || null,
    };
  }, [form]);

  const handleSave = useCallback(async () => {
    console.log("[ProjectModal] Save clicked", { editMode, form, project });

    const err = validate();
    if (err) return setFormError(err);

    const payload = buildPayload();
    const idToUpdate = project?.id ?? form.id;

    setIsSaving(true);
    setFormError("");

    try {
      let res;
      if (editMode) {
        res = await api.put(`/api/projects/${idToUpdate}`, payload);
      } else {
        res = await api.post(`/api/projects`, payload);
      }

      if (onSuccess) onSuccess(res?.data);
      handleClose();
    } catch (e) {
      console.error("Save error:", e);
      const msg =
        e?.response?.data?.message ||
        (typeof e?.response?.data === "string" ? e.response.data : "") ||
        e?.message ||
        "Save failed";
      setFormError(String(msg));
    } finally {
      setIsSaving(false);
    }
  }, [validate, buildPayload, editMode, project, form, onSuccess, handleClose]);

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      // ✅ better than click: avoids accidental close while clicking inside on some browsers
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className="bg-slate-950 w-full max-w-2xl rounded-3xl shadow-2xl shadow-black/40 ring-1 ring-white/10 backdrop-blur-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {editMode ? "Edit Project" : "New Project"}
            </h2>
            <p className="text-xs text-white/50 mt-1">
              Mode:{" "}
              <span className="font-mono">
                {editMode ? `EDIT (id=${project?.id ?? form.id})` : "CREATE"}
              </span>
            </p>
          </div>

          <button
            onClick={handleClose}
            type="button"
            className="text-white/60 hover:text-white transition p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {usersError && (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="mt-0.5" />
                <div className="flex-1">
                  <div className="font-bold">Failed to load users</div>
                  <div className="text-rose-100/80">{usersError}</div>
                  <button
                    type="button"
                    onClick={fetchUsers}
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
              <div className="font-bold">Save failed</div>
              <div className="text-amber-100/80">{formError}</div>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-white/90 mb-2">
              Project Name <span className="text-red-300">*</span>
            </label>
            <input
              placeholder="Enter project name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full border border-white/20 bg-white/5 rounded-xl px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-cyan-500/50 focus:bg-white/10 focus:ring-1 focus:ring-cyan-500/20"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-white/90 mb-2">
              Location <span className="text-red-300">*</span>
            </label>
            <input
              placeholder="Enter project location"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              className="w-full border border-white/20 bg-white/5 rounded-xl px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-cyan-500/50 focus:bg-white/10 focus:ring-1 focus:ring-cyan-500/20"
            />
          </div>

          {/* Manager + Customer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">
                Manager <span className="text-red-300">*</span>
              </label>
              <div className="relative">
                <select
                  value={form.managerId}
                  onChange={(e) => setForm((f) => ({ ...f, managerId: e.target.value }))}
                  disabled={usersLoading}
                  className="w-full border border-white/20 bg-white/5 rounded-xl px-4 py-3 text-white outline-none transition focus:border-cyan-500/50 focus:bg-white/10 focus:ring-1 focus:ring-cyan-500/20 appearance-none disabled:opacity-60"
                >
                  <option value="" className="bg-slate-900">
                    {usersLoading ? "Loading managers..." : "Select manager"}
                  </option>
                  {managers.map((u) => (
                    <option key={u.id} value={u.id} className="bg-slate-900">
                      {displayUser(u)}
                    </option>
                  ))}
                </select>

                {usersLoading && (
                  <Loader2
                    className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-white/50"
                    size={18}
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">
                Customer (optional)
              </label>

              <div className="relative">
                <select
                  value={form.customerId}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      customerId: e.target.value,
                      customer: "",
                    }))
                  }
                  disabled={usersLoading}
                  className="w-full border border-white/20 bg-white/5 rounded-xl px-4 py-3 text-white outline-none transition focus:border-cyan-500/50 focus:bg-white/10 focus:ring-1 focus:ring-cyan-500/20 appearance-none disabled:opacity-60"
                >
                  <option value="" className="bg-slate-900">
                    {usersLoading ? "Loading customers..." : "Select customer (optional)"}
                  </option>
                  {customers.map((u) => (
                    <option key={u.id} value={u.id} className="bg-slate-900">
                      {displayUser(u)}
                    </option>
                  ))}
                </select>

                {usersLoading && (
                  <Loader2
                    className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-white/50"
                    size={18}
                  />
                )}
              </div>

              <div className="mt-3">
                <label className="block text-xs font-semibold text-white/70 mb-2">
                  Customer (fallback name/email) — optional
                </label>
                <input
                  placeholder="Only if customerId not selected"
                  value={form.customer}
                  onChange={(e) => setForm((f) => ({ ...f, customer: e.target.value }))}
                  className="w-full border border-white/20 bg-white/5 rounded-xl px-4 py-2.5 text-white placeholder-white/40 outline-none transition focus:border-cyan-500/50 focus:bg-white/10 focus:ring-1 focus:ring-cyan-500/20"
                />
              </div>
            </div>
          </div>

          {/* Start Date + Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">
                Start Date <span className="text-red-300">*</span>
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                className="w-full border border-white/20 bg-white/5 rounded-xl px-4 py-3 text-white outline-none transition focus:border-cyan-500/50 focus:bg-white/10 focus:ring-1 focus:ring-cyan-500/20"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">
                Status <span className="text-red-300">*</span>
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="w-full border border-white/20 bg-white/5 rounded-xl px-4 py-3 text-white outline-none transition focus:border-cyan-500/50 focus:bg-white/10 focus:ring-1 focus:ring-cyan-500/20 appearance-none"
              >
                <option className="bg-slate-900" value="Planning">Planning</option>
                <option className="bg-slate-900" value="Design">Design</option>
                <option className="bg-slate-900" value="Construction">Construction</option>
                <option className="bg-slate-900" value="Finishing">Finishing</option>
                <option className="bg-slate-900" value="Handover">Handover</option>
                <option className="bg-slate-900" value="On Hold">On Hold</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-white/90 mb-2">
              Description
            </label>
            <textarea
              placeholder="Enter project description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={4}
              className="w-full border border-white/20 bg-white/5 rounded-xl px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-cyan-500/50 focus:bg-white/10 focus:ring-1 focus:ring-cyan-500/20 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              onClick={handleClose}
              type="button"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl border border-white/20 bg-white/5 text-white/80 font-semibold hover:bg-white/10 hover:text-white transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                console.log("[ProjectModal] button click fired");
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
            Backend:{" "}
            <span className="font-mono">
              {editMode ? `PUT /api/projects/${project?.id ?? form.id}` : "POST /api/projects"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 
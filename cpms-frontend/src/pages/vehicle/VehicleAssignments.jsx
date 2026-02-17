// src/pages/vehicle/VehicleAssignment.jsx
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  X,
  Plus,
  Loader2,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Ban,
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({ baseURL: BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


const ENDPOINTS = {
  vehicles: "/api/vehicles",
  projects: "/api/projects",
  workers: "/api/workers",
  assignments: "/api/vehicle-assignments",
  assignmentById: (id) => `/api/vehicle-assignments/${id}`,
};

function extractAxiosError(e) {
  if (!e?.response) return "Network error. Check backend running + CORS.";
  const s = e.response.status;
  if (s === 401) return "Unauthorized (401). Login again.";
  if (s === 403) return "Forbidden (403). Your role has no access.";
  return (
    e.response.data?.message ||
    e.response.data?.error ||
    `Request failed (${s}).`
  );
}

// label helpers
function vehicleLabel(v) {
  if (!v) return "";
  return v.regNumber || v.reg_number || v.vehicleNumber || `Vehicle #${v.id}`;
}
function projectLabel(p) {
  if (!p) return "";
  return p.title || p.name || p.projectName || p.location || `Project #${p.id}`;
}
function workerLabel(w) {
  if (!w) return "";
  return w.name || w.fullName || w.workerName || w.email || `Worker #${w.id}`;
}

function prettyEnum(v) {
  return String(v || "")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function fmtDate(d) {
  if (!d) return "—";
  return d; // LocalDate => YYYY-MM-DD
}

function statusBadge(status) {
  const s = String(status || "").toUpperCase();
  if (s === "ASSIGNED")
    return "bg-amber-500/20 text-amber-200 ring-amber-500/30";
  if (s === "COMPLETED")
    return "bg-emerald-500/20 text-emerald-200 ring-emerald-500/30";
  if (s === "CANCELLED")
    return "bg-rose-500/20 text-rose-200 ring-rose-500/30";
  return "bg-white/10 text-white/70 ring-white/20";
}

export default function VehicleAssignment() {
  const role = (localStorage.getItem("role") || "").replace("ROLE_", "");
  const isAllowed = ["SUPERADMIN", "ADMIN", "MANAGER"].includes(role);

  // data
  const [vehicles, setVehicles] = useState([]);
  const [projects, setProjects] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [assignments, setAssignments] = useState([]);

  // ui
  const [err, setErr] = useState("");
  const [loadingLists, setLoadingLists] = useState(false);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);

  // filters (table)
  const [q, setQ] = useState("");

  // create form
  const EMPTY_FORM = useMemo(
    () => ({
      vehicleId: "",
      projectId: "",
      workerId: "",
      startDate: "",
    }),
    []
  );
  const [form, setForm] = useState(EMPTY_FORM);

  // -------- fetchers --------
  async function fetchLists() {
    setLoadingLists(true);
    setErr("");
    try {
      const [vRes, pRes, wRes] = await Promise.all([
        api.get(ENDPOINTS.vehicles),
        api.get(ENDPOINTS.projects),
        api.get(ENDPOINTS.workers),
      ]);

      const vArr = Array.isArray(vRes.data) ? vRes.data : vRes.data?.data || [];
      const pArr = Array.isArray(pRes.data) ? pRes.data : pRes.data?.data || [];
      const wArr = Array.isArray(wRes.data) ? wRes.data : wRes.data?.data || [];

      setVehicles(vArr);
      setProjects(pArr);
      setWorkers(wArr);
    } catch (e) {
      setErr(extractAxiosError(e));
      setVehicles([]);
      setProjects([]);
      setWorkers([]);
    } finally {
      setLoadingLists(false);
    }
  }

  async function fetchAssignments() {
    setLoadingAssignments(true);
    setErr("");
    try {
      const res = await api.get(ENDPOINTS.assignments);
      const arr = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setAssignments(arr.slice().sort((a, b) => (b.id || 0) - (a.id || 0)));
    } catch (e) {
      setErr(extractAxiosError(e));
      setAssignments([]);
    } finally {
      setLoadingAssignments(false);
    }
  }

  useEffect(() => {
    if (!isAllowed) return;
    fetchLists();
    fetchAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ available vehicles = active + AVAILABLE
  const availableVehicles = useMemo(() => {
    return vehicles.filter(
      (v) =>
        (v.active ?? true) &&
        String(v.status || "").toUpperCase() === "AVAILABLE"
    );
  }, [vehicles]);

  // ✅ available workers = workers that are NOT currently in an ASSIGNED assignment
  // (Since WorkerModel has no "status" field, this is the correct way from DB)
  const busyWorkerIds = useMemo(() => {
    const set = new Set();
    assignments.forEach((a) => {
      if (String(a.status || "").toUpperCase() === "ASSIGNED") {
        if (a.workerId != null) set.add(String(a.workerId));
      }
    });
    return set;
  }, [assignments]);

  const availableWorkers = useMemo(() => {
    return workers.filter((w) => !busyWorkerIds.has(String(w.id)));
  }, [workers, busyWorkerIds]);

  // Map ids to names for table display
  const projectById = useMemo(() => {
    const m = new Map();
    projects.forEach((p) => m.set(String(p.id), p));
    return m;
  }, [projects]);

  const workerById = useMemo(() => {
    const m = new Map();
    workers.forEach((w) => m.set(String(w.id), w));
    return m;
  }, [workers]);

  const vehicleById = useMemo(() => {
    const m = new Map();
    vehicles.forEach((v) => m.set(String(v.id), v));
    return m;
  }, [vehicles]);

  // Table search
  const filteredAssignments = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return assignments;

    return assignments.filter((a) => {
      const vehicleTxt =
        a.vehicleRegNumber ||
        vehicleLabel(vehicleById.get(String(a.vehicleId))) ||
        "";
      const projectTxt =
        a.projectTitle ||
        projectLabel(projectById.get(String(a.projectId))) ||
        "";
      const workerTxt =
        a.workerName ||
        workerLabel(workerById.get(String(a.workerId))) ||
        "";

      return [
        vehicleTxt,
        projectTxt,
        workerTxt,
        a.status,
        a.startDate,
        a.endDate,
      ]
        .filter(Boolean)
        .some((x) => String(x).toLowerCase().includes(query));
    });
  }, [assignments, q, projectById, workerById, vehicleById]);

  // -------- actions --------
  function openCreate() {
    setErr("");
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function closeModal() {
    if (saving) return;
    setShowForm(false);
    setForm(EMPTY_FORM);
  }

  async function createAssignment() {
    setErr("");

    if (!form.vehicleId) return setErr("Please select a vehicle.");
    if (!form.projectId) return setErr("Please select a site/project.");
    if (!form.workerId) return setErr("Please select an operator/worker.");
    if (!form.startDate) return setErr("Please select a start date.");

    setSaving(true);
    try {
      const payload = {
        vehicleId: Number(form.vehicleId),
        projectId: Number(form.projectId),
        workerId: Number(form.workerId),
        startDate: form.startDate,
      };

      await api.post(ENDPOINTS.assignments, payload);

      // refresh everything (vehicles/workers availability changes)
      await Promise.all([fetchAssignments(), fetchLists()]);
      closeModal();
    } catch (e) {
      setErr(extractAxiosError(e));
    } finally {
      setSaving(false);
    }
  }

  async function updateAssignmentStatus(id, status) {
    setErr("");
    const ok = confirm(`Change status to ${status}?`);
    if (!ok) return;

    try {
      await api.put(ENDPOINTS.assignmentById(id), { status });
      await Promise.all([fetchAssignments(), fetchLists()]);
    } catch (e) {
      setErr(extractAxiosError(e));
    }
  }

  async function deleteAssignment(id) {
    setErr("");
    const ok = confirm("Delete this assignment?");
    if (!ok) return;

    try {
      await api.delete(ENDPOINTS.assignmentById(id));
      await Promise.all([fetchAssignments(), fetchLists()]);
    } catch (e) {
      setErr(extractAxiosError(e));
    }
  }

  if (!isAllowed) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-950 text-white">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-400">
            Access denied. Admins only.
          </p>
          <p className="text-sm text-white/60 mt-2">
            Please log in with an admin account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[100dvh] bg-slate-950 text-white">
      {/* Glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[1100px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 h-[500px] w-[950px] rounded-full bg-cyan-500/15 blur-3xl" />
      </div>

      {/* ✅ CENTER FIX: wrap everything in max width + mx-auto */}
      <main className="relative p-6 md:p-10 w-full">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Vehicle Assignment
            </h1>
            <p className="mt-2 text-sm text-white/65">
              Assign construction vehicles to sites and operators
            </p>
          </div>

          {err && (
            <div className="mb-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              <div className="font-bold">Error</div>
              <div className="text-rose-100/80 mt-1 break-words">{err}</div>
            </div>
          )}

          {/* Top bar */}
          <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-xl shadow-lg shadow-black/20 mb-6">
            {/* ✅ CENTER FIX: use grid so it never overflows right */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-center">
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <div className="text-sm text-white/60">
                  {(loadingLists || loadingAssignments) ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="animate-spin" size={16} />
                      Loading data...
                    </span>
                  ) : (
                    <span className="inline-flex flex-wrap gap-x-2 gap-y-1">
                      <span>
                        Vehicles: <b className="text-white/85">{vehicles.length}</b>
                      </span>
                      <span>•</span>
                      <span>
                        Available:{" "}
                        <b className="text-white/85">{availableVehicles.length}</b>
                      </span>
                      <span>•</span>
                      <span>
                        Projects: <b className="text-white/85">{projects.length}</b>
                      </span>
                      <span>•</span>
                      <span>
                        Workers: <b className="text-white/85">{workers.length}</b>
                      </span>
                      <span>•</span>
                      <span>
                        Available Workers:{" "}
                        <b className="text-white/85">{availableWorkers.length}</b>
                      </span>
                      <span>•</span>
                      <span>
                        Assignments:{" "}
                        <b className="text-white/85">{assignments.length}</b>
                      </span>
                    </span>
                  )}
                </div>

                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search assignments (vehicle / project / worker / status)..."
                  className="w-full sm:w-[380px] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-cyan-500/40 focus:ring-4 focus:ring-cyan-500/10 transition"
                />
              </div>

              <div className="flex gap-3 justify-start lg:justify-end flex-wrap">
                <button
                  onClick={() => Promise.all([fetchLists(), fetchAssignments()])}
                  className="inline-flex items-center gap-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-3 text-sm font-semibold text-white/90 transition disabled:opacity-60"
                  type="button"
                  disabled={loadingLists || loadingAssignments}
                >
                  <RefreshCw size={18} />
                  Refresh
                </button>

                <button
                  onClick={openCreate}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-white font-semibold shadow-lg shadow-blue-600/25 hover:opacity-95 transition"
                  type="button"
                >
                  <Plus size={18} />
                  Create Assignment
                </button>
              </div>
            </div>
          </div>

          {/* Assignments table */}
          <div className="overflow-x-auto rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur-xl shadow-lg shadow-black/20">
            <table className="w-full">
              <thead className="bg-white/10 border-b border-white/10">
                <tr>
                  <th className="p-4 text-left text-sm font-bold text-white/80">Vehicle</th>
                  <th className="p-4 text-left text-sm font-bold text-white/80">Project</th>
                  <th className="p-4 text-left text-sm font-bold text-white/80">Worker</th>
                  <th className="p-4 text-center text-sm font-bold text-white/80">Start</th>
                  <th className="p-4 text-center text-sm font-bold text-white/80">End</th>
                  <th className="p-4 text-center text-sm font-bold text-white/80">Status</th>
                  <th className="p-4 text-center text-sm font-bold text-white/80">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {loadingAssignments ? (
                  <tr>
                    <td colSpan={7} className="p-10 text-center text-white/60">
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="animate-spin" size={16} />
                        Loading assignments...
                      </span>
                    </td>
                  </tr>
                ) : filteredAssignments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-10 text-center text-white/60">
                      {q ? "No assignments found for your search." : "No assignments yet."}
                    </td>
                  </tr>
                ) : (
                  filteredAssignments.map((a) => {
                    const vehicleTxt =
                      a.vehicleRegNumber ||
                      vehicleLabel(vehicleById.get(String(a.vehicleId)));

                    const projectTxt =
                      a.projectTitle ||
                      projectLabel(projectById.get(String(a.projectId)));

                    const workerTxt =
                      a.workerName ||
                      workerLabel(workerById.get(String(a.workerId)));

                    const s = String(a.status || "").toUpperCase();

                    return (
                      <tr key={a.id} className="hover:bg-white/5 transition">
                        <td className="p-4 text-sm font-semibold text-white">
                          {vehicleTxt || "—"}
                        </td>

                        <td className="p-4 text-sm text-white/80">
                          <div className="font-semibold">{projectTxt || "—"}</div>
                          {a.projectLocation && (
                            <div className="text-xs text-white/50 mt-1">
                              {a.projectLocation}
                            </div>
                          )}
                        </td>

                        <td className="p-4 text-sm text-white/80">{workerTxt || "—"}</td>

                        <td className="p-4 text-center text-sm text-white/80">
                          {fmtDate(a.startDate)}
                        </td>

                        <td className="p-4 text-center text-sm text-white/80">
                          {fmtDate(a.endDate)}
                        </td>

                        <td className="p-4 text-center">
                          <span
                            className={`inline-flex px-3 py-1 rounded-xl text-xs font-bold ring-1 ${statusBadge(
                              a.status
                            )}`}
                          >
                            {prettyEnum(a.status)}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2 flex-wrap">
                            <button
                              onClick={() => updateAssignmentStatus(a.id, "COMPLETED")}
                              disabled={s !== "ASSIGNED"}
                              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                              type="button"
                              title="Mark Completed"
                            >
                              <CheckCircle2 size={16} />
                              Complete
                            </button>

                            <button
                              onClick={() => updateAssignmentStatus(a.id, "CANCELLED")}
                              disabled={s !== "ASSIGNED"}
                              className="inline-flex items-center gap-2 rounded-xl bg-rose-600/20 px-3 py-2 text-sm font-semibold text-rose-200 ring-1 ring-rose-500/30 hover:bg-rose-600/30 transition disabled:opacity-40 disabled:cursor-not-allowed"
                              type="button"
                              title="Cancel Assignment"
                            >
                              <Ban size={16} />
                              Cancel
                            </button>

                            <button
                              onClick={() => deleteAssignment(a.id)}
                              className="inline-flex items-center gap-2 rounded-xl bg-red-600/20 px-3 py-2 text-sm font-semibold text-red-200 ring-1 ring-red-500/30 hover:bg-red-600/30 transition"
                              type="button"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Create Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="bg-slate-950 border border-white/10 w-full max-w-md rounded-3xl shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <h2 className="text-xl font-extrabold text-white">
                Create Vehicle Assignment
              </h2>
              <button
                onClick={closeModal}
                className="text-white/60 hover:text-white transition"
                type="button"
                title="Close"
                disabled={saving}
              >
                <X />
              </button>
            </div>

            <div className="px-6 py-6 space-y-3">
              {/* Vehicle Select */}
              <div>
                <label className="block text-xs font-bold text-white/70 mb-2">
                  Vehicle
                </label>
                <select
                  value={form.vehicleId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, vehicleId: e.target.value }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-500/40 focus:ring-4 focus:ring-cyan-500/10 transition"
                  disabled={loadingLists}
                >
                  <option value="" className="bg-slate-900">
                    {loadingLists
                      ? "Loading vehicles..."
                      : "Select AVAILABLE vehicle"}
                  </option>
                  {availableVehicles.map((v) => (
                    <option key={v.id} value={v.id} className="bg-slate-900">
                      {vehicleLabel(v)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Project Select */}
              <div>
                <label className="block text-xs font-bold text-white/70 mb-2">
                  Site / Project
                </label>
                <select
                  value={form.projectId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, projectId: e.target.value }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-500/40 focus:ring-4 focus:ring-cyan-500/10 transition"
                  disabled={loadingLists}
                >
                  <option value="" className="bg-slate-900">
                    {loadingLists ? "Loading projects..." : "Select a project"}
                  </option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id} className="bg-slate-900">
                      {projectLabel(p)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Worker Select (✅ ONLY AVAILABLE WORKERS) */}
              <div>
                <label className="block text-xs font-bold text-white/70 mb-2">
                  Operator / Worker (Available only)
                </label>
                <select
                  value={form.workerId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, workerId: e.target.value }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-500/40 focus:ring-4 focus:ring-cyan-500/10 transition"
                  disabled={loadingLists}
                >
                  <option value="" className="bg-slate-900">
                    {loadingLists ? "Loading workers..." : "Select an available worker"}
                  </option>
                  {availableWorkers.map((w) => (
                    <option key={w.id} value={w.id} className="bg-slate-900">
                      {workerLabel(w)}
                    </option>
                  ))}
                </select>

                <p className="mt-2 text-xs text-white/45">
                  Workers already in an <b>ASSIGNED</b> assignment are hidden.
                </p>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-xs font-bold text-white/70 mb-2">
                  Start Date
                </label>
                <input
                  value={form.startDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, startDate: e.target.value }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-500/40 focus:ring-4 focus:ring-cyan-500/10 transition"
                  type="date"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-5 border-t border-white/10">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 rounded-2xl border border-white/10 bg-white/5 text-white/80 font-semibold hover:bg-white/10 transition disabled:opacity-60"
                type="button"
                disabled={saving}
              >
                Cancel
              </button>

              <button
                onClick={createAssignment}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-blue-600/20 hover:opacity-95 transition disabled:opacity-60"
                type="button"
                disabled={saving}
              >
                {saving && <Loader2 className="animate-spin" size={16} />}
                Save Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

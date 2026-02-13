import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Edit2, Trash2, Plus, Search, X, Loader2 } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({ baseURL: BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const ENDPOINTS = {
  list: "/api/vehicles",
  create: "/api/vehicles",
  update: (id) => `/api/vehicles/${id}`,
  delete: (id) => `/api/vehicles/${id}`,
};

const EMPTY_FORM = {
  regNumber: "",
  type: "",
  fuel: "",
  capacity: "",
  machine: "",
  condition: "GOOD",
  status: "AVAILABLE",
  active: true,
};

const CONDITION_OPTIONS = [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "POOR",
  "UNDER_MAINTENANCE",
];

const STATUS_OPTIONS = [
  "AVAILABLE",
  "ASSIGNED",
  "IN_MAINTENANCE",
  "RETIRED",
];

function prettyEnum(v) {
  return String(v || "")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function extractAxiosError(e) {
  if (!e?.response) return "Network error. Check backend running + CORS.";
  const s = e.response.status;
  if (s === 401) return "Unauthorized (401). Login again.";
  if (s === 403) return "Forbidden (403). Your role has no access.";
  return e.response.data?.message || `Request failed (${s}).`;
}

export default function ManageVehicles() {
  // Optional role check (keep your UI logic)
  const role = (localStorage.getItem("role") || "").replace("ROLE_", "");
  const isAllowed = ["SUPERADMIN", "ADMIN", "MANAGER"].includes(role);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const [vehicles, setVehicles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null); // vehicle object
  const [form, setForm] = useState(EMPTY_FORM);

  async function fetchVehicles() {
    setLoading(true);
    setErr("");
    try {
      const res = await api.get(ENDPOINTS.list);
      const arr = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setVehicles(arr);
    } catch (e) {
      setVehicles([]);
      setErr(extractAxiosError(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isAllowed) fetchVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return vehicles;
    return vehicles.filter((v) =>
      [v.regNumber, v.type, v.machine]
        .filter(Boolean)
        .some((x) => String(x).toLowerCase().includes(q))
    );
  }, [vehicles, searchQuery]);

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  }

  function openEdit(v) {
    setEditing(v);
    setForm({
      regNumber: v.regNumber || "",
      type: v.type || "",
      fuel: v.fuel || "",
      capacity: v.capacity || "",
      machine: v.machine || "",
      condition: v.condition || "GOOD",
      status: v.status || "AVAILABLE",
      active: v.active ?? true,
    });
    setShowModal(true);
  }

  function closeModal() {
    if (saving) return;
    setShowModal(false);
    setEditing(null);
    setForm(EMPTY_FORM);
  }

  async function saveVehicle() {
    setErr("");
    if (!form.regNumber.trim()) return setErr("Vehicle Number is required.");
    if (!form.type.trim()) return setErr("Vehicle Type is required.");

    setSaving(true);
    try {
      if (editing?.id) {
        const res = await api.put(ENDPOINTS.update(editing.id), form);
        const updated = res.data?.data ?? res.data;
        setVehicles((prev) =>
          prev.map((x) => (x.id === editing.id ? updated : x))
        );
      } else {
        const res = await api.post(ENDPOINTS.create, form);
        const created = res.data?.data ?? res.data;
        setVehicles((prev) => [created, ...prev]);
      }
      closeModal();
    } catch (e) {
      setErr(extractAxiosError(e));
    } finally {
      setSaving(false);
    }
  }

  async function deleteVehicle(id) {
    setErr("");
    const ok = confirm("Are you sure you want to delete this vehicle?");
    if (!ok) return;

    try {
      await api.delete(ENDPOINTS.delete(id));
      setVehicles((prev) => prev.filter((x) => x.id !== id));
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
      {/* Background glow (Admin Overview style) */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[1100px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 h-[500px] w-[950px] rounded-full bg-cyan-500/15 blur-3xl" />
      </div>

      <main className="relative p-6 md:p-10 w-full">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Manage Vehicles
          </h1>
          <p className="mt-2 text-sm text-white/65">
            Add, edit, and manage your construction vehicle fleet
          </p>
        </div>

        {err && (
          <div className="mb-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            <div className="font-bold">Error</div>
            <div className="text-rose-100/80 mt-1 break-words">{err}</div>
          </div>
        )}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search by vehicle number, type, or machine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pl-10 text-white placeholder-white/40 outline-none focus:border-cyan-500/40 focus:ring-4 focus:ring-cyan-500/10 transition"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchVehicles}
              className="rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-3 text-sm font-semibold text-white/90 transition"
              type="button"
              disabled={loading}
            >
              {loading ? "Loading..." : "Refresh"}
            </button>

            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-white font-semibold shadow-lg shadow-blue-600/25 hover:opacity-95 transition active:scale-[0.99]"
              type="button"
            >
              <Plus size={18} />
              Add Vehicle
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur-xl shadow-lg shadow-black/20">
          <table className="w-full">
            <thead className="bg-white/10 border-b border-white/10">
              <tr>
                <th className="p-4 text-left text-sm font-bold text-white/80">
                  Vehicle Number
                </th>
                <th className="p-4 text-center text-sm font-bold text-white/80">
                  Vehicle Type
                </th>
                <th className="p-4 text-center text-sm font-bold text-white/80">
                  Fuel
                </th>
                <th className="p-4 text-center text-sm font-bold text-white/80">
                  Capacity
                </th>
                <th className="p-4 text-center text-sm font-bold text-white/80">
                  Machine
                </th>
                <th className="p-4 text-center text-sm font-bold text-white/80">
                  Condition
                </th>
                <th className="p-4 text-center text-sm font-bold text-white/80">
                  Status
                </th>
                <th className="p-4 text-center text-sm font-bold text-white/80">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-10 text-center text-white/60">
                    <div className="inline-flex items-center gap-2">
                      <Loader2 className="animate-spin" size={16} />
                      Loading vehicles...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-10 text-center text-white/60">
                    {searchQuery
                      ? "No vehicles found matching your search."
                      : "No vehicles available."}
                  </td>
                </tr>
              ) : (
                filtered.map((v) => (
                  <tr key={v.id} className="hover:bg-white/5 transition">
                    <td className="p-4 text-sm text-white font-semibold">
                      {v.regNumber}
                    </td>
                    <td className="p-4 text-center text-sm text-white/80">
                      {v.type}
                    </td>
                    <td className="p-4 text-center text-sm text-white/80">
                      {v.fuel || "—"}
                    </td>
                    <td className="p-4 text-center text-sm text-white/80">
                      {v.capacity || "—"}
                    </td>
                    <td className="p-4 text-center text-sm text-white/80">
                      {v.machine || "—"}
                    </td>
                    <td className="p-4 text-center text-sm text-white/80">
                      {prettyEnum(v.condition)}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex px-3 py-1 rounded-xl text-xs font-bold ring-1 ${
                          v.status === "AVAILABLE"
                            ? "bg-emerald-500/20 text-emerald-200 ring-emerald-500/30"
                            : v.status === "ASSIGNED"
                            ? "bg-amber-500/20 text-amber-200 ring-amber-500/30"
                            : v.status === "IN_MAINTENANCE"
                            ? "bg-sky-500/20 text-sky-200 ring-sky-500/30"
                            : "bg-rose-500/20 text-rose-200 ring-rose-500/30"
                        }`}
                      >
                        {prettyEnum(v.status)}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEdit(v)}
                          className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white transition active:scale-[0.99]"
                          title="Edit"
                          type="button"
                        >
                          <Edit2 size={16} />
                          Edit
                        </button>

                        <button
                          onClick={() => deleteVehicle(v.id)}
                          className="inline-flex items-center gap-1 rounded-xl bg-red-600/20 px-3 py-2 text-sm font-semibold text-red-300 ring-1 ring-red-500/30 hover:bg-red-600/30 transition active:scale-[0.99]"
                          title="Delete"
                          type="button"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="bg-slate-950 w-full max-w-2xl rounded-3xl shadow-2xl shadow-black/40 ring-1 ring-white/10">
            <div className="flex justify-between items-center px-6 py-5 border-b border-white/10">
              <h2 className="text-2xl font-extrabold text-white">
                {editing ? "Edit Vehicle" : "Add Vehicle"}
              </h2>
              <button
                onClick={closeModal}
                type="button"
                className="text-white/60 hover:text-white transition p-1"
                disabled={saving}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="px-6 py-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-white/90 mb-2">
                    Vehicle Number (Reg No)
                  </label>
                  <input
                    value={form.regNumber}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, regNumber: e.target.value }))
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-cyan-500/40 focus:ring-4 focus:ring-cyan-500/10 transition"
                    placeholder="LK-CAA-2146"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white/90 mb-2">
                    Vehicle Type
                  </label>
                  <input
                    value={form.type}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, type: e.target.value }))
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-cyan-500/40 focus:ring-4 focus:ring-cyan-500/10 transition"
                    placeholder="Tipper Truck / JCB / ..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-white/90 mb-2">
                    Fuel
                  </label>
                  <input
                    value={form.fuel}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, fuel: e.target.value }))
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-cyan-500/40 focus:ring-4 focus:ring-cyan-500/10 transition"
                    placeholder="Diesel"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white/90 mb-2">
                    Capacity
                  </label>
                  <input
                    value={form.capacity}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, capacity: e.target.value }))
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-cyan-500/40 focus:ring-4 focus:ring-cyan-500/10 transition"
                    placeholder="10 Tons"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white/90 mb-2">
                    Machine
                  </label>
                  <input
                    value={form.machine}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, machine: e.target.value }))
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-cyan-500/40 focus:ring-4 focus:ring-cyan-500/10 transition"
                    placeholder="TATA 2618"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-white/90 mb-2">
                    Condition
                  </label>
                  <select
                    value={form.condition}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, condition: e.target.value }))
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-500/40 focus:ring-4 focus:ring-cyan-500/10 transition"
                  >
                    {CONDITION_OPTIONS.map((x) => (
                      <option key={x} value={x} className="bg-slate-900">
                        {prettyEnum(x)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white/90 mb-2">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, status: e.target.value }))
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-500/40 focus:ring-4 focus:ring-cyan-500/10 transition"
                  >
                    {STATUS_OPTIONS.map((x) => (
                      <option key={x} value={x} className="bg-slate-900">
                        {prettyEnum(x)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <label className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 w-full cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!form.active}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, active: e.target.checked }))
                      }
                      className="accent-cyan-400"
                    />
                    <span className="text-sm font-semibold text-white/80">
                      Active
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/10">
              <button
                onClick={closeModal}
                type="button"
                className="px-6 py-2.5 rounded-2xl border border-white/10 bg-white/5 text-white/80 font-semibold hover:bg-white/10 hover:text-white transition"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={saveVehicle}
                type="button"
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-blue-600/20 hover:opacity-95 transition disabled:opacity-60"
                disabled={saving}
              >
                {saving ? "Saving..." : editing ? "Update Vehicle" : "Add Vehicle"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

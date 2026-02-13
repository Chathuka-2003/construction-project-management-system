import { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  CalendarClock,
  Filter,
  RefreshCw,
  Search,
  Plus,
  X,
  User2,
  ClipboardList,
  CheckCircle2,
  XCircle,
  BadgeCheck,
} from "lucide-react";
import { getCustomerIdFromStorage } from "../../util/auth";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({ baseURL: BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const STATUS = ["REQUESTED", "APPROVED", "REJECTED", "COMPLETED"];

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function fmtDateTime(iso) {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    return d.toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function statusBadge(s) {
  switch (String(s || "").toUpperCase()) {
    case "APPROVED":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "REJECTED":
      return "bg-red-50 text-red-700 ring-red-200";
    case "COMPLETED":
      return "bg-indigo-50 text-indigo-700 ring-indigo-200";
    case "REQUESTED":
    default:
      return "bg-amber-50 text-amber-700 ring-amber-200";
  }
}

function statusIcon(s) {
  switch (String(s || "").toUpperCase()) {
    case "APPROVED":
      return <CheckCircle2 className="h-4 w-4" />;
    case "REJECTED":
      return <XCircle className="h-4 w-4" />;
    case "COMPLETED":
      return <BadgeCheck className="h-4 w-4" />;
    default:
      return <ClipboardList className="h-4 w-4" />;
  }
}

function toBackendLocalDateTime(datetimeLocalValue) {
  if (!datetimeLocalValue) return null;
  return datetimeLocalValue.length === 16 ? `${datetimeLocalValue}:00` : datetimeLocalValue;
}

function initialForm(customerId) {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 30);
  const pad = (n) => String(n).padStart(2, "0");
  const v = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(
    now.getHours()
  )}:${pad(now.getMinutes())}`;

  return {
    customerId: customerId || "",
    handledById: "",
    appointmentDate: v,
    purpose: "",
  };
}

export default function Appointments() {
  const customerId = useMemo(() => getCustomerIdFromStorage(), []);

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sort, setSort] = useState("NEWEST");

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(() => initialForm(customerId));

  // ✅ Admin dropdown data
  const [admins, setAdmins] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);

  useEffect(() => {
    setForm((f) => ({ ...f, customerId: customerId || "" }));
  }, [customerId]);

  const load = useCallback(async () => {
    if (!customerId) {
      setErr("Customer ID not found. Please login again.");
      return;
    }
    setLoading(true);
    setErr("");
    try {
      const res = await api.get(`/api/appointments/customer/${customerId}`);
      const arr = Array.isArray(res.data) ? res.data : [];
      setItems(arr);
    } catch (e) {
      setErr(e?.response?.data?.message || e?.response?.data || e?.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  // ✅ Load admins from /api/users and filter ADMIN (logic only for dropdown UI)
  const loadAdmins = useCallback(async () => {
    setLoadingAdmins(true);
    try {
      const res = await api.get("/api/users");
      const arr = Array.isArray(res.data) ? res.data : [];
      setAdmins(arr.filter((u) => String(u.role) === "ADMIN"));
    } catch {
      toast.error("Failed to load admins");
    } finally {
      setLoadingAdmins(false);
    }
  }, []);

  useEffect(() => {
    load();
    loadAdmins();
  }, [load, loadAdmins]);

  const filtered = useMemo(() => {
    let arr = [...items];

    if (statusFilter !== "ALL") {
      arr = arr.filter((a) => String(a.status) === String(statusFilter));
    }

    const needle = query.trim().toLowerCase();
    if (needle) {
      arr = arr.filter((a) => {
        const purpose = String(a.purpose || "").toLowerCase();
        const handler = String(a.handledByName || "").toLowerCase();
        const st = String(a.status || "").toLowerCase();
        return purpose.includes(needle) || handler.includes(needle) || st.includes(needle);
      });
    }

    const asTime = (a) => {
      const t = new Date(a?.createdAt || a?.appointmentDate || 0).getTime();
      return Number.isFinite(t) ? t : 0;
    };
    const apptTime = (a) => {
      const t = new Date(a?.appointmentDate || 0).getTime();
      return Number.isFinite(t) ? t : 0;
    };

    if (sort === "NEWEST") arr.sort((a, b) => asTime(b) - asTime(a));
    if (sort === "OLDEST") arr.sort((a, b) => asTime(a) - asTime(b));
    if (sort === "UPCOMING") arr.sort((a, b) => apptTime(a) - apptTime(b));

    return arr;
  }, [items, query, statusFilter, sort]);

  const stats = useMemo(() => {
    const total = items.length;
    const requested = items.filter((x) => x.status === "REQUESTED").length;
    const approved = items.filter((x) => x.status === "APPROVED").length;
    const rejected = items.filter((x) => x.status === "REJECTED").length;
    const completed = items.filter((x) => x.status === "COMPLETED").length;
    return { total, requested, approved, rejected, completed };
  }, [items]);

  const resetForm = useCallback(() => {
    setForm(initialForm(customerId));
  }, [customerId]);

  const submit = async () => {
    if (!customerId) return toast.error("Customer id missing");
    if (!form.handledById) return toast.error("Please select an Admin");
    if (!form.appointmentDate) return toast.error("Please select appointment date & time");
    if (!form.purpose.trim()) return toast.error("Purpose is required");

    const payload = {
      customerId: Number(customerId),
      handledById: Number(form.handledById),
      appointmentDate: toBackendLocalDateTime(form.appointmentDate),
      purpose: form.purpose.trim(),
    };

    try {
      setSaving(true);
      const res = await api.post("/api/appointments", payload);
      toast.success("Appointment requested ✅");
      setOpen(false);
      resetForm();

      const created = res.data;
      setItems((prev) => [created, ...prev]);
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.response?.data || e?.message || "Request failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full min-h-0">
      {/* Top header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            Customer Portal
          </div>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-sm text-gray-500 mt-1">
            Request appointments and track approval status in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={load}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600"
          >
            <Plus className="h-4 w-4" />
            Request Appointment
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard label="Total" value={stats.total} variant="neutral" />
        <StatCard label="Requested" value={stats.requested} variant="amber" />
        <StatCard label="Approved" value={stats.approved} variant="emerald" />
        <StatCard label="Rejected" value={stats.rejected} variant="red" />
        <StatCard label="Completed" value={stats.completed} variant="indigo" />
      </div>

      {/* Controls */}
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 mb-6">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-100">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              className="w-full bg-transparent text-sm outline-none"
              placeholder="Search by purpose, admin name, status..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                className="bg-transparent text-sm outline-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All status</option>
                {STATUS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <select
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="NEWEST">Sort: Newest</option>
              <option value="OLDEST">Sort: Oldest</option>
              <option value="UPCOMING">Sort: Upcoming</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error / Loading */}
      {err && (
        <div className="mb-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-100">
          {String(err)}
        </div>
      )}
      {loading && (
        <div className="mb-4 rounded-2xl bg-white p-4 text-sm text-gray-600 ring-1 ring-gray-200">
          Loading appointments...
        </div>
      )}

      {/* List */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-orange-50 text-orange-600">
              <CalendarClock className="h-6 w-6" />
            </div>
            <div className="mt-3 font-semibold text-gray-900">No appointments found</div>
            <div className="mt-1 text-sm text-gray-500">
              Create a request to get started.
            </div>
          </div>
        ) : (
          <div className="divide-y">
            {filtered.map((a) => (
              <div key={a.id} className="p-5 hover:bg-gray-50 transition">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="grid h-9 w-9 place-items-center rounded-xl bg-gray-100 text-gray-700">
                        {statusIcon(a.status)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 truncate">
                          {a.purpose || "Appointment"}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {fmtDateTime(a.appointmentDate)}
                        </div>
                      </div>

                      <span
                        className={cx(
                          "ml-auto md:ml-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1",
                          statusBadge(a.status)
                        )}
                      >
                        {a.status}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2 text-sm text-gray-600">
                      <div>
                        <span className="text-gray-500">Requested at:</span>{" "}
                        <span className="font-medium text-gray-800">{fmtDateTime(a.createdAt)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Handled by:</span>{" "}
                        <span className="font-medium text-gray-800">
                          {a.handledByName ? `${a.handledByName} (ID: ${a.handledById})` : `ID: ${a.handledById}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 md:text-right">
                    {a.status === "REQUESTED" && "Waiting for approval"}
                    {a.status === "APPROVED" && "Approved ✅"}
                    {a.status === "REJECTED" && "Rejected ❌"}
                    {a.status === "COMPLETED" && "Completed 🎉"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Request Appointment</h2>
                <p className="text-sm text-gray-500">Status will be REQUESTED until admin approves.</p>
              </div>
              <button
                type="button"
                className="rounded-xl border border-gray-200 p-2 hover:bg-gray-50"
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Admin */}
              <div>
                <label className="text-sm font-semibold text-gray-800">Select Admin</label>

                <div className="mt-2 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-100">
                  <User2 className="h-4 w-4 text-gray-400" />
                  <select
                    className="w-full bg-transparent text-sm outline-none"
                    value={form.handledById}
                    onChange={(e) => setForm((p) => ({ ...p, handledById: e.target.value }))}
                  >
                    <option value="">{loadingAdmins ? "Loading admins..." : "Select Admin"}</option>
                    {admins.map((ad) => (
                      <option key={ad.id} value={ad.id}>
                        {ad.name} (ID: {ad.id})
                      </option>
                    ))}
                  </select>
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  Admin will review and approve/reject your request.
                </p>
              </div>

              {/* Date */}
              <div>
                <label className="text-sm font-semibold text-gray-800">Appointment Date & Time</label>
                <input
                  type="datetime-local"
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                  value={form.appointmentDate}
                  onChange={(e) => setForm((p) => ({ ...p, appointmentDate: e.target.value }))}
                />
              </div>

              {/* Purpose */}
              <div>
                <label className="text-sm font-semibold text-gray-800">Purpose</label>
                <textarea
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                  placeholder="Explain what you need (e.g., discuss timeline, payment plan, materials...)"
                  value={form.purpose}
                  onChange={(e) => setForm((p) => ({ ...p, purpose: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t px-5 py-4 bg-gray-50">
              <button
                type="button"
                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={submit}
                className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
              >
                {saving ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- UI: Better Stat Cards ---------- */
function StatCard({ label, value, variant = "neutral" }) {
  const styles = {
    neutral: "from-slate-900 to-slate-700 text-white",
    amber: "from-amber-500 to-orange-500 text-white",
    emerald: "from-emerald-500 to-teal-500 text-white",
    red: "from-rose-500 to-red-500 text-white",
    indigo: "from-indigo-500 to-violet-500 text-white",
  };

  return (
    <div className={cx("rounded-2xl p-4 shadow-sm bg-gradient-to-br", styles[variant])}>
      <div className="text-sm opacity-90">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}

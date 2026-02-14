// src/pages/staff/StaffAppointments.jsx
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import UploadModal from "../../components/modals/UploadModal.jsx";
import ConfirmDialog from "../../components/modals/ConfirmDialog.jsx";

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

// ✅ safer formatting
function formatDateTime(dateTime) {
  const dt = new Date(dateTime);
  if (Number.isNaN(dt.getTime())) return String(dateTime || "");
  return dt.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusChip(status) {
  const s = String(status || "").toUpperCase();
  if (s === "APPROVED") return "bg-emerald-500/15 text-emerald-200 ring-emerald-500/25";
  if (s === "REJECTED") return "bg-red-500/15 text-red-200 ring-red-500/25";
  if (s === "COMPLETED") return "bg-indigo-500/15 text-indigo-200 ring-indigo-500/25";
  return "bg-amber-500/15 text-amber-200 ring-amber-500/25";
}

export default function StaffAppointments() {
  // data
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // ui controls
  const [q, setQ] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [sort, setSort] = useState("UPCOMING"); // UPCOMING | NEWEST | OLDEST

  // confirm delete
  const [confirm, setConfirm] = useState(null);

  // status modal
  const [openStatus, setOpenStatus] = useState(false);
  const [activeRow, setActiveRow] = useState(null); // appointment object
  const [nextStatus, setNextStatus] = useState("REQUESTED");
  const [saving, setSaving] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      // ✅ show ALL appointments in DB
      const res = await api.get("/api/appointments");
      const arr = Array.isArray(res.data) ? res.data : [];
      setAppointments(arr);
    } catch (e) {
      setErr(
        e?.response?.data?.message ||
          e?.response?.data ||
          e?.message ||
          "Failed to load appointments"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const filtered = useMemo(() => {
    let arr = [...appointments];

    // filter status
    if (filterStatus !== "ALL") {
      arr = arr.filter((a) => String(a.status) === String(filterStatus));
    }

    // search
    const needle = q.trim().toLowerCase();
    if (needle) {
      arr = arr.filter((a) => {
        const purpose = String(a.purpose || "").toLowerCase();
        const customer = String(a.customerName || "").toLowerCase();
        const handled = String(a.handledByName || "").toLowerCase();
        const st = String(a.status || "").toLowerCase();
        return (
          purpose.includes(needle) ||
          customer.includes(needle) ||
          handled.includes(needle) ||
          st.includes(needle)
        );
      });
    }

    // sort
    const apptTime = (x) => new Date(x?.appointmentDate || 0).getTime() || 0;
    const createdTime = (x) => new Date(x?.createdAt || 0).getTime() || 0;

    if (sort === "UPCOMING") arr.sort((a, b) => apptTime(a) - apptTime(b));
    if (sort === "NEWEST") arr.sort((a, b) => createdTime(b) - createdTime(a));
    if (sort === "OLDEST") arr.sort((a, b) => createdTime(a) - createdTime(b));

    return arr;
  }, [appointments, filterStatus, q, sort]);
  

  const stats = useMemo(() => {
    const total = appointments.length;
    const requested = appointments.filter((x) => x.status === "REQUESTED").length;
    const approved = appointments.filter((x) => x.status === "APPROVED").length;
    const rejected = appointments.filter((x) => x.status === "REJECTED").length;
    const completed = appointments.filter((x) => x.status === "COMPLETED").length;
    return { total, requested, approved, rejected, completed };
  }, [appointments]);

  const openStatusModal = (row) => {
    setActiveRow(row);
    setNextStatus(row?.status || "REQUESTED");
    setOpenStatus(true);
  };

  const closeStatusModal = () => {
    setOpenStatus(false);
    setActiveRow(null);
    setNextStatus("REQUESTED");
  };

  const updateStatus = async () => {
    if (!activeRow?.id) return;
    try {
      setSaving(true);

      // ✅ backend: PATCH /api/appointments/{id}
      const res = await api.patch(`/api/appointments/${activeRow.id}`, {
        status: nextStatus,
      });

      // update UI
      const updated = res.data;
      setAppointments((prev) =>
        prev.map((x) => (String(x.id) === String(updated.id) ? updated : x))
      );

      toast.success(`Status updated: ${nextStatus}`);
      closeStatusModal();
    } catch (e) {
      toast.error(
        e?.response?.data?.message ||
          e?.response?.data ||
          e?.message ||
          "Failed to update status"
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteOne = async (id) => {
    try {
      // ✅ backend: DELETE /api/appointments/{id}
      await api.delete(`/api/appointments/${id}`);
      setAppointments((prev) => prev.filter((x) => String(x.id) !== String(id)));
      toast.success("Appointment deleted");
    } catch (e) {
      toast.error(
        e?.response?.data?.message ||
          e?.response?.data ||
          e?.message ||
          "Failed to delete"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 h-[380px] w-[680px] rounded-full bg-cyan-500/15 blur-3xl" />
      </div>

      {/* MAIN */}
      <div className="relative w-full p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="rounded-3xl bg-white/5 p-6 md:p-8 ring-1 ring-white/10 backdrop-blur-xl shadow-lg shadow-black/20">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold">Appointments</h2>
              <p className="mt-2 text-sm text-white/65">
                View all customer appointment requests and update status
              </p>
            </div>

            <button
              onClick={loadAll}
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-extrabold shadow-lg shadow-blue-600/20 hover:opacity-95"
            >
              Refresh
            </button>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <Stat label="Total" value={stats.total} />
            <Stat label="Requested" value={stats.requested} tone="amber" />
            <Stat label="Approved" value={stats.approved} tone="emerald" />
            <Stat label="Rejected" value={stats.rejected} tone="red" />
            <Stat label="Completed" value={stats.completed} tone="indigo" />
          </div>
        </div>

        {/* Controls */}
        <div className="rounded-3xl bg-white/5 p-4 md:p-5 ring-1 ring-white/10 backdrop-blur-xl shadow-lg shadow-black/20">
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
            <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-3 py-2.5 focus-within:border-white/30">
              <span className="text-white/60">🔎</span>
              <input
                className="w-full bg-transparent text-sm text-white placeholder-white/40 outline-none"
                placeholder="Search purpose, customer, handledBy, status..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                className="rounded-2xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white outline-none"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="ALL">All status</option>
                {STATUS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <select
                className="rounded-2xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white outline-none"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="UPCOMING">Sort: Upcoming</option>
                <option value="NEWEST">Sort: Newest</option>
                <option value="OLDEST">Sort: Oldest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading / Error */}
        {err && (
          <div className="rounded-2xl bg-red-500/10 p-4 ring-1 ring-red-500/20 text-sm text-red-200">
            {String(err)}
          </div>
        )}

        {loading && (
          <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 text-sm text-white/70">
            Loading appointments...
          </div>
        )}

        {/* List */}
        <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-xl shadow-lg shadow-black/20">
          {filtered.length === 0 ? (
            <p className="text-sm text-white/60">No appointments found.</p>
          ) : (
            <div className="space-y-3">
              {filtered.map((a) => (
                <div
                  key={a.id}
                  className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-semibold text-white">
                          {a.purpose || "Appointment"}
                        </h4>

                        <span
                          className={cx(
                            "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1",
                            statusChip(a.status)
                          )}
                        >
                          {a.status}
                        </span>
                      </div>

                      <div className="mt-2 space-y-1 text-sm text-white/60">
                        <div>📅 Appointment: {formatDateTime(a.appointmentDate)}</div>
                        <div>🕒 Requested: {formatDateTime(a.createdAt)}</div>
                        <div>👤 Customer: {a.customerName || `ID: ${a.customerId}`}</div>
                        <div>🏢 Handled by: {a.handledByName || `ID: ${a.handledById}`}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Status */}
                      <button
                        onClick={() => openStatusModal(a)}
                        type="button"
                        className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white/80 transition hover:bg-white/20 hover:text-white"
                      >
                        Change Status
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => setConfirm(a.id)}
                        type="button"
                        className="rounded-lg bg-red-600/30 px-3 py-1.5 text-sm font-semibold text-red-300 ring-1 ring-red-500/30 transition hover:bg-red-600/50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Modal */}
        {openStatus && (
          <UploadModal title="Update Appointment Status" onClose={closeStatusModal}>
            <div className="grid gap-3">
              <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-3">
                <div className="text-sm text-white/80 font-semibold">
                  {activeRow?.purpose || "Appointment"}
                </div>
                <div className="mt-1 text-xs text-white/60">
                  Customer: {activeRow?.customerName || `ID: ${activeRow?.customerId}`}
                </div>
                <div className="mt-1 text-xs text-white/60">
                  Appointment: {formatDateTime(activeRow?.appointmentDate)}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-white/80">
                  Status
                </label>
                <select
                  className="w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/40 focus:bg-white/10"
                  value={nextStatus}
                  onChange={(e) => setNextStatus(e.target.value)}
                >
                  {STATUS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-white/50">
                  Changing status updates customer side (they will see it when they refresh).
                </p>
              </div>

              <div className="mt-2 flex justify-end gap-2">
                <button
                  onClick={closeStatusModal}
                  type="button"
                  className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 shadow-sm transition hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={updateStatus}
                  disabled={saving}
                  type="button"
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </UploadModal>
        )}

        {/* Confirm Delete */}
        {confirm && (
          <ConfirmDialog
            message="Are you sure you want to delete this appointment?"
            onNo={() => setConfirm(null)}
            onYes={async () => {
              try {
                await deleteOne(confirm);
              } finally {
                setConfirm(null);
              }
            }}
          />
        )}
      </div>
    </div>
  );
}

/* --- Stat card (keeps your theme) --- */
function Stat({ label, value, tone = "slate" }) {
  const tones = {
    slate: "bg-white/10 text-white/80 ring-white/10",
    amber: "bg-amber-500/15 text-amber-200 ring-amber-500/25",
    emerald: "bg-emerald-500/15 text-emerald-200 ring-emerald-500/25",
    red: "bg-red-500/15 text-red-200 ring-red-500/25",
    indigo: "bg-indigo-500/15 text-indigo-200 ring-indigo-500/25",
  };

  return (
    <div className={cx("rounded-2xl p-4 ring-1", tones[tone] || tones.slate)}>
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-1 text-2xl font-extrabold">{value}</div>
    </div>
  );
}

import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import {
  Plus,
  Search,
  RefreshCcw,
  Wallet,
  CheckCircle2,
  Clock3,
  XCircle,
  Receipt,
  Building2,
  CalendarDays,
  AlertTriangle,
  Loader2,
  Pencil,
  Trash2,
  Save,
  X,
} from "lucide-react";


/* ===========================
   Helpers
=========================== */
function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}


function formatLKR(n) {
  const num = Number(n || 0);
  if (Number.isNaN(num)) return "LKR 0";
  return `LKR ${num.toLocaleString("en-LK")}`;
}

function toISODate(value) {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function safeMsg(e, fallback = "Something went wrong") {
  return (
    e?.response?.data?.message ||
    e?.response?.data?.error ||
    (typeof e?.response?.data === "string" ? e.response.data : "") ||
    e?.message ||
    fallback
  );
}

/* ===========================
   UI Components
=========================== */
function StatusPill({ status }) {
  const s = String(status || "").toUpperCase();
  const map = {
    PAID: "bg-emerald-500/15 text-emerald-200 ring-emerald-500/30",
    PENDING: "bg-amber-500/15 text-amber-200 ring-amber-500/30",
    FAILED: "bg-rose-500/15 text-rose-200 ring-rose-500/30",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1",
        map[s] || "bg-white/10 text-white/80 ring-white/15"
      )}
    >
      {s || "UNKNOWN"}
    </span>
  );
}

function Skeleton({ className }) {
  return <div className={cx("animate-pulse rounded-xl bg-white/10", className)} />;
}

function Summary({ title, value, icon: Icon, tone }) {
  return (
    <div
      className={cx(
        "rounded-3xl bg-gradient-to-b p-6 ring-1 ring-white/10 shadow-lg shadow-black/20 backdrop-blur",
        tone
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-bold text-white/70">{title}</div>
          <div className="mt-2 text-2xl font-extrabold">{value}</div>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15">
          <Icon size={18} className="text-white/80" />
        </div>
      </div>
    </div>
  );
}

function InsightCard({ title, value, hint }) {
  return (
    <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
      <div className="text-xs font-bold text-white/60">{title}</div>
      <div className="mt-2 text-xl font-extrabold">{value}</div>
      <div className="mt-1 text-xs text-white/45">{hint}</div>
    </div>
  );
}

function Field({ label, children, hint }) {
  return (
    <div>
      <label className="text-sm font-bold text-white/75">{label}</label>
      <div className="mt-2">{children}</div>
      {hint ? <div className="mt-1 text-xs text-white/45">{hint}</div> : null}
    </div>
  );
}

function RowSkeleton() {
  return (
    <tr>
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/10" />
          <div className="space-y-2">
            <div className="h-3 w-44 rounded bg-white/10" />
            <div className="h-3 w-24 rounded bg-white/10" />
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="h-3 w-24 rounded bg-white/10" />
      </td>
      <td className="px-4 py-4">
        <div className="h-3 w-28 rounded bg-white/10" />
      </td>
      <td className="px-4 py-4">
        <div className="h-3 w-28 rounded bg-white/10" />
      </td>
      <td className="px-4 py-4">
        <div className="h-7 w-20 rounded-full bg-white/10" />
      </td>
      <td className="px-4 py-4">
        <div className="h-8 w-28 rounded-xl bg-white/10" />
      </td>
    </tr>
  );
}

/* ===========================
   AXIOS
=========================== */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ===========================
   Main
=========================== */
export default function PaymentsDashboard() {
  // Global state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState("");
  const [actionMsg, setActionMsg] = useState(""); // small info message

  // Data
  const [projects, setProjects] = useState([]);
  const [payments, setPayments] = useState([]);

  // Users cache for client names
  const [clientNameMap, setClientNameMap] = useState({}); // { userId: "Name" }
  const userFetchInFlight = useRef(new Set()); // avoid duplicate calls

  // Filters
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Create drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [createErr, setCreateErr] = useState("");
  const [createForm, setCreateForm] = useState({
    projectId: "",
    amount: "",
    invoiceNo: "",
    dueDate: "",
  });

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editErr, setEditErr] = useState("");
  const [editing, setEditing] = useState(null); // normalized row
  const [editForm, setEditForm] = useState({
    amount: "",
    invoiceNo: "",
    dueDate: "",
  });

  // Row-level action states
  const [rowBusy, setRowBusy] = useState({}); // { paymentId: true }
  const [rowErr, setRowErr] = useState({}); // { paymentId: "error" }

  const welcomeName = "Finance Manager";

  // ----- Project title + customerId extraction -----
  function pickProjectTitle(p) {
    return (
      p?.title ??
      p?.name ??
      p?.projectTitle ??
      p?.projectName ??
      p?.project?.title ??
      p?.project?.name ??
      ""
    );
  }

  function pickCustomerId(p) {
    return (
      p?.customer?.id ??
      p?.customerId ??
      p?.customer_id ??
      p?.customerID ??
      null
    );
  }

  // ----- Fetch user name by id (cache) -----
  async function ensureUserName(userId) {
    if (!userId) return;
    const key = String(userId);

    if (clientNameMap[key]) return;
    if (userFetchInFlight.current.has(key)) return;

    userFetchInFlight.current.add(key);
    try {
      const res = await api.get(`/api/users/${key}`);
      const u = res?.data?.data ?? res?.data ?? null;
      const name = u?.name ?? u?.fullName ?? u?.username ?? u?.email ?? "";
      if (name) {
        setClientNameMap((m) => ({ ...m, [key]: name }));
      } else {
        setClientNameMap((m) => ({ ...m, [key]: "Unknown" }));
      }
    } catch (e) {
      // dont break page
      setClientNameMap((m) => ({ ...m, [key]: "Unknown" }));
    } finally {
      userFetchInFlight.current.delete(key);
    }
  }

  // ----- Fetch Projects -----
  async function fetchProjects() {
    const res = await api.get("/api/projects");
    const data = res?.data?.data ?? res?.data ?? [];

    const list = Array.isArray(data)
      ? data
          .map((p) => ({
            id: p?.id,
            title: pickProjectTitle(p) || (p?.id != null ? `Project #${p.id}` : ""),
            customerId: pickCustomerId(p),
          }))
          .filter((p) => p.id != null)
      : [];

    setProjects(list);

    // auto select first project
    if (list.length && !selectedProjectId) {
      setSelectedProjectId(String(list[0].id));
    }

    // prefetch client names for visible projects
    for (const p of list) {
      if (p.customerId) ensureUserName(p.customerId);
    }
  }

  // ----- Fetch Payments by Project -----
  async function fetchPaymentsByProject(projectId) {
    if (!projectId) {
      setPayments([]);
      return;
    }
    const res = await api.get(`/api/payments/project/${projectId}`);
    const data = res?.data?.data ?? res?.data ?? [];
    setPayments(Array.isArray(data) ? data : []);
  }

  // ----- Initial load -----
  async function loadPage() {
    setLoading(true);
    setPageError("");
    setActionMsg("");
    try {
      await fetchProjects();
      // payments loaded by effect when selectedProjectId is set
    } catch (e) {
      setPageError(safeMsg(e, "Failed to load projects. Check token/role/backend."));
      setProjects([]);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedProjectId) return;
    setPageError("");
    fetchPaymentsByProject(selectedProjectId).catch((e) => {
      setPageError(safeMsg(e, "Failed to load invoices for the selected project."));
      setPayments([]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProjectId]);

  // ----- Normalized rows -----
  const normalized = useMemo(() => {
    const projectMap = new Map(projects.map((p) => [String(p.id), p]));
    return payments.map((x) => {
      const pid = x.projectId ?? x.project_id ?? x.project?.id;
      const proj = projectMap.get(String(pid)) || null;
      const customerId = proj?.customerId ?? null;
      const clientName = customerId ? clientNameMap[String(customerId)] : "";

      return {
        id: x.id,
        projectId: pid,
        projectName: proj?.title || `Project #${pid}`,
        customerId,
        clientName: clientName || (customerId ? "Loading..." : "—"),
        invoiceNo: x.invoiceNo,
        amount: Number(x.amount ?? 0),
        status: String(x.status ?? "PENDING").toUpperCase(),
        dueDate: x.dueDate || "",
        paidDate: x.paidDate || "",
        createdAt: x.createdAt || "",
        date: x.paidDate || x.dueDate || x.createdAt || new Date().toISOString(),
      };
    });
  }, [payments, projects, clientNameMap]);

  // Ensure user names for any rows that say Loading...
  useEffect(() => {
    for (const r of normalized) {
      if (r.customerId) ensureUserName(r.customerId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalized.map((r) => r.customerId).join(",")]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let arr = [...normalized];

    if (statusFilter !== "ALL") arr = arr.filter((p) => p.status === statusFilter);

    if (needle) {
      arr = arr.filter((p) => {
        const a = (p.projectName || "").toLowerCase();
        const b = (p.invoiceNo || "").toLowerCase();
        const c = (p.clientName || "").toLowerCase();
        return a.includes(needle) || b.includes(needle) || c.includes(needle);
      });
    }

    arr.sort((a, b) => new Date(b.date) - new Date(a.date));
    return arr;
  }, [normalized, q, statusFilter]);

  const totals = useMemo(() => {
    const total = normalized.reduce((s, r) => s + (Number(r.amount) || 0), 0);
    const paid = normalized.filter((r) => r.status === "PAID").reduce((s, r) => s + (Number(r.amount) || 0), 0);
    const pending = normalized.filter((r) => r.status === "PENDING").reduce((s, r) => s + (Number(r.amount) || 0), 0);
    const failed = normalized.filter((r) => r.status === "FAILED").reduce((s, r) => s + (Number(r.amount) || 0), 0);
    return { total, paid, pending, failed };
  }, [normalized]);

  /* ===========================
     CREATE INVOICE
  =========================== */
  async function onCreate(e) {
    e.preventDefault();
    setCreateErr("");
    setActionMsg("");

    const pid = createForm.projectId || selectedProjectId;
    const amt = Number(createForm.amount);

    if (!pid) return setCreateErr("Please select a project.");
    if (!createForm.amount || Number.isNaN(amt) || amt <= 0) return setCreateErr("Enter a valid amount.");
    if (createForm.dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(createForm.dueDate)) return setCreateErr("Invalid due date.");

    setSaving(true);
    try {
      const payload = {
        projectId: Number(pid),
        amount: amt,
        invoiceNo: createForm.invoiceNo?.trim() || null,
        dueDate: createForm.dueDate?.trim() || null,
      };

      await api.post("/api/payments", payload);

      await fetchPaymentsByProject(pid);
      setActionMsg("Invoice created successfully ✅");

      setDrawerOpen(false);
      setCreateForm({ projectId: "", amount: "", invoiceNo: "", dueDate: "" });
    } catch (e2) {
      setCreateErr(safeMsg(e2, "Create invoice failed. Check backend/DTO/role."));
    } finally {
      setSaving(false);
    }
  }

  /* ===========================
     EDIT INVOICE
     (Expected backend endpoints)
       PUT    /api/payments/{id}
       body: { amount, invoiceNo, dueDate }
  =========================== */
  function openEdit(row) {
    setEditErr("");
    setEditing(row);
    setEditForm({
      amount: String(row.amount ?? ""),
      invoiceNo: row.invoiceNo ?? "",
      dueDate: row.dueDate ?? "",
    });
    setEditOpen(true);
  }

  async function onEditSave(e) {
    e.preventDefault();
    if (!editing?.id) return;

    setEditErr("");
    setActionMsg("");

    const amt = Number(editForm.amount);
    if (!editForm.amount || Number.isNaN(amt) || amt <= 0) return setEditErr("Enter a valid amount.");
    if (editForm.dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(editForm.dueDate)) return setEditErr("Invalid due date.");

    const id = editing.id;
    setRowErr((m) => ({ ...m, [id]: "" }));
    setRowBusy((m) => ({ ...m, [id]: true }));

    try {
      const payload = {
        amount: amt,
        invoiceNo: editForm.invoiceNo?.trim() || null,
        dueDate: editForm.dueDate?.trim() || null,
      };

      await api.put(`/api/payments/${id}`, payload);

      await fetchPaymentsByProject(selectedProjectId);
      setActionMsg("Invoice updated ✅");
      setEditOpen(false);
      setEditing(null);
    } catch (e2) {
      const msg = safeMsg(e2, "Update failed. Check PUT /api/payments/{id} exists.");
      setEditErr(msg);
      setRowErr((m) => ({ ...m, [id]: msg }));
    } finally {
      setRowBusy((m) => ({ ...m, [id]: false }));
    }
  }

  /* ===========================
     DELETE INVOICE
     (Expected backend endpoint)
       DELETE /api/payments/{id}
  =========================== */
  async function onDelete(row) {
    if (!row?.id) return;

    const ok = window.confirm(
      `Delete invoice ${row.invoiceNo || "#" + String(row.id).slice(-6)} ?`
    );
    if (!ok) return;

    const id = row.id;
    setActionMsg("");
    setRowErr((m) => ({ ...m, [id]: "" }));
    setRowBusy((m) => ({ ...m, [id]: true }));

    try {
      await api.delete(`/api/payments/${id}`);
      await fetchPaymentsByProject(selectedProjectId);
      setActionMsg("Invoice deleted ✅");
    } catch (e) {
      const msg = safeMsg(e, "Delete failed. Check DELETE /api/payments/{id} exists.");
      setRowErr((m) => ({ ...m, [id]: msg }));
    } finally {
      setRowBusy((m) => ({ ...m, [id]: false }));
    }
  }

  /* ===========================
     STATUS CHANGE (manual)
     (Expected backend endpoint)
       PATCH /api/payments/{id}/status
       body: { status: "PAID" | "PENDING" | "FAILED" }
  =========================== */
  async function onChangeStatus(row, nextStatus) {
    if (!row?.id) return;
    const id = row.id;

    setActionMsg("");
    setRowErr((m) => ({ ...m, [id]: "" }));
    setRowBusy((m) => ({ ...m, [id]: true }));

    // optimistic UI
    const oldPayments = payments;
    try {
      setPayments((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: nextStatus } : p))
      );

      await api.patch(`/api/payments/${id}/status`, { status: nextStatus });

      // refresh to ensure server truth
      await fetchPaymentsByProject(selectedProjectId);
      setActionMsg(`Status updated to ${nextStatus} ✅`);
    } catch (e) {
      setPayments(oldPayments);
      const msg = safeMsg(e, "Status update failed. Check PATCH /api/payments/{id}/status exists.");
      setRowErr((m) => ({ ...m, [id]: msg }));
    } finally {
      setRowBusy((m) => ({ ...m, [id]: false }));
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 h-[380px] w-[680px] rounded-full bg-cyan-500/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-bold text-white/80 ring-1 ring-white/10">
              <Receipt size={16} />
              Finance Module
            </div>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight">
              Payments <span className="text-white/60">&amp;</span> Finance
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-white/70">
              Company users: select a project and manage invoices.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-2xl bg-white/5 px-4 py-3 text-sm ring-1 ring-white/10 md:block">
              Welcome, <span className="font-bold">{welcomeName}</span>
            </div>

            <button
              onClick={() => setDrawerOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-bold shadow-lg shadow-blue-600/20 hover:opacity-95"
              type="button"
            >
              <Plus size={18} />
              Add Invoice
            </button>
          </div>
        </div>

        {/* Page error */}
        {pageError && (
          <div className="mt-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5" size={16} />
              <div>
                <div className="font-bold">Backend connection error</div>
                <div className="text-rose-100/80">{pageError}</div>
                <div className="mt-2 text-xs text-rose-100/70">
                  Check: backend running + JWT token + role permissions.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action message */}
        {actionMsg && (
          <div className="mt-4 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            {actionMsg}
          </div>
        )}

        {/* Summary cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {loading ? (
            <>
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
            </>
          ) : (
            <>
              <Summary title="Total" value={formatLKR(totals.total)} icon={Wallet} tone="from-white/10 to-white/5" />
              <Summary title="Paid" value={formatLKR(totals.paid)} icon={CheckCircle2} tone="from-emerald-500/15 to-white/5" />
              <Summary title="Pending" value={formatLKR(totals.pending)} icon={Clock3} tone="from-amber-500/15 to-white/5" />
              <Summary title="Failed" value={formatLKR(totals.failed)} icon={XCircle} tone="from-rose-500/15 to-white/5" />
            </>
          )}
        </div>

        {/* Content */}
        <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-12">
          {/* Records */}
          <section className="xl:col-span-8">
            <div className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur-xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold">Payment Records</h2>
                  <p className="mt-1 text-sm text-white/60">Company invoices for selected project.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fetchPaymentsByProject(selectedProjectId)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-2 text-sm font-semibold ring-1 ring-white/10 hover:bg-white/10"
                    type="button"
                    disabled={!selectedProjectId}
                  >
                    <RefreshCcw size={16} />
                    Refresh
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="md:col-span-1">
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full rounded-2xl bg-slate-950/40 px-4 py-3 text-sm text-white ring-1 ring-white/10 outline-none focus:ring-blue-500/40"
                  >
                    {projects.length === 0 ? (
                      <option value="">No projects</option>
                    ) : (
                      projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title || `Project #${p.id}`}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center gap-2 rounded-2xl bg-slate-950/40 px-4 py-3 ring-1 ring-white/10 focus-within:ring-blue-500/40">
                    <Search size={18} className="text-white/50" />
                    <input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="Search by project / invoice / client..."
                      className="w-full bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Status filter */}
              <div className="mt-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-2xl bg-slate-950/40 px-4 py-3 text-sm text-white ring-1 ring-white/10 outline-none focus:ring-blue-500/40 md:w-[220px]"
                >
                  <option value="ALL">All Status</option>
                  <option value="PAID">PAID</option>
                  <option value="PENDING">PENDING</option>
                  <option value="FAILED">FAILED</option>
                </select>
              </div>

              {/* Table */}
              <div className="mt-5 overflow-hidden rounded-2xl ring-1 ring-white/10">
                <div className="max-h-[520px] overflow-auto">
                  <table className="w-full min-w-[980px]">
                    <thead className="sticky top-0 z-10 bg-slate-900/60 backdrop-blur">
                      <tr className="text-left text-xs font-bold uppercase tracking-wider text-white/70">
                        <th className="px-4 py-4">Project</th>
                        <th className="px-4 py-4">Client</th>
                        <th className="px-4 py-4">Amount</th>
                        <th className="px-4 py-4">Due/Paid</th>
                        <th className="px-4 py-4">Status</th>
                        <th className="px-4 py-4">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-white/10">
                      {loading ? (
                        <>
                          <RowSkeleton />
                          <RowSkeleton />
                          <RowSkeleton />
                        </>
                      ) : filtered.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-14 text-center text-sm text-white/60">
                            No invoices found for this project / filters.
                          </td>
                        </tr>
                      ) : (
                        filtered.map((p) => {
                          const busy = !!rowBusy[p.id];
                          const err = rowErr[p.id];

                          return (
                            <React.Fragment key={p.id}>
                              <tr className={cx("group transition", busy ? "opacity-70" : "hover:bg-white/5")}>
                                <td className="px-4 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10">
                                      <Building2 size={18} className="text-white/80" />
                                    </div>
                                    <div className="min-w-0">
                                      <div className="truncate font-semibold text-white">{p.projectName}</div>
                                      <div className="text-xs text-white/55">
                                        Invoice: {p.invoiceNo || `#${String(p.id).slice(-6)}`}
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                <td className="px-4 py-4 text-sm text-white/75">
                                  {p.clientName || "—"}
                                </td>

                                <td className="px-4 py-4 font-extrabold text-white">
                                  {formatLKR(p.amount)}
                                </td>

                                <td className="px-4 py-4 text-sm text-white/75">
                                  <div className="inline-flex items-center gap-2">
                                    <CalendarDays size={16} className="text-white/50" />
                                    {p.paidDate
                                      ? `Paid: ${p.paidDate}`
                                      : p.dueDate
                                      ? `Due: ${p.dueDate}`
                                      : toISODate(p.date)}
                                  </div>
                                </td>

                                <td className="px-4 py-4">
                                  <div className="flex items-center gap-3">
                                    <StatusPill status={p.status} />
                                    {/* Manual status change */}
                                    <select
                                      disabled={busy}
                                      value={p.status}
                                      onChange={(e) => onChangeStatus(p, e.target.value)}
                                      className="rounded-xl bg-slate-950/40 px-3 py-2 text-xs text-white ring-1 ring-white/10 outline-none focus:ring-blue-500/40"
                                      title="Change status"
                                    >
                                      <option value="PAID">PAID</option>
                                      <option value="PENDING">PENDING</option>
                                      <option value="FAILED">FAILED</option>
                                    </select>
                                  </div>
                                </td>

                                <td className="px-4 py-4">
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => openEdit(p)}
                                      disabled={busy}
                                      className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs font-bold ring-1 ring-white/10 hover:bg-white/10"
                                      title="Edit"
                                    >
                                      <Pencil size={14} />
                                      Edit
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => onDelete(p)}
                                      disabled={busy}
                                      className="inline-flex items-center gap-2 rounded-xl bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-100 ring-1 ring-rose-500/20 hover:bg-rose-500/15"
                                      title="Delete"
                                    >
                                      <Trash2 size={14} />
                                      Delete
                                    </button>

                                    {busy && <Loader2 className="animate-spin" size={16} />}
                                  </div>
                                </td>
                              </tr>

                              {err ? (
                                <tr>
                                  <td colSpan={6} className="px-4 pb-4">
                                    <div className="rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">
                                      {err}
                                    </div>
                                  </td>
                                </tr>
                              ) : null}
                            </React.Fragment>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-4 text-xs text-white/45">
                JWT token should be in <span className="font-mono">localStorage.token</span>.
              </div>
            </div>
          </section>

          {/* Insights */}
          <aside className="xl:col-span-4">
            <div className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur-xl">
              <h3 className="text-lg font-extrabold">Quick Insights</h3>
              <p className="mt-1 text-sm text-white/60">Summary for finance decisions.</p>

              <div className="mt-5 space-y-3">
                <InsightCard
                  title="Paid Ratio"
                  value={normalized.length ? `${Math.round((totals.paid / (totals.total || 1)) * 100)}%` : "0%"}
                  hint="Payments completed"
                />
                <InsightCard title="Pending Amount" value={formatLKR(totals.pending)} hint="Still to be collected" />
                <InsightCard
                  title="Failed Transactions"
                  value={`${normalized.filter((x) => x.status === "FAILED").length}`}
                  hint="Needs review"
                />

                <button
                  onClick={() => setDrawerOpen(true)}
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold ring-1 ring-white/15 hover:bg-white/15"
                  type="button"
                >
                  <Plus size={18} />
                  Create New Invoice
                </button>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-10 text-center text-sm text-white/50">
          © 2026 Construction Project Management System
        </div>
      </div>

      {/* ===========================
          CREATE DRAWER
      =========================== */}
      <div className={cx("fixed inset-0 z-50 transition", drawerOpen ? "pointer-events-auto" : "pointer-events-none")}>
        <div
          onClick={() => !saving && setDrawerOpen(false)}
          className={cx("absolute inset-0 bg-black/60 transition-opacity", drawerOpen ? "opacity-100" : "opacity-0")}
        />

        <div
          className={cx(
            "absolute right-0 top-0 h-full w-full max-w-[520px] transform bg-slate-950/90 backdrop-blur-xl ring-1 ring-white/10 transition-transform",
            drawerOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex h-full flex-col">
            <div className="border-b border-white/10 px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white/60">NEW INVOICE</div>
                  <h3 className="mt-1 text-2xl font-extrabold">Add Payment Invoice</h3>
                </div>

                <button
                  onClick={() => !saving && setDrawerOpen(false)}
                  className="rounded-xl bg-white/5 px-3 py-2 text-sm font-bold ring-1 ring-white/10 hover:bg-white/10"
                  type="button"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto px-6 py-6">
              {createErr && (
                <div className="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                  {createErr}
                </div>
              )}

              <form onSubmit={onCreate} className="space-y-4">
                <Field label="Project">
                  <select
                    value={createForm.projectId || selectedProjectId}
                    onChange={(e) => setCreateForm((p) => ({ ...p, projectId: e.target.value }))}
                    className="w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-white ring-1 ring-white/10 outline-none focus:ring-blue-500/40"
                  >
                    <option value="">Select Project</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title || `Project #${p.id}`}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Amount (LKR)">
                  <input
                    value={createForm.amount}
                    onChange={(e) => setCreateForm((p) => ({ ...p, amount: e.target.value }))}
                    placeholder="e.g., 250000"
                    inputMode="numeric"
                    className="w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 ring-1 ring-white/10 outline-none focus:ring-blue-500/40"
                  />
                </Field>

                <Field label="Invoice No (optional)">
                  <input
                    value={createForm.invoiceNo}
                    onChange={(e) => setCreateForm((p) => ({ ...p, invoiceNo: e.target.value }))}
                    placeholder="e.g., INV-2026-000123"
                    className="w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 ring-1 ring-white/10 outline-none focus:ring-blue-500/40"
                  />
                </Field>

                <Field label="Due Date (optional)" hint="YYYY-MM-DD">
                  <input
                    type="date"
                    value={createForm.dueDate}
                    onChange={(e) => setCreateForm((p) => ({ ...p, dueDate: e.target.value }))}
                    className="w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-white ring-1 ring-white/10 outline-none focus:ring-blue-500/40"
                  />
                </Field>

                <button
                  disabled={saving}
                  type="submit"
                  className={cx(
                    "mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-extrabold shadow-lg shadow-blue-600/20 hover:opacity-95 disabled:opacity-60"
                  )}
                >
                  {saving ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                  {saving ? "Saving..." : "Add Invoice"}
                </button>

                <div className="mt-4 rounded-2xl bg-white/5 p-4 text-xs text-white/60 ring-1 ring-white/10">
                  <div className="font-bold text-white/80">Backend Tip</div>
                  <div className="mt-1">
                    POST <span className="font-mono">/api/payments</span> payload:{" "}
                    <span className="font-mono">projectId, amount, invoiceNo?, dueDate?</span>
                  </div>
                </div>
              </form>
            </div>

            <div className="border-t border-white/10 px-6 py-4 text-xs text-white/50">
              Connected via Axios interceptor (JWT) — token auto-attached if present.
            </div>
          </div>
        </div>
      </div>

      {/* ===========================
          EDIT MODAL
      =========================== */}
      <div className={cx("fixed inset-0 z-50 transition", editOpen ? "pointer-events-auto" : "pointer-events-none")}>
        <div
          onClick={() => !saving && setEditOpen(false)}
          className={cx("absolute inset-0 bg-black/60 transition-opacity", editOpen ? "opacity-100" : "opacity-0")}
        />

        <div
          className={cx(
            "absolute left-1/2 top-1/2 w-[92vw] max-w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-slate-950/92 p-6 ring-1 ring-white/10 backdrop-blur-xl transition",
            editOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-white/60">EDIT INVOICE</div>
              <div className="mt-1 text-xl font-extrabold">
                {editing?.invoiceNo || `#${String(editing?.id || "").slice(-6)}`}
              </div>
              <div className="mt-1 text-sm text-white/60">
                {editing?.projectName} • Client: {editing?.clientName || "—"}
              </div>
            </div>

            <button
              onClick={() => setEditOpen(false)}
              className="rounded-xl bg-white/5 px-3 py-2 text-sm font-bold ring-1 ring-white/10 hover:bg-white/10"
              type="button"
            >
              <X size={16} />
            </button>
          </div>

          {editErr && (
            <div className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {editErr}
            </div>
          )}

          <form onSubmit={onEditSave} className="mt-5 space-y-4">
            <Field label="Amount (LKR)">
              <input
                value={editForm.amount}
                onChange={(e) => setEditForm((p) => ({ ...p, amount: e.target.value }))}
                inputMode="numeric"
                className="w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-white ring-1 ring-white/10 outline-none focus:ring-blue-500/40"
              />
            </Field>

            <Field label="Invoice No (optional)">
              <input
                value={editForm.invoiceNo}
                onChange={(e) => setEditForm((p) => ({ ...p, invoiceNo: e.target.value }))}
                className="w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-white ring-1 ring-white/10 outline-none focus:ring-blue-500/40"
              />
            </Field>

            <Field label="Due Date (optional)">
              <input
                type="date"
                value={editForm.dueDate}
                onChange={(e) => setEditForm((p) => ({ ...p, dueDate: e.target.value }))}
                className="w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-white ring-1 ring-white/10 outline-none focus:ring-blue-500/40"
              />
            </Field>

            <button
              disabled={!!saving}
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-extrabold shadow-lg shadow-blue-600/20 hover:opacity-95 disabled:opacity-60"
            >
              <Save size={18} />
              Save Changes
            </button>

            <div className="rounded-2xl bg-white/5 p-4 text-xs text-white/60 ring-1 ring-white/10">
              <div className="font-bold text-white/80">Expected endpoints</div>
              <div className="mt-1">
                PUT <span className="font-mono">/api/payments/{`{id}`}</span> body:{" "}
                <span className="font-mono">amount, invoiceNo?, dueDate?</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

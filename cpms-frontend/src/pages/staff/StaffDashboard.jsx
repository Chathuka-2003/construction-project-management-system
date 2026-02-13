// src/pages/staff/StaffDashboard.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FolderKanban,
  ClipboardList,
  Calendar,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

/**
 * ✅ Connected Staff/Admin Dashboard (dark theme)
 * - Routes to /admin/* or /staff/* safely (role-based)
 * - Fetches counts from backend
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({ baseURL: BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function normalizePortalRole(roleRaw) {
  const r = String(roleRaw || "").replace("ROLE_", "").trim().toUpperCase();

  if (r === "SUPERADMIN" || r === "ADMIN" || r === "MANAGER") return "admin";
  if (r === "ENGINEER" || r === "OTHER_STAFF" || r === "WORKER" || r === "STAFF") return "staff";
  return null;
}

function toArray(res) {
  const d = res?.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.data)) return d.data;
  return [];
}

function normStatus(s) {
  return String(s || "").trim().toUpperCase();
}

function getJwtPayload() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = token.split(".")[1];
    if (!payload) return null;
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

function getUserIdFromJwt() {
  const p = getJwtPayload();
  return p?.userId ?? p?.id ?? p?.uid ?? null;
}

function isPendingTask(t) {
  const st = normStatus(t?.status);
  if (!st) return true; // no status -> count as pending (safe)
  const pending = new Set(["PENDING", "TODO", "NEW", "OPEN", "REQUESTED"]);
  return pending.has(st);
}

function isToday(dateLike) {
  if (!dateLike) return false;
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return false;

  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export default function StaffDashboard() {
  const navigate = useNavigate();

  const portalRole = useMemo(() => normalizePortalRole(localStorage.getItem("role")), []);
  const base = portalRole === "admin" ? "/admin" : "/staff";
  const token = localStorage.getItem("token");

  const safeGo = (path) => {
    if (!token || !portalRole) return navigate("/login", { replace: true });
    navigate(path);
  };

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [counts, setCounts] = useState({
    assignedProjects: 0,
    todayTasks: 0,
    pendingTasks: 0,
    appointments: 0,
  });

  const fetchCounts = useCallback(async () => {
    setLoading(true);
    setErr("");

    const userId = getUserIdFromJwt();
    const role = String(localStorage.getItem("role") || "").replace("ROLE_", "").toUpperCase();

    try {
      // ===== Projects =====
      // If MANAGER: use /api/projects/manager/{managerId}
      // else: fallback /api/projects (since your controller doesn't have /staff/{id})
      const projectsPromise =
        role === "MANAGER" && userId
          ? api.get(`/api/projects/manager/${userId}`)
          : api.get(`/api/projects`);

      // ===== Tasks =====
      // Your controller: /api/tasks (no /staff/{id})
      const tasksPromise = api.get(`/api/tasks`);

      // ===== Appointments =====
      // Your controller has /api/appointments/staff/{staffId}
      const appointmentsPromise = userId
        ? api.get(`/api/appointments/staff/${userId}`)
        : api.get(`/api/appointments`);

      const [projectsRes, tasksRes, apptRes] = await Promise.allSettled([
        projectsPromise,
        tasksPromise,
        appointmentsPromise,
      ]);

      const projects = projectsRes.status === "fulfilled" ? toArray(projectsRes.value) : [];
      const tasks = tasksRes.status === "fulfilled" ? toArray(tasksRes.value) : [];
      const appts = apptRes.status === "fulfilled" ? toArray(apptRes.value) : [];

      const softErrors = [];
      if (projectsRes.status === "rejected") softErrors.push("Projects");
      if (tasksRes.status === "rejected") softErrors.push("Tasks");
      if (apptRes.status === "rejected") softErrors.push("Appointments");

      if (softErrors.length) {
        setErr(`Failed to load: ${softErrors.join(", ")} (check security/role/token).`);
      }

      // Tasks "Today" – try common fields (dueDate/startDate/date)
      const todayTasks = tasks.filter((t) =>
        isToday(t?.dueDate) || isToday(t?.startDate) || isToday(t?.date) || isToday(t?.createdAt)
      ).length;

      const pendingTasks = tasks.filter(isPendingTask).length;

      setCounts({
        assignedProjects: projects.length,
        todayTasks: todayTasks || 0,
        pendingTasks,
        appointments: appts.length,
      });
    } catch (e) {
      const status = e?.response?.status;
      setErr(
        status === 401
          ? "Unauthorized (401). Please login again."
          : status === 403
          ? "Forbidden (403). Your role/security rules blocked dashboard APIs."
          : "Failed to load dashboard data. Check backend + token + CORS."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!token || !portalRole) {
      navigate("/login", { replace: true });
      return;
    }
    fetchCounts();
  }, [fetchCounts, navigate, portalRole, token]);

  const stats = useMemo(
    () => [
      { title: "Assigned Projects", value: loading ? "…" : String(counts.assignedProjects), icon: FolderKanban, tone: "blue" },
      { title: "Today's Tasks", value: loading ? "…" : String(counts.todayTasks), icon: ClipboardList, tone: "emerald" },
      { title: "Pending Tasks", value: loading ? "…" : String(counts.pendingTasks), icon: AlertCircle, tone: "amber" },
      { title: "Appointments", value: loading ? "…" : String(counts.appointments), icon: Calendar, tone: "violet" },
    ],
    [counts, loading]
  );

  const actions = [
    { title: "View Projects", subtitle: "See assigned projects & progress", tone: "blue", go: `${base}/projects` },
    { title: "Update Tasks", subtitle: "Complete & update your tasks", tone: "emerald", go: `${base}/tasks` },
    { title: "Appointments", subtitle: "Check schedules & meetings", tone: "violet", go: `${base}/appointments` },
  ];

  const welcomeName = portalRole ? portalRole.toUpperCase() : "USER";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 h-[380px] w-[680px] rounded-full bg-cyan-500/15 blur-3xl" />
      </div>

      <div className="relative w-full p-6 md:p-8 space-y-10">
        {/* Hero */}
        <div className="rounded-3xl bg-white/5 p-6 md:p-8 ring-1 ring-white/10 backdrop-blur-xl shadow-lg shadow-black/20">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-bold text-white/80 ring-1 ring-white/10">
                <Sparkles size={16} />
                Staff Dashboard
              </div>

              <h1 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight">Staff Overview</h1>
              <p className="mt-2 text-sm text-white/65">Overview of your work, tasks, and schedules.</p>

              <div className="mt-4 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-4 py-2 text-xs font-bold text-emerald-200 ring-1 ring-emerald-500/25">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  System running normally
                </div>

                <button
                  onClick={fetchCounts}
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-bold text-white/80 ring-1 ring-white/10 hover:bg-white/10 hover:ring-white/20 transition"
                  title="Refresh"
                >
                  ↻ Refresh
                </button>
              </div>

              {!!err && (
                <div className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-100">
                  <div className="font-bold">Dashboard Warning</div>
                  <div className="mt-1 text-rose-100/80 break-words">{err}</div>
                </div>
              )}
            </div>

            {/* Quick Tip Card */}
            <div className="w-full md:w-[380px] rounded-3xl bg-slate-950/40 p-5 ring-1 ring-white/10 backdrop-blur shadow-md shadow-black/20">
              <p className="text-xs font-bold tracking-wider text-white/60 uppercase">Welcome</p>
              <p className="mt-2 font-extrabold text-white">Welcome, {welcomeName}</p>
              <p className="mt-1 text-sm text-white/60">
                Start by checking your assigned projects and tasks for today.
              </p>

              <button
                onClick={() => safeGo(`${base}/projects`)}
                className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-extrabold shadow-lg shadow-blue-600/20 hover:opacity-95"
                type="button"
              >
                View projects
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <StatCard key={s.title} icon={s.icon} title={s.title} value={s.value} tone={s.tone} />
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-extrabold">Quick Actions</h2>
          <p className="mt-1 text-sm text-white/60">Jump into the most used staff operations.</p>

          <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {actions.map((a) => (
              <ActionImageCard
                key={a.title}
                title={a.title}
                subtitle={a.subtitle}
                tone={a.tone}
                onClick={() => safeGo(a.go)}
              />
            ))}
          </div>
        </div>

        <div className="pt-2 text-center text-xs text-white/45">© 2026 Construction Project Management System</div>
      </div>
    </div>
  );
}

/* =======================
   STAT CARD
======================= */
function StatCard({ icon: Icon, title, value, tone }) {
  const toneMap = {
    blue: { chip: "bg-blue-500/15 text-blue-200 ring-blue-500/25", icon: "text-blue-200", iconBox: "bg-blue-500/10 ring-blue-500/20" },
    amber: { chip: "bg-amber-500/15 text-amber-200 ring-amber-500/25", icon: "text-amber-200", iconBox: "bg-amber-500/10 ring-amber-500/20" },
    emerald: { chip: "bg-emerald-500/15 text-emerald-200 ring-emerald-500/25", icon: "text-emerald-200", iconBox: "bg-emerald-500/10 ring-emerald-500/20" },
    violet: { chip: "bg-violet-500/15 text-violet-200 ring-violet-500/25", icon: "text-violet-200", iconBox: "bg-violet-500/10 ring-violet-500/20" },
  };
  const t = toneMap[tone] || toneMap.blue;

  return (
    <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-xl shadow-lg shadow-black/20">
      <div className="flex items-center justify-between">
        <div className={cx("rounded-2xl p-3 ring-1", t.iconBox)}>
          <Icon className={cx("h-6 w-6", t.icon)} />
        </div>
        <span className={cx("rounded-full px-3 py-1 text-xs font-bold ring-1", t.chip)}>Live</span>
      </div>

      <div className="mt-5">
        <p className="text-3xl font-extrabold">{value}</p>
        <p className="mt-1 text-sm text-white/60">{title}</p>
      </div>
    </div>
  );
}

/* =======================
   ACTION CARD
======================= */
function ActionImageCard({ title, subtitle, tone, onClick }) {
  const btnMap = {
    blue: "from-cyan-500 to-blue-600",
    violet: "from-fuchsia-500 to-violet-600",
    emerald: "from-emerald-500 to-teal-600",
    amber: "from-amber-500 to-orange-600",
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className="group overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10 shadow-lg shadow-black/20 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/10 text-left"
    >
      <div className="relative h-44 w-full">
        <img
          src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=70"
          alt={title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent" />

        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-2xl bg-white/15 px-3 py-2 text-white backdrop-blur ring-1 ring-white/10">
          <span className="text-sm font-bold">{title}</span>
        </div>
      </div>

      <div className="p-6">
        <p className="text-sm text-white/60">{subtitle}</p>

        <div className="mt-5 flex items-center justify-between">
          <span className="text-base font-extrabold">{title}</span>

          <span
            className={cx(
              "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-extrabold text-white shadow-lg hover:opacity-95",
              "bg-gradient-to-r",
              btnMap[tone] || btnMap.blue
            )}
          >
            Open
            <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </button>
  );
}

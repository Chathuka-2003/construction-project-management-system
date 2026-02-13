import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  FolderKanban,
  ClipboardList,
  Truck,
  Calendar,
  FileText,
  UserPlus,
  Users,
  ArrowRight,
  Car,
  Link2,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

// =================== API ===================
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({ baseURL: BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// try to support both array response and {data: array}
function toArray(res) {
  const d = res?.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.data)) return d.data;
  return [];
}

function normStatus(s) {
  return String(s || "").trim().toUpperCase();
}

function isActiveProject(p) {
  // If backend has status, try to decide "active". Otherwise treat all as active.
  const st = normStatus(p?.status);
  if (!st) return true;

  // common end states in your app: "Handover", "Completed", "Done", etc.
  const inactive = new Set([
    "COMPLETED",
    "COMPLETE",
    "DONE",
    "FINISHED",
    "CLOSED",
    "HANDOVER",
    "CANCELLED",
    "CANCELED",
    "REJECTED",
  ]);
  return !inactive.has(st);
}

function isPendingTask(t) {
  const st = normStatus(t?.status);
  if (!st) return true; // if no status field, count all as pending

  const pending = new Set(["PENDING", "TODO", "NEW", "OPEN", "REQUESTED"]);
  // if your backend uses "In Progress"/"Done" strings:
  if (pending.has(st)) return true;

  // handle "Pending" (case-insensitive already)
  return false;
}

export default function AdminOverview() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [counts, setCounts] = useState({
    activeProjects: 0,
    pendingTasks: 0,
    assignedVehicles: 0,
    appointments: 0,
  });

  const fetchDashboardCounts = useCallback(async () => {
    setLoading(true);
    setErr("");

    try {
      const [projectsRes, tasksRes, assignmentsRes, appointmentsRes] = await Promise.allSettled([
        api.get("/api/projects"),
        api.get("/api/tasks"),
        api.get("/api/vehicle-assignments"),
        api.get("/api/appointments"),
      ]);

      const projects = projectsRes.status === "fulfilled" ? toArray(projectsRes.value) : [];
      const tasks = tasksRes.status === "fulfilled" ? toArray(tasksRes.value) : [];
      const assignments = assignmentsRes.status === "fulfilled" ? toArray(assignmentsRes.value) : [];
      const appointments = appointmentsRes.status === "fulfilled" ? toArray(appointmentsRes.value) : [];

      // soft errors (if some fail, still show others)
      const softErrors = [];
      if (projectsRes.status === "rejected") softErrors.push("Projects");
      if (tasksRes.status === "rejected") softErrors.push("Tasks");
      if (assignmentsRes.status === "rejected") softErrors.push("Vehicle Assignments");
      if (appointmentsRes.status === "rejected") softErrors.push("Appointments");

      if (softErrors.length) {
        setErr(`Failed to load: ${softErrors.join(", ")} (check backend/security).`);
      }

      const activeProjects = projects.filter(isActiveProject).length;
      const pendingTasks = tasks.filter(isPendingTask).length;

      setCounts({
        activeProjects,
        pendingTasks,
        assignedVehicles: assignments.length,
        appointments: appointments.length,
      });
    } catch (e) {
      const status = e?.response?.status;
      setErr(
        status === 401
          ? "Unauthorized (401). Please login again."
          : status === 403
          ? "Forbidden (403). Your role/security rules blocked dashboard APIs."
          : "Failed to load dashboard data. Check backend + CORS + token."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardCounts();
  }, [fetchDashboardCounts]);

  const stats = useMemo(
    () => [
      {
        icon: FolderKanban,
        title: "Active Projects",
        value: loading ? "…" : String(counts.activeProjects),
        tone: "blue",
      },
      {
        icon: ClipboardList,
        title: "Pending Tasks",
        value: loading ? "…" : String(counts.pendingTasks),
        tone: "amber",
      },
      {
        icon: Truck,
        title: "Assigned Vehicles",
        value: loading ? "…" : String(counts.assignedVehicles),
        tone: "emerald",
      },
      {
        icon: Calendar,
        title: "Appointments",
        value: loading ? "…" : String(counts.appointments),
        tone: "violet",
      },
    ],
    [counts, loading]
  );

  const actions = [
    {
      title: "New Project",
      subtitle: "Create a project & set deadlines",
      icon: FileText,
      path: "/admin/newprojects",
      img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=70",
      tone: "blue",
    },
    {
      title: "Assign Task",
      subtitle: "Allocate tasks to the right staff",
      icon: ClipboardList,
      path: "/admin/newtask",
      img: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=70",
      tone: "violet",
    },
    {
      title: "Add Worker",
      subtitle: "Add workers & manage workforce",
      icon: UserPlus,
      path: "/admin/add-worker",
      img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=70",
      tone: "emerald",
    },
    {
      title: "Register User",
      subtitle: "Create admin/staff accounts",
      icon: Users,
      path: "/admin/register",
      img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=70",
      tone: "amber",
    },
    {
      title: "Manage Vehicles",
      subtitle: "Add, update & remove vehicles",
      icon: Car,
      path: "/admin/manage",
      img: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=70",
      tone: "cyan",
    },
    {
      title: "Project Assignments",
      subtitle: "View and manage assigned projects",
      icon: Link2,
      path: "/admin/projects",
      img: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=70",
      tone: "teal",
    },
  ];

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
                Admin Dashboard
              </div>

              <h1 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight">Admin Overview</h1>
              <p className="mt-2 text-sm text-white/65">
                Welcome back. Here’s a snapshot of today’s activity and quick actions.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-4 py-2 text-xs font-bold text-emerald-200 ring-1 ring-emerald-500/25">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  System running normally
                </div>

                <button
                  onClick={fetchDashboardCounts}
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
              <p className="text-xs font-bold tracking-wider text-white/60 uppercase">Quick Tip</p>
              <p className="mt-2 font-extrabold text-white">Keep projects on track</p>
              <p className="mt-1 text-sm text-white/60">
                Create tasks early and assign them quickly to reduce delays and improve delivery.
              </p>

              <button
                onClick={() => navigate("/admin/newtask")}
                className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-extrabold shadow-lg shadow-blue-600/20 hover:opacity-95"
              >
                Assign a task
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
          <p className="mt-1 text-sm text-white/60">Jump into the most used admin operations.</p>

          <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {actions.map((a) => (
              <ActionImageCard
                key={a.title}
                title={a.title}
                subtitle={a.subtitle}
                icon={a.icon}
                img={a.img}
                tone={a.tone}
                onClick={() => navigate(a.path)}
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
   STAT CARD (dark glass)
======================= */
function StatCard({ icon: Icon, title, value, tone }) {
  const toneMap = {
    blue: {
      chip: "bg-blue-500/15 text-blue-200 ring-blue-500/25",
      icon: "text-blue-200",
      iconBox: "bg-blue-500/10 ring-blue-500/20",
    },
    amber: {
      chip: "bg-amber-500/15 text-amber-200 ring-amber-500/25",
      icon: "text-amber-200",
      iconBox: "bg-amber-500/10 ring-amber-500/20",
    },
    emerald: {
      chip: "bg-emerald-500/15 text-emerald-200 ring-emerald-500/25",
      icon: "text-emerald-200",
      iconBox: "bg-emerald-500/10 ring-emerald-500/20",
    },
    violet: {
      chip: "bg-violet-500/15 text-violet-200 ring-violet-500/25",
      icon: "text-violet-200",
      iconBox: "bg-violet-500/10 ring-violet-500/20",
    },
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
   ACTION IMAGE CARD (dark)
======================= */
function ActionImageCard({ title, subtitle, icon: Icon, img, tone, onClick }) {
  const btnMap = {
    blue: "from-cyan-500 to-blue-600",
    violet: "from-fuchsia-500 to-violet-600",
    emerald: "from-emerald-500 to-teal-600",
    amber: "from-amber-500 to-orange-600",
    cyan: "from-cyan-500 to-sky-600",
    teal: "from-teal-500 to-cyan-600",
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className="group overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10 shadow-lg shadow-black/20 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/10 text-left"
    >
      <div className="relative h-44 w-full">
        <img
          src={img}
          alt={title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent" />

        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-2xl bg-white/15 px-3 py-2 text-white backdrop-blur ring-1 ring-white/10">
          <Icon className="h-5 w-5" />
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

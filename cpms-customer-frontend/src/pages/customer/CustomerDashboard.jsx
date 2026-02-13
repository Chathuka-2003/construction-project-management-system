// src/pages/customer/CustomerDashboard.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api"; // ✅ your shared axios instance (adds Bearer token)

/* ---------------- helpers ---------------- */
function safeJsonParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

function decodeJwtPayload(token) {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const pad = "=".repeat((4 - (payload.length % 4)) % 4);
    const base64 = (payload + pad).replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

function getCustomerIdSafe() {
  // ✅ best: stored user object
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? safeJsonParse(userRaw) : null;
  const userIdFromUser = user?.id ?? user?.userId ?? user?.customerId ?? null;
  if (userIdFromUser != null && !Number.isNaN(Number(userIdFromUser))) {
    return Number(userIdFromUser);
  }

  // ✅ direct keys
  const direct =
    localStorage.getItem("customerId") ||
    localStorage.getItem("userId") ||
    localStorage.getItem("id");
  if (direct && !Number.isNaN(Number(direct))) return Number(direct);

  // ✅ fallback token
  const token = localStorage.getItem("token");
  if (!token) return null;
  const json = decodeJwtPayload(token);
  if (!json) return null;

  const id =
    json.userId ??
    json.id ??
    json.customerId ??
    json.uid ??
    json.user_id ??
    null;

  if (id == null || Number.isNaN(Number(id))) return null;
  return Number(id);
}

function normalizeStatus(s) {
  return String(s || "").trim().toUpperCase();
}

function money(n) {
  const x = Number(n || 0);
  return `Rs. ${x.toLocaleString()}`;
}

function pickAppointmentDate(a) {
  return (
    a?.appointmentDate ||
    a?.appointment_date ||
    a?.date ||
    a?.timestamp ||
    a?.createdAt ||
    null
  );
}

function fmtDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString();
}

function errorMessage(e) {
  if (e?.code === "ERR_CANCELED") return "";

  if (!e?.response) {
    return "Network error: backend not reachable / CORS / server down.";
  }
  const status = e.response.status;
  const data = e.response.data;

  const backendMsg =
    (data && typeof data === "object" && (data.message || data.error)) ||
    (typeof data === "string" ? data : "");

  if (status === 401) return "Session expired. Please login again.";
  if (status === 403) return "Access denied (403). Your role cannot access this.";
  return `Request failed (${status}). ${String(backendMsg || "").trim()}`.trim();
}

function paymentBadge(status) {
  const s = normalizeStatus(status);
  if (s === "PAID" || s === "SUCCESS") return "text-green-700 bg-green-100";
  if (s === "OVERDUE") return "text-red-700 bg-red-100";
  if (s === "CANCELLED" || s === "CANCELED") return "text-gray-600 bg-gray-100";
  return "text-yellow-700 bg-yellow-100"; // PENDING default
}

function clampPct(n) {
  const x = Number(n || 0);
  return Math.max(0, Math.min(100, x));
}

/* ---------------- component ---------------- */
export default function CustomerDashboard() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // optional
  const customerId = useMemo(() => getCustomerIdSafe(), []);

  const [loading, setLoading] = useState(true);
  const [topError, setTopError] = useState("");

  const [projects, setProjects] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [payments, setPayments] = useState([]);

  // tasks keyed by projectId: { [projectId]: TaskResponseDTO[] }
  const [tasksByProject, setTasksByProject] = useState({});

  const mountedRef = useRef(true);

  const logoutAndGoLogin = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("customerId");
    localStorage.removeItem("userId");
    navigate("/login", { replace: true });
  };

  // ✅ calculate task progress for a project
  const projectTaskProgress = (projectId) => {
    const tasks = tasksByProject?.[projectId] || [];
    if (!tasks.length) return null; // no tasks => unknown
    // assume task has status: COMPLETED / DONE etc OR progress field
    const completed = tasks.filter((t) => {
      const st = normalizeStatus(t.status);
      return st === "COMPLETED" || st === "DONE" || st === "FINISHED";
    }).length;

    // if status not reliable but each task has progress, use average progress
    const hasProgressField = tasks.some((t) => t.progress != null);
    if (hasProgressField) {
      const avg =
        tasks.reduce((sum, t) => sum + clampPct(t.progress), 0) / tasks.length;
      return Math.round(avg);
    }

    return Math.round((completed / tasks.length) * 100);
  };

  const fetchDashboard = async (signal) => {
    setLoading(true);
    setTopError("");

    try {
      // 1) load main data
      const [pRes, aRes, payRes] = await Promise.all([
        api.get(`/api/projects/customer/${customerId}`, { signal }),
        api.get(`/api/appointments/customer/${customerId}`, { signal }),
        api.get(`/api/payments/my`, { signal }),
      ]);

      if (!mountedRef.current) return;

      const projList = Array.isArray(pRes.data) ? pRes.data : [];
      const apptList = Array.isArray(aRes.data) ? aRes.data : [];
      const payList = Array.isArray(payRes.data) ? payRes.data : [];

      setProjects(projList);
      setAppointments(apptList);
      setPayments(payList);

      // 2) load tasks per project (only if we have projects)
      //    endpoint: GET /api/tasks/project/{projectId}
      //    (No security annotations in your controller, but your global security may apply.)
      const taskPairs = await Promise.all(
        projList.map(async (p) => {
          try {
            const tRes = await api.get(`/api/tasks/project/${p.id}`, { signal });
            return [p.id, Array.isArray(tRes.data) ? tRes.data : []];
          } catch {
            // if tasks endpoint forbidden or not available, keep empty list (don't break dashboard)
            return [p.id, []];
          }
        })
      );

      if (!mountedRef.current) return;

      const map = {};
      for (const [pid, tlist] of taskPairs) map[pid] = tlist;
      setTasksByProject(map);
    } catch (e) {
      if (!mountedRef.current) return;

      if (e?.response?.status === 401) {
        setTopError("Session expired. Redirecting to login…");
        setProjects([]);
        setAppointments([]);
        setPayments([]);
        setTasksByProject({});
        logoutAndGoLogin();
        return;
      }

      const msg = errorMessage(e);
      if (msg) setTopError(msg);

      setProjects([]);
      setAppointments([]);
      setPayments([]);
      setTasksByProject({});
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;

    if (!token) {
      navigate("/login", { replace: true });
      return () => {
        mountedRef.current = false;
      };
    }

    if (role && normalizeStatus(role) !== "CUSTOMER") {
      setTopError("You are not allowed to access the customer dashboard.");
      setLoading(false);
      return () => {
        mountedRef.current = false;
      };
    }

    if (!customerId) {
      setTopError(
        "Customer ID not found. Please store the logged-in user in localStorage (key: 'user') with an 'id'."
      );
      setLoading(false);
      return () => {
        mountedRef.current = false;
      };
    }

    const controller = new AbortController();
    fetchDashboard(controller.signal);

    return () => {
      mountedRef.current = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, role, customerId, navigate]);

  // ✅ Only APPROVED + future appointments show as upcoming
  const approvedUpcomingAppointments = useMemo(() => {
    const now = new Date();
    return (appointments || [])
      .map((a) => ({ ...a, __date: pickAppointmentDate(a) }))
      .filter((a) => {
        if (normalizeStatus(a.status) !== "APPROVED") return false;
        const dt = new Date(a.__date);
        return !Number.isNaN(dt.getTime()) && dt >= now;
      })
      .sort((a, b) => new Date(a.__date) - new Date(b.__date));
  }, [appointments]);

  const pendingPayments = useMemo(() => {
    return (payments || []).filter((p) => normalizeStatus(p.status) === "PENDING");
  }, [payments]);

  const pendingAmount = useMemo(() => {
    return pendingPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  }, [pendingPayments]);

  // ✅ Overall progress = combine project.progress + tasks progress
  // If tasks exist -> use 70% tasks + 30% project.progress (tunable)
  const overallProgress = useMemo(() => {
    if (!projects?.length) return 0;

    const weights = { tasks: 0.7, project: 0.3 };

    const perProject = projects.map((p) => {
      const projPct = clampPct(p.progress);
      const taskPct = projectTaskProgress(p.id); // null if no tasks loaded
      if (taskPct == null) return projPct; // fallback
      return Math.round(taskPct * weights.tasks + projPct * weights.project);
    });

    const avg = perProject.reduce((a, b) => a + b, 0) / perProject.length;
    return Math.max(0, Math.min(100, Math.round(avg)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects, tasksByProject]);

  const activeProjectsCount = projects.length;

  const onRefresh = () => {
    const controller = new AbortController();
    fetchDashboard(controller.signal);
  };

  return (
    <div className="flex min-h-screen bg-[#f4f1ec]">
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-1 text-2xl font-semibold">Welcome back!</h1>
            <p className="mb-8 text-gray-500">
              Here’s what’s happening with your projects today.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onRefresh}
              className="h-10 px-4 rounded-lg bg-black text-white hover:opacity-90 disabled:opacity-60"
              type="button"
              disabled={loading}
            >
              Refresh
            </button>
            <button
              onClick={logoutAndGoLogin}
              className="h-10 px-4 rounded-lg border border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
              type="button"
            >
              Logout
            </button>
          </div>
        </div>

        {topError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <div className="font-semibold">Dashboard Error</div>
            <div className="mt-1 break-words">{topError}</div>
          </div>
        )}

        {/* Top Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <StatCard label="Active Projects" value={loading ? "…" : activeProjectsCount} />
          <StatCard
            label="Approved Upcoming Appointments"
            value={loading ? "…" : approvedUpcomingAppointments.length}
          />
          <StatCard label="Pending Payments" value={loading ? "…" : money(pendingAmount)} />
          <StatCard label="Overall Progress (Tasks + Projects)" value={loading ? "…" : `${overallProgress}%`} />
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-2 gap-6">
          {/* Project Summary (shows task progress too) */}
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">Project Summary</h3>
              <button
                onClick={() => navigate("/customer/projects")}
                className="text-sm text-orange-500 hover:underline"
                type="button"
              >
                View All
              </button>
            </div>

            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : projects.length === 0 ? (
              <p className="text-gray-500">No projects found</p>
            ) : (
              projects.slice(0, 2).map((p) => {
                const taskPct = projectTaskProgress(p.id); // null if no tasks
                const projPct = clampPct(p.progress);
                const combinedPct =
                  taskPct == null ? projPct : Math.round(taskPct * 0.7 + projPct * 0.3);

                return (
                  <div key={p.id} className="bg-[#faf7f2] p-5 rounded-lg border mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{p.name || "—"}</p>
                        <p className="text-sm text-gray-500">Manager: {p.managerName || "—"}</p>
                      </div>
                      <span className="px-3 py-1 text-xs text-orange-600 bg-orange-100 rounded-full">
                        {p.status || "—"}
                      </span>
                    </div>

                    <div className="mt-4 space-y-3">
                      {/* Combined progress */}
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Overall (Tasks + Project)</span>
                          <span>{combinedPct}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded">
                          <div
                            className="bg-black h-2 rounded"
                            style={{ width: `${combinedPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Project progress (raw) */}
                      <div>
                        <div className="flex justify-between mb-1 text-sm text-gray-600">
                          <span>Project Progress</span>
                          <span>{projPct}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded">
                          <div
                            className="bg-gray-900 h-2 rounded"
                            style={{ width: `${projPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Task progress */}
                      <div>
                        <div className="flex justify-between mb-1 text-sm text-gray-600">
                          <span>Task Progress</span>
                          <span>{taskPct == null ? "—" : `${taskPct}%`}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded">
                          <div
                            className="bg-orange-500 h-2 rounded"
                            style={{ width: `${taskPct == null ? 0 : taskPct}%` }}
                          />
                        </div>
                        {taskPct == null && (
                          <p className="mt-2 text-xs text-gray-500">
                            No tasks found (or tasks endpoint not accessible).
                          </p>
                        )}
                      </div>
                    </div>

                    <p className="mt-3 text-sm text-gray-500">
                      📍 {p.location || "—"} • 📅 Start: {p.startDate || "—"}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Appointments (ONLY APPROVED + future) */}
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">Upcoming Appointments (Approved)</h3>
              <button
                onClick={() => navigate("/customer/appointments")}
                className="text-sm text-orange-500 hover:underline"
                type="button"
              >
                View All
              </button>
            </div>

            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : approvedUpcomingAppointments.length === 0 ? (
              <p className="text-gray-500">No approved upcoming appointments</p>
            ) : (
              approvedUpcomingAppointments.slice(0, 3).map((a) => (
                <div
                  key={a.id}
                  className="bg-[#faf7f2] border rounded-xl p-5 flex justify-between items-start mb-4"
                >
                  <div>
                    <h4 className="text-base font-semibold">{a.purpose || "Appointment"}</h4>
                    <p className="mt-1 text-sm text-gray-500">📅 {fmtDateTime(a.__date)}</p>

                    <span className="inline-block px-3 py-1 mt-3 text-xs rounded bg-green-100 text-green-700">
                      {a.status || "APPROVED"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="p-6 mt-8 bg-white shadow-sm rounded-xl">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold">Payment Summary</h3>
            <button
              onClick={() => navigate("/customer/payments")}
              className="text-sm text-orange-500 hover:underline"
              type="button"
            >
              View All
            </button>
          </div>

          <table className="w-full text-sm">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="py-2 text-left">Invoice</th>
                <th className="py-2 text-left">Amount</th>
                <th className="py-2 text-left">Due Date</th>
                <th className="py-2 text-left">Status</th>
                <th className="py-2 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td className="py-4 text-gray-500" colSpan={5}>
                    Loading...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td className="py-4 text-gray-500" colSpan={5}>
                    No payments found
                  </td>
                </tr>
              ) : (
                payments.slice(0, 5).map((p) => {
                  const status = normalizeStatus(p.status);
                  return (
                    <tr key={p.id} className="border-b">
                      <td className="py-3">{p.invoiceNo || `INV-${p.id}`}</td>
                      <td>{money(p.amount)}</td>
                      <td>{p.dueDate || "—"}</td>
                      <td>
                        <span className={`px-3 py-1 text-xs rounded-full ${paymentBadge(p.status)}`}>
                          {p.status || "—"}
                        </span>
                      </td>
                      <td>
                        {status === "PENDING" ? (
                          <button
                            onClick={() => navigate(`/customer/payments/${p.id}`)}
                            className="px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600"
                            type="button"
                          >
                            Pay Now
                          </button>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="p-5 bg-white shadow-sm rounded-xl">
      <p className="mb-1 text-sm text-gray-500">{label}</p>
      <h2 className="text-xl font-bold">{value}</h2>
    </div>
  );
}

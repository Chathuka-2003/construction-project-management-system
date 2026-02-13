// src/pages/admin/WorkerManagementDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Users,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Plane,
  Sparkles,
  RefreshCcw,
  Loader2,
  Pencil,
  Trash2,
  Save,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import userService from "../../services/userService";
import workerService from "../../services/workerService";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function normalizeRole(raw) {
  return String(raw || "")
    .replace("ROLE_", "")
    .trim()
    .toUpperCase();
}

/* ---------------- BADGES (Dark) ---------------- */

function Pill({ children, tone = "slate" }) {
  const tones = {
    slate: "bg-white/5 text-white/75 ring-white/10",
    blue: "bg-blue-500/15 text-blue-200 ring-blue-500/25",
    emerald: "bg-emerald-500/15 text-emerald-200 ring-emerald-500/25",
    amber: "bg-amber-500/15 text-amber-200 ring-amber-500/25",
    violet: "bg-violet-500/15 text-violet-200 ring-violet-500/25",
    red: "bg-red-500/15 text-red-200 ring-red-500/25",
    cyan: "bg-cyan-500/15 text-cyan-200 ring-cyan-500/25",
    pink: "bg-pink-500/15 text-pink-200 ring-pink-500/25",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
        tones[tone] || tones.slate
      )}
    >
      {children}
    </span>
  );
}

function RoleBadge({ role }) {
  const r = String(role || "").toLowerCase();
  const map = {
    superadmin: "violet",
    admin: "violet",
    manager: "blue",
    engineer: "emerald",
    other_staff: "cyan",
    worker: "amber",
    customer: "slate",
  };
  return <Pill tone={map[r] || "slate"}>{role}</Pill>;
}

function StatusBadge({ status }) {
  const s = String(status || "").toLowerCase().replaceAll("_", " ");
  const map = {
    active: { tone: "emerald", icon: CheckCircle2 },
    "on leave": { tone: "amber", icon: Plane },
    inactive: { tone: "red", icon: XCircle },
  };
  const conf = map[s] || { tone: "slate", icon: ShieldCheck };
  const Icon = conf.icon;

  return (
    <Pill tone={conf.tone}>
      <span className="inline-flex items-center gap-1.5">
        <Icon size={14} />
        {status}
      </span>
    </Pill>
  );
}

/* ---------------- CARDS / MODAL (Dark) ---------------- */

function StatCard({ title, value, icon: Icon, tone = "blue" }) {
  const toneMap = {
    blue: "bg-blue-500/10 ring-blue-500/20 text-blue-200",
    emerald: "bg-emerald-500/10 ring-emerald-500/20 text-emerald-200",
    amber: "bg-amber-500/10 ring-amber-500/20 text-amber-200",
    violet: "bg-violet-500/10 ring-violet-500/20 text-violet-200",
  };

  return (
    <div className="rounded-3xl bg-white/5 p-5 shadow-lg shadow-black/20 ring-1 ring-white/10 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-white/60">{title}</div>
        <div
          className={cx(
            "grid h-10 w-10 place-items-center rounded-2xl ring-1",
            toneMap[tone] || toneMap.blue
          )}
        >
          <Icon size={18} />
        </div>
      </div>
      <div className="mt-3 text-3xl font-extrabold tracking-tight text-white">
        {value}
      </div>
      <div className="mt-1 text-xs text-white/45">Live from backend</div>
    </div>
  );
}

function Modal({ open, title, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-slate-950/60 shadow-2xl shadow-black/40 ring-1 ring-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <h3 className="text-lg font-extrabold text-white">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-2xl bg-white/10 px-3 py-2 text-sm font-semibold text-white/80 hover:bg-white/15 ring-1 ring-white/10"
              type="button"
            >
              Close
            </button>
          </div>
          <div className="p-6 text-white/85">{children}</div>
        </div>
      </div>
    </div>
  );
}

function InputDark(props) {
  return (
    <input
      {...props}
      className={cx(
        "w-full rounded-2xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white outline-none",
        "placeholder:text-white/35 focus:border-cyan-500/40 focus:ring-4 focus:ring-cyan-500/10",
        props.className
      )}
    />
  );
}

function InputPlain(props) {
  return (
    <input
      {...props}
      className={cx(
        "w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none",
        "placeholder:text-white/35 focus:border-cyan-500/40 focus:ring-4 focus:ring-cyan-500/10",
        props.className
      )}
    />
  );
}

function SelectDark(props) {
  return (
    <select
      {...props}
      className={cx(
        "rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none",
        "focus:border-cyan-500/40 focus:ring-4 focus:ring-cyan-500/10",
        props.className
      )}
    />
  );
}

/* ---------------- PAGE ---------------- */

export default function WorkerManagementDashboard() {
  const navigate = useNavigate();

  const rawRole = normalizeRole(localStorage.getItem("role") || "OTHER_STAFF");
  const isAdmin = ["SUPERADMIN", "ADMIN", "MANAGER"].includes(rawRole);

  const [activeTab, setActiveTab] = useState("users");

  // filters
  const [searchUser, setSearchUser] = useState("");
  const [selectedUserGroup, setSelectedUserGroup] = useState("COMPANY"); // COMPANY / CUSTOMER

  const [searchWorker, setSearchWorker] = useState("");

  // data
  const [users, setUsers] = useState([]);
  const [workers, setWorkers] = useState([]);

  // load state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // modals
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showWorkerModal, setShowWorkerModal] = useState(false);

  // edit states
  const [editUser, setEditUser] = useState(null);
  const [savingUser, setSavingUser] = useState(false);

  const [editWorker, setEditWorker] = useState(null);
  const [savingWorker, setSavingWorker] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [userList, workerList] = await Promise.all([
        userService.getAll(),
        workerService.getAll(),
      ]);

      setUsers(Array.isArray(userList) ? userList : []);
      setWorkers(Array.isArray(workerList) ? workerList : []);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        (err?.response?.status === 403
          ? "403 Forbidden (check JWT / security config)"
          : "Failed to load data");
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const companyRoles = useMemo(
    () => new Set(["SUPERADMIN", "ADMIN", "MANAGER", "ENGINEER", "OTHER_STAFF", "WORKER"]),
    []
  );

  const filteredUsers = useMemo(() => {
    const needle = searchUser.trim().toLowerCase();

    return users
      .filter((u) => {
        const role = String(u.role || "").toUpperCase();
        const isCustomer = role === "CUSTOMER";
        const isCompany = companyRoles.has(role);

        if (selectedUserGroup === "CUSTOMER" && !isCustomer) return false;
        if (selectedUserGroup === "COMPANY" && !isCompany) return false;

        const okName = String(u.name || "").toLowerCase().includes(needle);
        const okEmail = String(u.email || "").toLowerCase().includes(needle);
        return okName || okEmail;
      })
      .sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
  }, [users, searchUser, selectedUserGroup, companyRoles]);

  const filteredWorkers = useMemo(() => {
    const needle = searchWorker.trim().toLowerCase();
    return workers
      .filter((w) => {
        const okName = String(w.name || "").toLowerCase().includes(needle);
        const okSkill = String(w.skill || "").toLowerCase().includes(needle);
        return okName || okSkill;
      })
      .sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
  }, [workers, searchWorker]);

  // stats
  const stats = useMemo(() => {
    const totalWorkers = workers.length;
    const totalUsers = users.length;
    const customers = users.filter((u) => String(u.role || "").toUpperCase() === "CUSTOMER").length;
    const activeUsers = users.filter((u) => String(u.status || "").toUpperCase() === "ACTIVE").length;
    return { totalWorkers, totalUsers, customers, activeUsers };
  }, [users, workers]);

  // actions
  const confirmDelete = async (label, run) => {
    const ok = window.confirm(`Delete ${label}? This cannot be undone.`);
    if (!ok) return;
    try {
      await run();
      toast.success("Deleted successfully");
      await loadAll();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Delete failed");
    }
  };

  const saveUserEdits = async () => {
    if (!editUser?.id) return;
    setSavingUser(true);
    try {
      // IMPORTANT: your backend UserDTO requires status.
      // We send status always.
      const payload = {
        name: editUser.name,
        email: editUser.email,
        password: editUser.password || "", // if backend ignores empty -> ok. If not, remove this line.
        role: editUser.role,
        contactNumber: editUser.contactNumber,
        address: editUser.address,
        gender: editUser.gender,
        salary: Number(editUser.salary),
        status: editUser.status || "ACTIVE",
      };

      await userService.update(editUser.id, payload);
      toast.success("User updated");
      setShowUserModal(false);
      setSelectedUser(null);
      setEditUser(null);
      await loadAll();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Update failed");
    } finally {
      setSavingUser(false);
    }
  };

  const changeUserStatus = async (id, status) => {
    try {
      await userService.updateStatus(id, status);
      toast.success("Status updated");
      await loadAll();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Status update failed");
    }
  };

  const saveWorkerEdits = async () => {
    if (!editWorker?.id) return;
    setSavingWorker(true);
    try {
      await workerService.update(editWorker.id, {
        name: editWorker.name,
        skill: editWorker.skill,
      });
      toast.success("Worker updated");
      setShowWorkerModal(false);
      setSelectedWorker(null);
      setEditWorker(null);
      await loadAll();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Update failed");
    } finally {
      setSavingWorker(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 left-1/2 h-[480px] w-[980px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 h-[420px] w-[820px] rounded-full bg-cyan-500/15 blur-3xl" />
      </div>

      <div className="relative p-6 md:p-8">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-bold text-white/75 ring-1 ring-white/10">
              <Sparkles size={16} />
              User Management
            </div>
            <h1 className="mt-4 text-2xl md:text-3xl font-extrabold tracking-tight">
              Users & Workers
            </h1>
            <p className="mt-2 text-sm text-white/60">
              Users: <span className="font-semibold text-white/80">GET /api/users</span>{" "}
              • Workers: <span className="font-semibold text-white/80">GET /api/workers</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={loadAll}
              className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white/90 hover:bg-white/15 ring-1 ring-white/10"
              type="button"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <RefreshCcw size={16} />}
              Refresh
            </button>

            {isAdmin && (
              <>
                {/* ✅ Link to RegisterUser.jsx */}
                <button
                  onClick={() => navigate("/admin/register")}
                  className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white/90 hover:bg-white/15 ring-1 ring-white/10"
                  type="button"
                >
                  <Plus size={16} />
                  Add User
                </button>

                {/* ✅ Link to AddWorkerForm.jsx */}
                <button
                  onClick={() => navigate("/admin/add-worker")}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20 hover:opacity-95"
                  type="button"
                >
                  <Plus size={16} />
                  Add Worker
                </button>
              </>
            )}
          </div>
        </div>

        {/* Error */}
        {error ? (
          <div className="mb-6 rounded-3xl bg-red-500/10 p-4 ring-1 ring-red-500/20">
            <div className="text-sm font-bold text-red-200">Failed to load</div>
            <div className="mt-1 text-sm text-red-200/80">{error}</div>
          </div>
        ) : null}

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Users" value={stats.totalUsers} icon={Users} tone="blue" />
          <StatCard title="Active Users" value={stats.activeUsers} icon={CheckCircle2} tone="emerald" />
          <StatCard title="Customers" value={stats.customers} icon={Briefcase} tone="violet" />
          <StatCard title="Workers" value={stats.totalWorkers} icon={ShieldCheck} tone="amber" />
        </div>

        {/* Tabs + Filters */}
        <div className="rounded-3xl bg-white/5 p-5 shadow-lg shadow-black/20 ring-1 ring-white/10 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex rounded-2xl bg-white/5 p-1 ring-1 ring-white/10">
              <button
                onClick={() => setActiveTab("users")}
                className={cx(
                  "rounded-2xl px-4 py-2 text-sm font-bold transition",
                  activeTab === "users" ? "bg-white/10 text-white shadow-sm" : "text-white/60 hover:text-white"
                )}
                type="button"
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab("workers")}
                className={cx(
                  "rounded-2xl px-4 py-2 text-sm font-bold transition",
                  activeTab === "workers" ? "bg-white/10 text-white shadow-sm" : "text-white/60 hover:text-white"
                )}
                type="button"
              >
                Workers
              </button>
            </div>

            <div className="text-xs text-white/50">
              Portal: <span className="font-semibold text-white/85">{isAdmin ? "Admin/Manager" : "Staff"}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {activeTab === "users" ? (
              <>
                <div className="relative flex-1 min-w-[260px]">
                  <Search className="absolute left-3 top-3 text-white/35" size={18} />
                  <InputDark
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    placeholder="Search name or email..."
                  />
                </div>

                <SelectDark value={selectedUserGroup} onChange={(e) => setSelectedUserGroup(e.target.value)}>
                  <option value="COMPANY" className="bg-slate-950">Company Users</option>
                  <option value="CUSTOMER" className="bg-slate-950">Customers</option>
                </SelectDark>
              </>
            ) : (
              <>
                <div className="relative flex-1 min-w-[260px]">
                  <Search className="absolute left-3 top-3 text-white/35" size={18} />
                  <InputDark
                    value={searchWorker}
                    onChange={(e) => setSearchWorker(e.target.value)}
                    placeholder="Search worker name or skill..."
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-hidden rounded-3xl bg-white/5 shadow-lg shadow-black/20 ring-1 ring-white/10 backdrop-blur-xl">
          {loading ? (
            <div className="grid place-items-center px-6 py-14 text-sm text-white/60">
              <div className="inline-flex items-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                Loading...
              </div>
            </div>
          ) : activeTab === "users" ? (
            <>
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <h2 className="text-sm font-extrabold text-white">
                  {selectedUserGroup === "CUSTOMER" ? "Customers" : "Company Users"}
                </h2>
                <div className="text-xs text-white/50">{filteredUsers.length} results</div>
              </div>

              {filteredUsers.length === 0 ? (
                <div className="grid place-items-center px-6 py-14 text-sm text-white/60">No users found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/[0.03] text-left text-xs font-bold text-white/60">
                      <tr>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Role</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Contact</th>
                        <th className="px-6 py-3">Email</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-white/10">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-white/[0.04]">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-white">{u.name}</div>
                            <div className="mt-1 text-xs text-white/45">#{u.id}</div>
                          </td>
                          <td className="px-6 py-4"><RoleBadge role={u.role} /></td>
                          <td className="px-6 py-4"><StatusBadge status={u.status || "ACTIVE"} /></td>
                          <td className="px-6 py-4 text-sm text-white/70">{u.contactNumber || "-"}</td>
                          <td className="px-6 py-4 text-sm text-white/70">{u.email || "-"}</td>

                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => { setSelectedUser(u); setEditUser(null); setShowUserModal(true); }}
                                className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/15 ring-1 ring-white/10"
                                type="button"
                              >
                                <Eye size={14} /> View
                              </button>

                              {isAdmin && (
                                <>
                                  <button
                                    onClick={() => { setSelectedUser(u); setEditUser({ ...u, password: "" }); setShowUserModal(true); }}
                                    className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/15 ring-1 ring-white/10"
                                    type="button"
                                  >
                                    <Pencil size={14} /> Edit
                                  </button>

                                  <button
                                    onClick={() => confirmDelete(`user #${u.id}`, () => userService.remove(u.id))}
                                    className="inline-flex items-center gap-2 rounded-2xl bg-red-500/15 px-3 py-2 text-xs font-bold text-red-200 hover:bg-red-500/20 ring-1 ring-red-500/25"
                                    type="button"
                                  >
                                    <Trash2 size={14} /> Delete
                                  </button>
                                </>
                              )}
                            </div>

                            {/* ✅ status quick change */}
                            {isAdmin && (
                              <div className="mt-2 flex justify-end gap-2">
                                {["ACTIVE", "ON_LEAVE", "INACTIVE"].map((s) => (
                                  <button
                                    key={s}
                                    onClick={() => changeUserStatus(u.id, s)}
                                    className={cx(
                                      "rounded-xl px-3 py-1 text-[11px] font-extrabold ring-1",
                                      s === (u.status || "ACTIVE")
                                        ? "bg-cyan-500/20 text-cyan-200 ring-cyan-500/25"
                                        : "bg-white/5 text-white/60 ring-white/10 hover:bg-white/10"
                                    )}
                                    type="button"
                                  >
                                    {s}
                                  </button>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <h2 className="text-sm font-extrabold text-white">Workers</h2>
                <div className="text-xs text-white/50">{filteredWorkers.length} results</div>
              </div>

              {filteredWorkers.length === 0 ? (
                <div className="grid place-items-center px-6 py-14 text-sm text-white/60">No workers found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/[0.03] text-left text-xs font-bold text-white/60">
                      <tr>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Skill</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {filteredWorkers.map((w) => (
                        <tr key={w.id} className="hover:bg-white/[0.04]">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-white">{w.name}</div>
                            <div className="mt-1 text-xs text-white/45">#{w.id}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-white/70">{w.skill || "-"}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => { setSelectedWorker(w); setEditWorker(null); setShowWorkerModal(true); }}
                                className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/15 ring-1 ring-white/10"
                                type="button"
                              >
                                <Eye size={14} /> View
                              </button>

                              {isAdmin && (
                                <>
                                  <button
                                    onClick={() => { setSelectedWorker(w); setEditWorker({ ...w }); setShowWorkerModal(true); }}
                                    className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/15 ring-1 ring-white/10"
                                    type="button"
                                  >
                                    <Pencil size={14} /> Edit
                                  </button>

                                  <button
                                    onClick={() => confirmDelete(`worker #${w.id}`, () => workerService.remove(w.id))}
                                    className="inline-flex items-center gap-2 rounded-2xl bg-red-500/15 px-3 py-2 text-xs font-bold text-red-200 hover:bg-red-500/20 ring-1 ring-red-500/25"
                                    type="button"
                                  >
                                    <Trash2 size={14} /> Delete
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>

        {/* USER MODAL (view + edit) */}
        <Modal
          open={showUserModal}
          title={editUser ? "Edit User" : "User Details"}
          onClose={() => {
            setShowUserModal(false);
            setSelectedUser(null);
            setEditUser(null);
          }}
        >
          {editUser ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <div className="text-xs font-bold text-white/60 mb-1">Name</div>
                  <InputPlain value={editUser.name || ""} onChange={(e) => setEditUser((p) => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white/60 mb-1">Email</div>
                  <InputPlain value={editUser.email || ""} onChange={(e) => setEditUser((p) => ({ ...p, email: e.target.value }))} />
                </div>

                <div>
                  <div className="text-xs font-bold text-white/60 mb-1">Role</div>
                  <SelectDark value={editUser.role || "OTHER_STAFF"} onChange={(e) => setEditUser((p) => ({ ...p, role: e.target.value }))}>
                    {["SUPERADMIN","ADMIN","MANAGER","ENGINEER","OTHER_STAFF","WORKER","CUSTOMER"].map((r) => (
                      <option key={r} value={r} className="bg-slate-950">{r}</option>
                    ))}
                  </SelectDark>
                </div>

                <div>
                  <div className="text-xs font-bold text-white/60 mb-1">Status</div>
                  <SelectDark value={editUser.status || "ACTIVE"} onChange={(e) => setEditUser((p) => ({ ...p, status: e.target.value }))}>
                    {["ACTIVE","ON_LEAVE","INACTIVE"].map((s) => (
                      <option key={s} value={s} className="bg-slate-950">{s}</option>
                    ))}
                  </SelectDark>
                </div>

                <div>
                  <div className="text-xs font-bold text-white/60 mb-1">Contact</div>
                  <InputPlain value={editUser.contactNumber || ""} onChange={(e) => setEditUser((p) => ({ ...p, contactNumber: e.target.value }))} />
                </div>

                <div>
                  <div className="text-xs font-bold text-white/60 mb-1">Gender</div>
                  <SelectDark value={editUser.gender || "MALE"} onChange={(e) => setEditUser((p) => ({ ...p, gender: e.target.value }))}>
                    {["MALE","FEMALE","OTHER"].map((g) => (
                      <option key={g} value={g} className="bg-slate-950">{g}</option>
                    ))}
                  </SelectDark>
                </div>

                <div className="md:col-span-2">
                  <div className="text-xs font-bold text-white/60 mb-1">Address</div>
                  <InputPlain value={editUser.address || ""} onChange={(e) => setEditUser((p) => ({ ...p, address: e.target.value }))} />
                </div>

                <div>
                  <div className="text-xs font-bold text-white/60 mb-1">Salary</div>
                  <InputPlain
                    value={String(editUser.salary ?? "")}
                    onChange={(e) => setEditUser((p) => ({ ...p, salary: e.target.value }))}
                    inputMode="decimal"
                  />
                </div>

                <div>
                  <div className="text-xs font-bold text-white/60 mb-1">Password (optional)</div>
                  <InputPlain
                    value={editUser.password || ""}
                    onChange={(e) => setEditUser((p) => ({ ...p, password: e.target.value }))}
                    placeholder="Leave empty to keep old"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setEditUser(null)}
                  className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/15 ring-1 ring-white/10"
                  type="button"
                  disabled={savingUser}
                >
                  Cancel
                </button>
                <button
                  onClick={saveUserEdits}
                  className={cx(
                    "inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20 hover:opacity-95",
                    savingUser && "opacity-60 cursor-not-allowed"
                  )}
                  type="button"
                  disabled={savingUser}
                >
                  {savingUser ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  Save
                </button>
              </div>
            </div>
          ) : !selectedUser ? null : (
            <div className="space-y-4">
              <div className="grid gap-3 text-sm">
                <Row label="Name" value={<span className="font-semibold text-white">{selectedUser.name}</span>} />
                <Row label="Role" value={<RoleBadge role={selectedUser.role} />} />
                <Row label="Gender" value={<span className="text-white/85">{selectedUser.gender || "-"}</span>} />
                <Row label="Status" value={<StatusBadge status={selectedUser.status || "ACTIVE"} />} />
                <Row label="Email" value={<span className="text-white/85">{selectedUser.email || "-"}</span>} />
                <Row label="Contact" value={<span className="text-white/85">{selectedUser.contactNumber || "-"}</span>} />
                <Row label="Address" value={<span className="text-white/85">{selectedUser.address || "-"}</span>} />
                <Row label="Salary" value={<span className="text-white/85">{selectedUser.salary ?? "-"}</span>} />
              </div>

              {isAdmin && (
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditUser({ ...selectedUser, password: "" })}
                    className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/15 ring-1 ring-white/10"
                    type="button"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(`user #${selectedUser.id}`, () => userService.remove(selectedUser.id))}
                    className="inline-flex items-center gap-2 rounded-2xl bg-red-500/15 px-4 py-2 text-sm font-bold text-red-200 hover:bg-red-500/20 ring-1 ring-red-500/25"
                    type="button"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </Modal>

        {/* WORKER MODAL (view + edit) */}
        <Modal
          open={showWorkerModal}
          title={editWorker ? "Edit Worker" : "Worker Details"}
          onClose={() => {
            setShowWorkerModal(false);
            setSelectedWorker(null);
            setEditWorker(null);
          }}
        >
          {editWorker ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <div className="text-xs font-bold text-white/60 mb-1">Name</div>
                  <InputPlain value={editWorker.name || ""} onChange={(e) => setEditWorker((p) => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white/60 mb-1">Skill</div>
                  <InputPlain value={editWorker.skill || ""} onChange={(e) => setEditWorker((p) => ({ ...p, skill: e.target.value }))} />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setEditWorker(null)}
                  className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/15 ring-1 ring-white/10"
                  type="button"
                  disabled={savingWorker}
                >
                  Cancel
                </button>
                <button
                  onClick={saveWorkerEdits}
                  className={cx(
                    "inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20 hover:opacity-95",
                    savingWorker && "opacity-60 cursor-not-allowed"
                  )}
                  type="button"
                  disabled={savingWorker}
                >
                  {savingWorker ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  Save
                </button>
              </div>
            </div>
          ) : !selectedWorker ? null : (
            <div className="space-y-4">
              <div className="grid gap-3 text-sm">
                <Row label="Name" value={<span className="font-semibold text-white">{selectedWorker.name}</span>} />
                <Row label="Skill" value={<span className="text-white/85">{selectedWorker.skill || "-"}</span>} />
              </div>

              {isAdmin && (
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditWorker({ ...selectedWorker })}
                    className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/15 ring-1 ring-white/10"
                    type="button"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(`worker #${selectedWorker.id}`, () => workerService.remove(selectedWorker.id))}
                    className="inline-flex items-center gap-2 rounded-2xl bg-red-500/15 px-4 py-2 text-sm font-bold text-red-200 hover:bg-red-500/20 ring-1 ring-red-500/25"
                    type="button"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </Modal>

        <div className="mt-10 text-center text-xs text-white/40">
          © 2026 Construction Project Management System
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
      <span className="text-white/55">{label}</span>
      <div className="text-right">{value}</div>
    </div>
  );
}

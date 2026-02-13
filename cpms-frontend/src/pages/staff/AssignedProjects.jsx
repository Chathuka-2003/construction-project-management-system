// src/pages/staff/AssignedProjects.jsx
import { useEffect, useMemo, useState, useCallback } from "react";
import NewProjectModal from "../model/NewProjectModal";
import { Search, Plus, ArrowUpDown, Sparkles, Trash2, Pencil } from "lucide-react";
import projectService from "../../services/projectService";
import { getAuth } from "../../services/authService"; // ✅ role + userId

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

/* ------------------- Dark UI helpers ------------------- */

function Pill({ children, tone = "slate" }) {
  const tones = {
    slate: "bg-white/5 text-white/75 ring-white/10",
    blue: "bg-blue-500/15 text-blue-200 ring-blue-500/25",
    emerald: "bg-emerald-500/15 text-emerald-200 ring-emerald-500/25",
    amber: "bg-amber-500/15 text-amber-200 ring-amber-500/25",
    violet: "bg-violet-500/15 text-violet-200 ring-violet-500/25",
    red: "bg-red-500/15 text-red-200 ring-red-500/25",
    orange: "bg-orange-500/15 text-orange-200 ring-orange-500/25",
    cyan: "bg-cyan-500/15 text-cyan-200 ring-cyan-500/25",
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

function normalizeStatus(s) {
  if (!s) return "Planning";
  const v = String(s).toUpperCase();

  // backend enums -> UI labels
  const map = {
    PLANNING: "Planning",
    DESIGN: "Design",
    CONSTRUCTION: "Construction",
    FINISHING: "Finishing",
    HANDOVER: "Handover",
    ON_HOLD: "On Hold",
    ONHOLD: "On Hold",
  };

  return map[v] || (v[0] + v.slice(1).toLowerCase());
}

function StatusPill({ value }) {
  const v = normalizeStatus(value);

  const map = {
    Planning: "slate",
    Design: "violet",
    Construction: "orange",
    Finishing: "emerald",
    Handover: "blue",
    "On Hold": "red",
  };

  return <Pill tone={map[v] || "slate"}>{v}</Pill>;
}

function InputDark(props) {
  return (
    <input
      {...props}
      className={cx(
        "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none",
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
        "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none",
        "focus:border-cyan-500/40 focus:ring-4 focus:ring-cyan-500/10",
        props.className
      )}
    />
  );
}

function ConfirmDialog({ message, onNo, onYes }) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onNo} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-md overflow-hidden rounded-3xl bg-slate-950/60 shadow-2xl shadow-black/40 ring-1 ring-white/10 backdrop-blur-xl">
          <div className="px-6 py-5">
            <h3 className="text-base font-extrabold text-white">Confirm Delete</h3>
            <p className="mt-2 text-sm text-white/65">{message}</p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={onNo}
                className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/15 ring-1 ring-white/10"
                type="button"
              >
                No
              </button>
              <button
                onClick={onYes}
                className="rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 px-4 py-2 text-sm font-extrabold text-white shadow-lg shadow-red-600/20 hover:opacity-95"
                type="button"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------- Backend mapping helpers ------------------- */

function normalizeRole(r) {
  return String(r || "").replace("ROLE_", "").toUpperCase();
}

function toUiProject(p) {
  // try to support multiple response shapes safely
  const customerName =
    p?.customer?.name ||
    p?.customerName ||
    p?.customer ||
    (typeof p?.customerId === "number" ? `Customer #${p.customerId}` : "");

  return {
    id: p?.id,
    title: p?.title ?? p?.name ?? "",
    description: p?.description ?? "",
    location: p?.location ?? "",
    startDate: p?.startDate ?? "",
    status: normalizeStatus(p?.status),
    customer: customerName || "-",
    raw: p,
  };
}

/* ------------------- Page ------------------- */

export default function AssignedProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [q, setQ] = useState("");
  const [sort, setSort] = useState("new"); // new | old

  const [openForm, setOpenForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { userId, role } = getAuth();
      const r = normalizeRole(role);

      let data = [];
      if (r === "SUPERADMIN" || r === "ADMIN") {
        data = await projectService.getAll(); // ✅ ALL projects
      } else if (r === "MANAGER") {
        if (!userId) throw new Error('Missing "userId" in localStorage. Re-login.');
        data = await projectService.getByManager(userId); // ✅ assigned to manager only
      } else {
        // other roles: this endpoint might be forbidden by backend anyway
        data = [];
      }

      const list = Array.isArray(data) ? data : [];
      setProjects(list.map(toUiProject));
    } catch (err) {
      console.error("Failed to load projects:", err);
      setError(err?.response?.data?.message || err?.response?.data || err?.message || "Failed to load projects.");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = [...projects];

    if (needle) {
      list = list.filter(
        (p) =>
          (p.title || "").toLowerCase().includes(needle) ||
          (p.location || "").toLowerCase().includes(needle) ||
          (p.customer || "").toLowerCase().includes(needle)
      );
    }

    list.sort((a, b) => {
      const da = new Date(a.startDate || "1970-01-01").getTime();
      const db = new Date(b.startDate || "1970-01-01").getTime();
      return sort === "new" ? db - da : da - db;
    });

    return list;
  }, [projects, q, sort]);

  const startAdd = () => {
    setSelectedProject(null);
    setOpenForm(true);
  };

  const startEdit = (p) => {
    // pass original backend object if modal expects backend fields
    setSelectedProject(p?.raw || p);
    setOpenForm(true);
  };

  const doDelete = async (id) => {
    try {
      setLoading(true);
      await projectService.delete(id);
      setConfirmId(null);
      // ✅ keep consistent with backend filter rules
      await fetchProjects();
    } catch (err) {
      console.error("Delete error:", err);
      alert(`Failed to delete: ${err?.response?.data?.message || err?.response?.data || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* background glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 left-1/2 h-[480px] w-[980px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 h-[420px] w-[820px] rounded-full bg-cyan-500/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl p-6 md:p-8">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-bold text-white/75 ring-1 ring-white/10">
              <Sparkles size={16} />
              Assigned Projects
            </div>

            <h2 className="mt-4 text-2xl md:text-3xl font-extrabold tracking-tight">Projects</h2>
            <p className="mt-2 text-sm text-white/60">Search by title / customer / location • Sort by start date</p>

            {error && (
              <div className="mt-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                {error}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-extrabold text-white ring-1 ring-white/10 hover:bg-white/15"
              onClick={fetchProjects}
              type="button"
              disabled={loading}
            >
              {loading ? "Loading..." : "Refresh"}
            </button>

            <button
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20 hover:opacity-95"
              onClick={startAdd}
              type="button"
            >
              <Plus size={16} />
              New Project
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-3xl bg-white/5 p-5 shadow-lg shadow-black/20 ring-1 ring-white/10 backdrop-blur-xl">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-3.5 text-white/35" size={18} />
              <InputDark
                className="pl-11"
                placeholder="Search by title, customer, or location..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>

            <div className="relative">
              <ArrowUpDown className="absolute left-4 top-3.5 text-white/35" size={18} />
              <SelectDark className="pl-11" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="new" className="bg-slate-950">
                  Date: New → Old
                </option>
                <option value="old" className="bg-slate-950">
                  Date: Old → New
                </option>
              </SelectDark>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-hidden rounded-3xl bg-white/5 shadow-lg shadow-black/20 ring-1 ring-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <h3 className="text-sm font-extrabold text-white">Project Records</h3>
            <div className="text-xs text-white/50">{loading ? "Loading..." : `${filtered.length} results`}</div>
          </div>

          {filtered.length === 0 ? (
            <div className="px-6 py-14 text-center text-sm text-white/60">
              {loading ? "Loading projects..." : "No projects found."}{" "}
              {!loading && (
                <>
                  Click <span className="font-bold text-white">New Project</span> to add one.
                </>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-white/[0.03]">
                  <tr className="text-left text-xs font-bold uppercase tracking-wide text-white/60">
                    <th className="px-6 py-3">Project</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Location</th>
                    <th className="px-6 py-3">Start</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right" style={{ width: 190 }}>
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/10">
                  {filtered.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.04]">
                      <td className="px-6 py-4 align-top">
                        <div className="font-semibold text-white">{p.title || "-"}</div>
                        {p.description ? (
                          <div className="mt-1 line-clamp-2 text-sm text-white/55">{p.description}</div>
                        ) : (
                          <div className="mt-1 text-sm text-white/35">No description</div>
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm text-white/70">{p.customer || "-"}</td>

                      <td className="px-6 py-4 text-sm text-white/70">{p.location || "-"}</td>

                      <td className="px-6 py-4 text-sm text-white/70">{p.startDate || "-"}</td>

                      <td className="px-6 py-4">
                        <StatusPill value={p.status} />
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/15 ring-1 ring-white/10"
                            onClick={() => startEdit(p)}
                            type="button"
                          >
                            <Pencil size={14} />
                            Edit
                          </button>

                          <button
                            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 px-3 py-2 text-xs font-extrabold text-white shadow-lg shadow-red-600/20 hover:opacity-95"
                            onClick={() => setConfirmId(p.id)}
                            type="button"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-10 text-center text-xs text-white/40">© 2026 Construction Project Management System</div>
      </div>

      {/* ✅ Modal (CREATE / EDIT) */}
      {openForm && (
        <NewProjectModal
          onClose={() => {
            setOpenForm(false);
            setSelectedProject(null);
          }}
          project={selectedProject}
          isEdit={!!selectedProject?.id}
          onSuccess={async () => {
            setOpenForm(false);
            setSelectedProject(null);
            await fetchProjects(); // ✅ always refresh from backend (fixes "shows only before refresh")
          }}
        />
      )}

      {/* Confirm Delete */}
      {confirmId && (
        <ConfirmDialog
          message="Are you sure you want to delete this project?"
          onNo={() => setConfirmId(null)}
          onYes={() => doDelete(confirmId)}
        />
      )}
    </div>
  );
}

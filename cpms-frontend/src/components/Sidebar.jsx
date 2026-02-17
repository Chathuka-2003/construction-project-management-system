import { useMemo, useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  ClipboardList,
  Truck,
  Calendar,
  MessageSquare,
  Users,
  User,
  LogOut,
  Boxes,
  CreditCard,
  ChevronDown,
} from "lucide-react";


/**
 * Backend roles:
 * SUPERADMIN, ADMIN, MANAGER  -> "admin"
 * ENGINEER, OTHER_STAFF, WORKER -> "staff"
 * CUSTOMER -> blocked
 */
function normalizePortalRole(roleRaw) {
  const r = String(roleRaw || "").replace("ROLE_", "").trim().toUpperCase();
  if (r === "SUPERADMIN" || r === "ADMIN" || r === "MANAGER") return "admin";
  if (r === "ENGINEER" || r === "OTHER_STAFF" || r === "WORKER") return "staff";
  return null;
}

// ================= NAVIGATION =================
const NAV = [
  // ADMIN
  { label: "Admin Overview", icon: LayoutDashboard, to: "/admin/overview", roles: ["admin"] },
  { label: "Worker Management", icon: Users, to: "/admin/workers", roles: ["admin"] },

  // STAFF
  { label: "Staff Overview", icon: LayoutDashboard, to: "/staff/overview", roles: ["staff"] },

  // SHARED
  {
    label: "Payments",
    icon: CreditCard,
    to: (role) => (role === "admin" ? "/admin/payment" : "/staff/payment"),
    roles: ["admin", "staff"],
  },

  {
    label: "Projects",
    icon: FolderKanban,
    roles: ["admin", "staff"],
    children: [
      {
        label: "Assigned Projects",
        to: (role) => (role === "admin" ? "/admin/projects" : "/staff/projects"),
        roles: ["admin", "staff"],
      },
      {
        label: "Dashboard",
        to: (role) => (role === "admin" ? "/admin/dashboard" : "/staff/dashboard"),
        roles: ["admin", "staff"],
      },
    ],
  },

  {
    label: "Tasks",
    icon: ClipboardList,
    to: (role) => (role === "admin" ? "/admin/tasks" : "/staff/tasks"),
    roles: ["admin", "staff"],
  },

  {
    label: "Appointments",
    icon: Calendar,
    to: (role) => (role === "admin" ? "/admin/appointments" : "/staff/appointments"),
    roles: ["admin", "staff"],
  },

  {
    label: "Messages",
    icon: MessageSquare,
    to: (role) => (role === "admin" ? "/admin/messages" : "/staff/messages"),
    roles: ["admin", "staff"],
  },

  // VEHICLE
  {
    label: "Vehicle Management",
    icon: Truck,
    roles: ["admin", "staff"],
    children: [
      {
        label: "Vehicle Dashboard",
        to: (role) => (role === "admin" ? "/admin/vehicle" : "/staff/vehicle"),
        roles: ["admin", "staff"],
      },
      {
        label: "Vehicle Assignment",
        to: (role) => (role === "admin" ? "/admin/vehicle/assignment" : "/staff/vehicle/assignment"),
        roles: ["admin", "staff"],
      },
      { label: "Manage Vehicles", to: "/admin/manage", roles: ["admin"] },
    ],
  },

  // RESOURCE
  {
    label: "Resource Allocation",
    icon: Boxes,
    to: (role) => (role === "admin" ? "/admin/allocation" : "/staff/allocation"),
    roles: ["admin", "staff"],
  },

  { label: "Staff Profile", icon: User, to: "/staff/profile", roles: ["staff"] },
  { label: "Admin Profile", icon: User, to: "/admin/profile", roles: ["admin"] },
];

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ✅ exact match helper (prevents double blue)
function isExactOrChild(pathname, base) {
  if (!base) return false;
  return pathname === base || pathname.startsWith(base + "/");
}

export default function Sidebar({ role: roleProp }) {
  const navigate = useNavigate();
  const location = useLocation();

  const portalRole = useMemo(() => {
    if (roleProp) return roleProp;
    return normalizePortalRole(localStorage.getItem("role"));
  }, [roleProp]);

  useEffect(() => {
    if (!portalRole) {
      localStorage.clear();
      navigate("/login", { replace: true });
    }
  }, [portalRole, navigate]);

  const items = useMemo(() => {
    if (!portalRole) return [];
    return NAV.filter((item) => item.roles?.includes(portalRole)).map((item) => {
      if (!item.children) return item;
      const kids = item.children.filter((c) => c.roles?.includes(portalRole));
      return { ...item, children: kids };
    });
  }, [portalRole]);

  const [openMenu, setOpenMenu] = useState(null);

  // ✅ auto-open parent menu when inside any child route
  useEffect(() => {
    if (!portalRole) return;

    const activeParent = items.find((it) => {
      if (!it.children?.length) return false;
      return it.children.some((c) => {
        const path = typeof c.to === "function" ? c.to(portalRole) : c.to;
        return isExactOrChild(location.pathname, path);
      });
    });

    if (activeParent) setOpenMenu(activeParent.label);
  }, [items, location.pathname, portalRole]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  if (!portalRole) return null;

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col bg-slate-900 text-white overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-800 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 font-bold text-white shadow-lg">
            EB
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Echo Build</h1>
            <p className="text-xs text-slate-400">
              {portalRole === "admin" ? "Admin Portal" : "Staff Portal"}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
        <div className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;

            // SUBMENU
            if (item.children?.length) {
              const isOpen = openMenu === item.label;

              const hasActiveChild = item.children.some((c) => {
                const path = typeof c.to === "function" ? c.to(portalRole) : c.to;
                return isExactOrChild(location.pathname, path);
              });

              return (
                <div key={item.label} className="select-none">
                  <button
                    type="button"
                    onClick={() => setOpenMenu(isOpen ? null : item.label)}
                    className={cx(
                      "flex w-full items-center justify-between rounded-xl px-4 py-2 text-sm transition",
                      hasActiveChild ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} />
                      <span className="font-medium">{item.label}</span>
                    </div>

                    <ChevronDown
                      size={16}
                      className={cx("transition-transform", isOpen ? "rotate-180" : "rotate-0")}
                    />
                  </button>

                  {isOpen && (
                    <div className="ml-4 mt-1 space-y-1 border-l border-slate-800 pl-3">
                      {item.children.map((sub) => {
                        const to = typeof sub.to === "function" ? sub.to(portalRole) : sub.to;
                        

                        return (
                          <NavLink
                            key={sub.label}
                            to={to}
                            end
                            className={({ isActive }) =>
                              cx(
                                "block rounded-xl px-3 py-2 text-sm transition",
                                isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800"
                              )
                            }
                          >
                            {sub.label}
                          </NavLink>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // NORMAL LINK
            const to = typeof item.to === "function" ? item.to(portalRole) : item.to;

            return (
              <NavLink
                key={item.label}
                to={to}
                end
                className={({ isActive }) =>
                  cx(
                    "flex items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium transition",
                    isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800"
                  )
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800 p-3">
        <button
          onClick={handleLogout}
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-slate-800"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

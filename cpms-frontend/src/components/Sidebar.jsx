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
 * Normalize role from storage/back-end:
 * ADMIN/SUPERADMIN -> "admin"
 * everything else -> "staff"
 */
function normalizeRole(roleRaw) {
  const r = String(roleRaw || "").toUpperCase();
  if (r === "ADMIN" || r === "SUPERADMIN") return "admin";
  return "staff";
}

// ================= NAVIGATION =================
const NAV = [
  // ================= ADMIN =================
  { label: "Admin Overview", icon: LayoutDashboard, to: "/admin", roles: ["admin"] },
  { label: "Worker Management", icon: Users, to: "/admin/workers", roles: ["admin"] },
   { label: "Staff Overview", icon: LayoutDashboard, to: "/staff", roles: ["staff"] },
  { label: "Payments", icon: CreditCard, to: (role) => (role === "admin" ? "/admin/payment" : "/staff/payment"), roles: ["admin","staff"] },
  

  // ================= STAFF =================
 

  {
    label: "Projects",
    icon: FolderKanban,
    roles: ["admin", "staff"],
    children: [
      { label: "Assigned Projects", to: (role) => role === "admin" ? "/admin/projects" : "/staff/projects", roles: ["admin","staff"] },
      { label: "Dashboard", to: (role) => role === "admin" ? "/admin/dashboard" : "/staff/dashboard", roles: ["admin","staff"] }

    ]
  },
  { label: "Tasks", icon: ClipboardList, to: (role) => (role === "admin" ? "/admin/tasks" : "/staff/tasks"), roles: ["admin","staff"] },
   { label: "Appointments", icon: Calendar, to: (role) => (role === "admin" ? "/admin/appointments" : "/staff/appointments"), roles: ["admin","staff"] },
    { label: "messages", icon: MessageSquare, to: (role) => (role === "admin" ? "/admin/messages" : "/staff/messages"), roles: ["admin","staff"] },
 
  // ================= VEHICLE =================
  {
    label: "Vehicle Management",
    icon: Truck,
    roles: ["admin", "staff"],
    children: [
     { label: "Vehicle Dashboard", to: (role) => role === "admin" ? "/admin/vehicle" : "/staff/vehicle", roles: ["admin","staff"] },
      { label: "Vehicle Assignment", to: (role) => role === "admin" ? "/admin/vehicle/assignment" : "/staff/vehicle/assignment", roles: ["admin","staff"] },
      { label: "Manage Vehicles", to: "/admin/manage", roles: ["admin"] },
    ],
  },

  // ================= RESOURCE =================
   { label: "Resource Allocation", icon: Boxes, to: (role) => (role === "admin" ? "/admin/allocation" : "/staff/allocation"), roles: ["admin","staff"] },
    { label: "Staff Profile", icon: User, to: "/staff/profile", roles: ["staff"] },
      { label: "Admin Profile", icon: User, to: "/admin/profile", roles: ["admin"] },

];

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar({ role: roleProp }) {
  const navigate = useNavigate();
  const location = useLocation();

  const role = useMemo(() => normalizeRole(roleProp || localStorage.getItem("role")), [roleProp]);

  // Filter navigation by role (for both parent & children)
  const items = useMemo(() => {
    return NAV.filter((item) => item.roles?.includes(role)).map((item) => {
      if (!item.children) return item;
      const kids = item.children.filter((c) => c.roles?.includes(role));
      return { ...item, children: kids };
    });
  }, [role]);

  // Auto-open submenu if current route matches a child
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    const activeParent = items.find(
      (it) =>
        it.children?.length &&
        it.children.some((c) => location.pathname.startsWith(typeof c.to === "function" ? c.to(role) : c.to))
    );
    if (activeParent) setOpenMenu(activeParent.label);
  }, [items, location.pathname, role]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <aside className="flex h-screen w-64 flex-col bg-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 px-6 py-5">
        <h1 className="text-lg font-semibold tracking-wide">Construction System</h1>
        <p className="mt-1 text-xs text-slate-400">
          {role === "admin" ? "Admin Portal" : "Staff Portal"}
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;

            // Submenu
            if (item.children?.length) {
              const isOpen = openMenu === item.label;
              const hasActiveChild = item.children.some((c) =>
                location.pathname.startsWith(typeof c.to === "function" ? c.to(role) : c.to)
              );

              return (
                <div key={item.label} className="select-none">
                  <button
                    type="button"
                    onClick={() => setOpenMenu(isOpen ? null : item.label)}
                    className={cx(
                      "flex w-full items-center justify-between rounded-xl px-4 py-2 text-sm transition",
                      hasActiveChild ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800"
                    )}
                    aria-expanded={isOpen}
                    aria-controls={`submenu-${item.label}`}
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
                    <div id={`submenu-${item.label}`} className="ml-4 mt-1 space-y-1 border-l border-slate-800 pl-3">
                      {item.children.map((sub) => (
                        <NavLink
                          key={sub.to}
                          to={typeof sub.to === "function" ? sub.to(role) : sub.to}
                          className={({ isActive }) =>
                            cx(
                              "block rounded-xl px-3 py-2 text-sm transition",
                              isActive
                                ? "bg-blue-600 text-white"
                                : "text-slate-300 hover:bg-slate-800"
                            )
                          }
                        >
                          {sub.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            // Normal link
            return (
              <NavLink
                key={item.to}
                to={typeof item.to === "function" ? item.to(role) : item.to}
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

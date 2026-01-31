// src/components/Sidebar.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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

const sidebarItems = [
  // ===== OVERVIEW =====
  { label: "Overview", icon: LayoutDashboard, path: "/admin", roles: ["admin"] },
  { label: "Overview", icon: LayoutDashboard, path: "/staff", roles: ["staff"] },

  // ===== PROJECTS =====
  { label: "Project Dashboard", icon: FolderKanban, path: "/projects", roles: ["admin", "staff"] },

  // ===== TASKS =====
  { label: "Tasks Management", icon: ClipboardList, path: "/tasks", roles: ["admin", "staff"] },

  // ===== VEHICLE MANAGEMENT =====
  {
    label: "Vehicle Management",
    icon: Truck,
    path: "/vehicle",
    roles: ["admin", "staff"],
    children: [
      { label: "Vehicle Dashboard", path: "/vehicle", roles: ["admin", "staff"] },
      { label: "Vehicle Assignment", path: "/assignment", roles: ["admin", "staff"] },
      { label: "Manage Vehicles", path: "/manage", roles: ["admin", "staff"] },
    ],
  },

  // ===== RESOURCE =====
  { label: "Resource Management", icon: Boxes, path: "/allocation", roles: ["admin", "staff"] },

  // ===== APPOINTMENTS / MESSAGES =====
  { label: "Appointments", icon: Calendar, path: "/appointments", roles: ["admin", "staff"] },
  { label: "Messages", icon: MessageSquare, path: "/messages", roles: ["admin", "staff"] },

  // ===== USER MANAGEMENT =====
  { label: "User Management", icon: Users, path: "/management", roles: ["admin", "staff"] },

  // ===== PAYMENTS (ADMIN ONLY) =====
  { label: "Payments", icon: CreditCard, path: "/payment", roles: ["admin"] },

  // ===== PROFILE =====
  { label: "Profile", icon: User, path: "/aprofile", roles: ["admin"] },
  { label: "Profile", icon: User, path: "/profile", roles: ["staff"] },
];

export default function Sidebar({ role }) {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <aside className="w-64 h-screen bg-slate-900 text-white flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-700">
        <h1 className="text-lg font-semibold">Construction System</h1>
        <p className="text-xs text-slate-400">
          {role === "admin" ? "Admin Portal" : "Staff Portal"}
        </p>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {sidebarItems
          .filter((item) => item.roles.includes(role))
          .map((item, index) => {
            const Icon = item.icon;

            // SUB MENU
            if (item.children) {
              return (
                <div key={index}>
                  <button
                    onClick={() =>
                      setOpenMenu(openMenu === item.label ? null : item.label)
                    }
                    className="w-full flex items-center justify-between px-4 py-2 text-slate-300 hover:bg-slate-800 rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} />
                      {item.label}
                    </div>
                    <ChevronDown
                      size={16}
                      className={`${openMenu === item.label ? "rotate-180" : ""} transition`}
                    />
                  </button>

                  {openMenu === item.label && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children
                        .filter((sub) => sub.roles.includes(role))
                        .map((sub, i) => (
                          <NavLink
                            key={i}
                            to={sub.path}
                            className={({ isActive }) =>
                              `block px-3 py-2 text-sm rounded-md
                              ${isActive
                                ? "bg-blue-600 text-white"
                                : "text-slate-400 hover:bg-slate-800"}`
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

            // NORMAL ITEM
            return (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-md text-sm
                  ${isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800"}`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-slate-800 rounded-md"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

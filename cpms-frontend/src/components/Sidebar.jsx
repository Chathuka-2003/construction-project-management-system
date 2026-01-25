import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Truck,
  Calendar,
  MessageSquare,
  Users,
  User,
} from "lucide-react";

const sidebarItems = [
  { label: "Overview", icon: LayoutDashboard, path: "/admin", roles: ["admin"] },
  { label: "Project Dashboard", icon: FolderKanban, path: "/projects", roles: ["admin", "staff"] },
  { label: "Tasks Management", icon: CheckSquare, path: "/tasks", roles: ["admin", "staff"] },
    { label: "User Management", icon: CheckSquare, path: "/management", roles: ["admin", "staff"] },
  { label: "Vehicle Management", icon: Truck, path: "/vehicles", roles: ["admin", "staff"] },
    { label: "Resource Management", icon: CheckSquare, path: "/allocation", roles: ["admin", "staff"] },
  { label: "Appointments", icon: Calendar, path: "/appointments", roles: ["admin", "staff"] },
  { label: "Messages", icon: MessageSquare, path: "/messages", roles: ["admin", "staff"] },
    { label: "Payments", icon: CheckSquare, path: "/payment", roles: ["admin"] },


  // STAFF ONLY EXTRAS
    { label: "Overview", icon: LayoutDashboard, path: "/staff", roles: ["staff"] },
  { label: "Users", icon: Users, path: "/users", roles: ["staff"] },
  { label: "Workers", icon: Users, path: "/workers", roles: ["staff"] },

  { label: "Profile", icon: User, path: "/aprofile", roles: ["admin"] },
  { label: "Profile", icon: User, path: "/sprofile", roles: [ "staff"] },
];

export default function Sidebar({ role }) {
  return (
    <aside className="w-64 h-screen bg-slate-900 text-white flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 text-lg font-semibold border-b border-slate-700">
        Construction System
        <p className="text-xs text-slate-400 mt-1">
          {role === "admin" ? "Admin Portal" : "Staff Portal"}
        </p>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {sidebarItems
          .filter(item => item.roles.includes(role))
          .map((item, index) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-md text-sm
                  ${isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800"}`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
      </nav>
    </aside>
  );
}

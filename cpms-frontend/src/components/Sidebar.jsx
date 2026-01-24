// src/components/Sidebar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  DollarSign,
  Truck,
  User,
  FileText,
  ChevronDown,
  ChevronRight,
  Briefcase,
  Users,
} from "lucide-react";

export default function Sidebar({ role }) {
  const location = useLocation();

  const [expandedMenus, setExpandedMenus] = useState({
    projects: true,
    tasks: true,
    vehicles: true,
    users: true,
  });

  const toggleMenu = (menu) => {
    setExpandedMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const isActive = (path) => location.pathname === path;
  const isDropdownActive = (paths) => paths.some((p) => location.pathname.includes(p));

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-screen">
      {/* Logo */}
      <div className="p-4 border-b border-gray-800 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <Briefcase className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-bold text-lg">{role === "admin" ? "CMS Admin" : "CMS Staff"}</h2>
          <p className="text-xs text-gray-400">Construction Mgmt</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {/* Overview */}
        <Link
          to={role === "admin" ? "/admin" : "/staff"}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
            isActive(role === "admin" ? "/admin" : "/staff")
              ? "bg-gray-800 text-white"
              : "text-gray-300 hover:bg-gray-800"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-sm font-medium">Overview</span>
        </Link>

        {/* Admin Menu */}
        {role === "admin" && (
          <>
            {/* User Management */}
            <div>
              <button
                onClick={() => toggleMenu("users")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${
                  isDropdownActive([
                    "/management",
                    "/adduser",
                    "/addworker",
                    "/allocation",
                  ])
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  <span className="text-sm font-medium">User Management</span>
                </div>
                {expandedMenus.users ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {expandedMenus.users && (
                <div className="ml-8 mt-1 space-y-1">
                  <Link
                    to="/management"
                    className={`block px-3 py-1.5 text-sm rounded ${
                      isActive("/management") ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white hover:bg-gray-700"
                    }`}
                  >
                    Worker Dashboard
                  </Link>
                  <Link
                    to="/adduser"
                    className={`block px-3 py-1.5 text-sm rounded ${
                      isActive("/adduser") ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white hover:bg-gray-700"
                    }`}
                  >
                    Add User
                  </Link>
                  <Link
                    to="/admin/addworker"
                    className={`block px-3 py-1.5 text-sm rounded ${
                      isActive("/addworker") ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white hover:bg-gray-700"
                    }`}
                  >
                    Add Worker
                  </Link>
                  <Link
                    to="/allocation"
                    className={`block px-3 py-1.5 text-sm rounded ${
                      isActive("/allocation") ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white hover:bg-gray-700"
                    }`}
                  >
                    Resource Allocation
                  </Link>
                </div>
              )}
            </div>

            {/* Payments */}
            <Link
              to="/payments"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive("/payments") ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <DollarSign className="w-5 h-5" />
              <span className="text-sm font-medium">Payments</span>
            </Link>
          </>
        )}

        {/* Staff Menu */}
        {role === "staff" && (
          <>
            {/* Projects */}
            <div>
              <button
                onClick={() => toggleMenu("projects")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${
                  isDropdownActive(["/staff/projects", "/staff/resource-allocation"])
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <FolderKanban className="w-5 h-5" />
                  <span className="text-sm font-medium">Projects</span>
                </div>
                {expandedMenus.projects ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {expandedMenus.projects && (
                <div className="ml-8 mt-1 space-y-1">
                  <Link
                    to="/staff/projects/my"
                    className={`block px-3 py-1.5 text-sm rounded ${
                      isActive("/staff/projects/my") ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white hover:bg-gray-700"
                    }`}
                  >
                    My Projects
                  </Link>
                  <Link
                    to="/staff/projects/all"
                    className={`block px-3 py-1.5 text-sm rounded ${
                      isActive("/staff/projects/all") ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white hover:bg-gray-700"
                    }`}
                  >
                    Project List
                  </Link>
                  <Link
                    to="/allocation"
                    className={`block px-3 py-1.5 text-sm rounded ${
                      isActive("/allocation") ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white hover:bg-gray-700"
                    }`}
                  >
                    Resource Allocation
                  </Link>
                </div>
              )}
            </div>
          </>
        )}

        {/* Task Management */}
<div>
  <button
    onClick={() => toggleMenu("taskManagement")}
    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${
      isDropdownActive(["/task-management", "/task-management/all"])
        ? "bg-gray-800 text-white"
        : "text-gray-300 hover:bg-gray-800"
    }`}
  >
    <div className="flex items-center gap-3">
      <CheckSquare className="w-5 h-5" />
      <span className="text-sm font-medium">Task Management</span>
    </div>
    {expandedMenus.taskManagement ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
  </button>
  {expandedMenus.taskManagement && (
    <div className="ml-8 mt-1 space-y-1">
      <Link
        to="/task-management/my"
        className={`block px-3 py-1.5 text-sm rounded ${
          isActive("/task-management/my") ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white hover:bg-gray-700"
        }`}
      >
        My Tasks
      </Link>
      <Link
        to="/task-management/all"
        className={`block px-3 py-1.5 text-sm rounded ${
          isActive("/task-management/all") ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white hover:bg-gray-700"
        }`}
      >
        Task List
      </Link>
    </div>
  )}
</div>

{/* Project Management */}
<div>
  <button
    onClick={() => toggleMenu("projectManagement")}
    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${
      isDropdownActive(["/project-management", "/project-management/all"])
        ? "bg-gray-800 text-white"
        : "text-gray-300 hover:bg-gray-800"
    }`}
  >
    <div className="flex items-center gap-3">
      <FolderKanban className="w-5 h-5" />
      <span className="text-sm font-medium">Project Management</span>
    </div>
    {expandedMenus.projectManagement ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
  </button>
  {expandedMenus.projectManagement && (
    <div className="ml-8 mt-1 space-y-1">
      <Link
        to="/project-management/my"
        className={`block px-3 py-1.5 text-sm rounded ${
          isActive("/project-management/my") ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white hover:bg-gray-700"
        }`}
      >
        My Projects
      </Link>
      <Link
        to="/project-management/all"
        className={`block px-3 py-1.5 text-sm rounded ${
          isActive("/project-management/all") ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white hover:bg-gray-700"
        }`}
      >
        Project List
      </Link>
    </div>
  )}
</div>
{/* Vehicles */}
<div>
  <button
    onClick={() => toggleMenu("vehicles")}
    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${
      isDropdownActive(["/vehicle-management"]) ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-800"
    }`}
  >
    <Truck className="w-5 h-5" />
    <span className="text-sm font-medium">Vehicles</span>
    {expandedMenus.vehicles ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
  </button>

  {expandedMenus.vehicles && (
    <div className="ml-8 mt-1 space-y-1">
      <Link
        to="/vehicle-management"
        className={`block px-3 py-1.5 text-sm rounded ${
          isActive("/vehicle-management") ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white hover:bg-gray-700"
        }`}
      >
        Vehicle List
      </Link>
    </div>
  )}
</div>



        {/* Profile */}
        <Link
          to={role === "admin" ? "/admin/profile" : "/staff/profile"}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
            isActive(role === "admin" ? "/admin/profile" : "/staff/profile") ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-800"
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-sm font-medium">Profile</span>
        </Link>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {role === "admin" ? "A" : "S"}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{role === "admin" ? "Admin User" : "Staff User"}</p>
            <p className="text-xs text-gray-400">{role === "admin" ? "Administrator" : "Staff Engineer"}</p>
          </div>
        </div>
        <button className="w-full mt-3 px-3 py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center gap-2">
          Sign Out
        </button>
      </div>
    </div>
  );
}

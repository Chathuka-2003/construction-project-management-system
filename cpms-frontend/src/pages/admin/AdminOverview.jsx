import React from "react";
import {
  FolderKanban,
  ClipboardList,
  Truck,
  Calendar,
  FileText,
  UserPlus,
  FileBarChart,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* =======================
   ADMIN OVERVIEW PAGE
======================= */

export default function AdminOverview() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Admin Overview
        </h1>
        <p className="text-gray-600 mt-1">
          Welcome to your Admin Dashboard. Here’s today’s system snapshot.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={FolderKanban} title="Active Projects" value="12" color="blue" />
        <StatCard icon={ClipboardList} title="Pending Tasks" value="34" color="orange" />
        <StatCard icon={Truck} title="Assigned Vehicles" value="8" color="green" />
        <StatCard icon={Calendar} title="Appointments" value="5" color="purple" />
      </div>

      {/* Quick Actions */}
      <QuickActions navigate={navigate} />
      
      {/* Attendance removed */}
    </div>
  );
}

/* =======================
   STAT CARD
======================= */

function StatCard({ icon: Icon, title, value, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-lg ${colors[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500">{title}</p>
      </div>
    </div>
  );
}

/* =======================
   QUICK ACTIONS
======================= */

function QuickActions({ navigate }) {
  const actions = [
    { title: "New Project", icon: FileText, color: "blue", path: "/admin/newprojects" },
    { title: "Assign Task", icon: ClipboardList, color: "purple", path: "/admin/newtask" },
    { title: "Add Worker", icon: UserPlus, color: "green", path: "/admin/add-worker" },
    { title: "Register User", icon: Users, color: "orange", path: "/admin/register" },
    
  ];

  const styles = {
    blue: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    purple: "bg-purple-50 text-purple-600 hover:bg-purple-100",
    green: "bg-green-50 text-green-600 hover:bg-green-100",
    orange: "bg-orange-50 text-orange-600 hover:bg-orange-100",
    indigo: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100",
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map(({ title, icon: Icon, color, path }) => (
          <button
            key={title}
            onClick={() => navigate(path)}
            className={`p-6 rounded-2xl transition hover:scale-105 shadow-sm ${styles[color]}`}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-white rounded-xl">
                <Icon className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold">{title}</h3>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

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
import DashboardLayout from "../../components/common/DashboardLayout";

/* =======================
   ADMIN OVERVIEW PAGE
======================= */

export default function AdminOverview() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "admin";

  return (
    <DashboardLayout role={role}>
      <div className="p-6 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Admin Overview</h1>
        <p className="text-gray-600 mt-1">
          Welcome to your Admin Dashboard. Here’s today’s system snapshot.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FolderKanban}
          title="Active Projects"
          value="12"
          color="blue"
        />
        <StatCard
          icon={ClipboardList}
          title="Pending Tasks"
          value="34"
          color="orange"
        />
        <StatCard
          icon={Truck}
          title="Assigned Vehicles"
          value="8"
          color="green"
        />
        <StatCard
          icon={Calendar}
          title="Appointments"
          value="5"
          color="purple"
        />
      </div>

      {/* Quick Actions */}
      <QuickActions navigate={navigate} />

      {/* Staff Attendance */}
      <StaffAttendancePreview />
    </div>
    </DashboardLayout>
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
   QUICK ACTIONS (NAVIGATION ENABLED)
======================= */

function QuickActions({ navigate }) {
  const actions = [
    {
      title: "New Project",
      icon: FileText,
      color: "blue",
      path: "/admin/projects/new",
    },
    {
      title: "Assign Task",
      icon: ClipboardList,
      color: "purple",
      path: "/admin/tasks/assign",
    },
    {
      title: "Add Worker",
      icon: UserPlus,
      color: "green",
      path: "/addworker",
    },
    {
      title: "Add Staff",
      icon: Users,
      color: "orange",
      path: "/adduser",
    },
    {
      title: "Generate Report",
      icon: FileBarChart,
      color: "indigo",
      path: "@",
    },
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
            className={`p-6 rounded-2xl transition transform hover:scale-105 shadow-sm hover:shadow-md ${styles[color]}`}
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="p-4 rounded-xl bg-white">
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

/* =======================
   STAFF ATTENDANCE PREVIEW
======================= */

function StaffAttendancePreview() {
  const staff = [
    { id: "EMP001", name: "John Anderson", status: "Present" },
    { id: "EMP002", name: "Sarah Mitchell", status: "Present" },
    { id: "EMP003", name: "Michael Chen", status: "Break" },
    { id: "EMP004", name: "Emma Rodriguez", status: "Present" },
  ];

  const statusStyle = {
    Present: "bg-green-100 text-green-700",
    Break: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-lg font-bold text-gray-800">
          Staff Attendance Today
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium">{s.id}</td>
                <td className="px-6 py-4 text-sm">{s.name}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle[s.status]}`}
                  >
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

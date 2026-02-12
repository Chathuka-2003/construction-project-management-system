import React, { useState } from "react";
import {
  FolderKanban,
  ClipboardList,
  Truck,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function StaffOverview() {
  const [currentDate] = useState(
    new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Overview</h1>
          <p className="text-gray-500 mt-1">
            Welcome back! Here's your workspace.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Today</p>
          <p className="text-sm font-medium text-gray-800">{currentDate}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card icon={<FolderKanban />} title="My Active Projects" value="5" color="blue" />
        <Card icon={<ClipboardList />} title="Pending Tasks" value="12" color="orange" />
        <Card icon={<Truck />} title="Assigned Vehicles" value="2" color="green" />
        <Card icon={<Calendar />} title="Today's Appointments" value="3" color="purple" />
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaskList />
        <ProjectList />
      </div>
    </div>
  );
}

/* ---------- Cards ---------- */

const colorMap = {
  blue: "bg-blue-50 text-blue-700",
  orange: "bg-orange-50 text-orange-700",
  green: "bg-green-50 text-green-700",
  purple: "bg-purple-50 text-purple-700",
};

function Card({ icon, title, value, color }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-lg ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500">{title}</p>
      </div>
    </div>
  );
}

/* ---------- Tasks ---------- */

function TaskList() {
  const tasks = [
    { title: "Inspect concrete pour at Site A", time: "9:00 AM", priority: "High", location: "Site A" },
    { title: "Update project progress report", time: "11:30 AM", priority: "Medium", location: "Docs" },
    { title: "Team meeting - Harbor Bridge", time: "2:00 PM", priority: "Medium", location: "Meeting" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b font-bold text-gray-800">
        My Tasks Today
      </div>
      <div className="p-6 space-y-4">
        {tasks.map((task, i) => (
          <div key={i} className="p-4 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-800">{task.title}</p>
            <div className="mt-2 flex gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {task.time}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {task.location}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Projects ---------- */

function ProjectList() {
  const projects = [
    { name: "Downtown Office Complex", progress: 73, status: "On Track" },
    { name: "Harbor Bridge Construction", progress: 45, status: "Delayed" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b font-bold text-gray-800">
        My Projects
      </div>
      <div className="p-6 space-y-4">
        {projects.map((p, i) => (
          <div key={i}>
            <div className="flex justify-between text-sm mb-1">
              <span>{p.name}</span>
              <span>{p.progress}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-blue-600 rounded-full"
                style={{ width: `${p.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

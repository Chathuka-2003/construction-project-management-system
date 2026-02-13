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
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 h-[380px] w-[680px] rounded-full bg-cyan-500/15 blur-3xl" />
      </div>

      <div className="relative w-full p-6 md:p-8 space-y-10">
        {/* Header */}
        <div className="rounded-3xl bg-white/5 p-6 md:p-8 ring-1 ring-white/10 backdrop-blur-xl shadow-lg shadow-black/20">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Staff Overview</h1>
              <p className="mt-2 text-sm text-white/65">
                Welcome back! Here's your workspace.
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/60">Today</p>
              <p className="text-sm font-medium text-white/80">{currentDate}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card icon={<FolderKanban />} title="My Active Projects" value="5" color="blue" />
          <Card icon={<ClipboardList />} title="Pending Tasks" value="12" color="amber" />
          <Card icon={<Truck />} title="Assigned Vehicles" value="2" color="emerald" />
          <Card icon={<Calendar />} title="Today's Appointments" value="3" color="violet" />
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TaskList />
          <ProjectList />
        </div>

        <div className="pt-2 text-center text-xs text-white/45">
          © 2026 Construction Project Management System
        </div>
      </div>
    </div>
  );
}

/* ---------- Cards ---------- */

const colorMap = {
  blue: "bg-blue-500/10 ring-blue-500/20 text-blue-200",
  amber: "bg-amber-500/10 ring-amber-500/20 text-amber-200",
  emerald: "bg-emerald-500/10 ring-emerald-500/20 text-emerald-200",
  violet: "bg-violet-500/10 ring-violet-500/20 text-violet-200",
};

function Card({ icon, title, value, color }) {
  return (
    <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-xl shadow-lg shadow-black/20">
      <div className={`p-3 rounded-lg ring-1 ${colorMap[color]}`}>
        {icon}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-extrabold text-white">{value}</p>
        <p className="mt-1 text-sm text-white/60">{title}</p>
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
    <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur-xl shadow-lg shadow-black/20 overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <h3 className="text-lg font-extrabold text-white">
          My Tasks Today
        </h3>
      </div>
      <div className="p-6 space-y-4">
        {tasks.map((task, i) => (
          <div key={i} className="p-4 bg-white/5 ring-1 ring-white/10 rounded-lg">
            <p className="font-medium text-white">{task.title}</p>
            <div className="mt-2 flex gap-4 text-xs text-white/60">
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
    <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur-xl shadow-lg shadow-black/20 overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <h3 className="text-lg font-extrabold text-white">
          My Projects
        </h3>
      </div>
      <div className="p-6 space-y-4">
        {projects.map((p, i) => (
          <div key={i}>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white font-medium">{p.name}</span>
              <span className="text-white/60">{p.progress}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full ring-1 ring-white/20">
              <div
                className="h-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                style={{ width: `${p.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

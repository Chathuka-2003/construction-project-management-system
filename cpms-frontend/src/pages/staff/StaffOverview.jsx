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
import DashboardLayout from "../../components/common/DashboardLayout";

export default function StaffOverview() {
  const [currentDate] = useState(
    new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
  );
  const role = localStorage.getItem("role") || "staff";

  return (
    <DashboardLayout role={role}>
      <div className="flex-1 overflow-y-auto bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's your workspace.</p>
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

      {/* My Tasks Today */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaskList />
        <ProjectList />
      </div>
    </div>
    </DashboardLayout>
  );
}

function Card({ icon, title, value, color }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`p-3 bg-${color}-50 rounded-lg`}>{icon}</div>
        <div>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
      </div>
    </div>
  );
}

function TaskList() {
  const tasks = [
    { title: "Inspect concrete pour at Site A", time: "9:00 AM", priority: "High", location: "Site A" },
    { title: "Update project progress report", time: "11:30 AM", priority: "Medium", location: "Documentation" },
    { title: "Team meeting - Harbor Bridge", time: "2:00 PM", priority: "Medium", location: "Team Meeting" },
    { title: "Review material delivery schedule", time: "4:00 PM", priority: "Low", location: "Logistics" },
    { title: "Check safety compliance at Riverside Apartments", time: "5:30 PM", priority: "High", location: "Site B" },
    { title: "Coordinate subcontractor tasks", time: "6:00 PM", priority: "Medium", location: "Site C" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-800">My Tasks Today</h2>
        <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</a>
      </div>
      <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
        {tasks.map((task, idx) => (
          <div key={idx} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600 rounded" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 mb-2">{task.title}</p>
              <div className="flex items-center gap-3 flex-wrap text-xs text-gray-500">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {task.time}</span>
                <span className={`px-2 py-0.5 rounded-full font-medium ${
                  task.priority === 'High' ? 'bg-red-100 text-red-700' :
                  task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                }`}>{task.priority}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {task.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectList() {
  const projects = [
    { name: 'Downtown Office Complex', role: 'Site Manager', progress: 73, due: 'Feb 28, 2026', status: 'On Track', color: 'blue' },
    { name: 'Harbor Bridge Construction', role: 'Assistant Manager', progress: 45, due: 'Apr 15, 2026', status: 'Delayed', color: 'orange' },
    { name: 'Riverside Apartments', role: 'Safety Inspector', progress: 91, due: 'Jan 30, 2026', status: 'On Track', color: 'green' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-800">My Projects</h2>
        <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</a>
      </div>
      <div className="p-6 space-y-5">
        {projects.map((project, idx) => (
          <div key={idx} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-1">{project.name}</h3>
                <p className="text-xs text-gray-500">{project.role}</p>
              </div>
              <span className={`text-sm font-bold ${project.color === 'blue' ? 'text-blue-600' : project.color === 'orange' ? 'text-orange-600' : 'text-green-600'}`}>
                {project.progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div className={`h-2 rounded-full ${project.color === 'blue' ? 'bg-blue-600' : project.color === 'orange' ? 'bg-orange-500' : 'bg-green-600'}`} style={{ width: `${project.progress}%` }}></div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Due: {project.due}</span>
              <span className="flex items-center gap-1">
                {project.status === 'On Track' ? <CheckCircle className="w-3 h-3 text-green-600" /> : <AlertCircle className="w-3 h-3 text-orange-600" />}
                {project.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

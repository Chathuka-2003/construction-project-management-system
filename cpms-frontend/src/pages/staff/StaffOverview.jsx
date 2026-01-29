import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 min-h-screen p-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<FolderKanban />}
          title="My Active Projects"
          value="5"
          color="blue"
          onClick={() => navigate("/projects")}
        />
        <StatCard
          icon={<ClipboardList />}
          title="Pending Tasks"
          value="12"
          color="orange"
          onClick={() => navigate("/tasks")}
        />
        <StatCard
          icon={<Truck />}
          title="Assigned Vehicles"
          value="2"
          color="green"
          onClick={() => navigate("/vehicle")}
        />
        <StatCard
          icon={<Calendar />}
          title="Today's Appointments"
          value="3"
          color="purple"
          onClick={() => navigate("/appointments")}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaskList onViewAll={() => navigate("/tasks")} />
        <ProjectList onViewAll={() => navigate("/projects")} />
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <div className={`p-3 bg-${color}-50 rounded-lg text-${color}-600`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
      </div>
    </div>
  );
}

function TaskList({ onViewAll }) {
  const tasks = [
    { title: "Inspect concrete pour at Site A", time: "9:00 AM", priority: "High", location: "Site A" },
    { title: "Update project progress report", time: "11:30 AM", priority: "Medium", location: "Documentation" },
    { title: "Team meeting - Harbor Bridge", time: "2:00 PM", priority: "Medium", location: "Team Meeting" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-lg font-bold text-gray-800">My Tasks Today</h2>
        <button
          onClick={onViewAll}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View All
        </button>
      </div>

      <div className="p-6 space-y-4">
        {tasks.map((task, i) => (
          <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <input type="checkbox" className="mt-1" />
            <div className="flex-1">
              <p className="font-medium text-gray-800">{task.title}</p>
              <div className="flex gap-3 text-xs text-gray-500 mt-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {task.time}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {task.location}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full ${
                    task.priority === "High"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {task.priority}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectList({ onViewAll }) {
  const projects = [
    { name: "Downtown Office Complex", role: "Site Manager", progress: 73, status: "On Track" },
    { name: "Harbor Bridge Construction", role: "Assistant Manager", progress: 45, status: "Delayed" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-lg font-bold text-gray-800">My Projects</h2>
        <button
          onClick={onViewAll}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View All
        </button>
      </div>

      <div className="p-6 space-y-5">
        {projects.map((p, i) => (
          <div key={i} className="p-4 border rounded-lg">
            <div className="flex justify-between mb-2">
              <div>
                <h3 className="font-semibold text-gray-800">{p.name}</h3>
                <p className="text-xs text-gray-500">{p.role}</p>
              </div>
              <span className="font-bold text-blue-600">{p.progress}%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div className="h-2 bg-blue-600 rounded-full" style={{ width: `${p.progress}%` }} />
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-500">
              {p.status === "On Track" ? (
                <CheckCircle className="w-3 h-3 text-green-600" />
              ) : (
                <AlertCircle className="w-3 h-3 text-orange-600" />
              )}
              {p.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

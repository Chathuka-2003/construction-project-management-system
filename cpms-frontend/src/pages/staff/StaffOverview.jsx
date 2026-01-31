import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderKanban,
  ClipboardList,
  Calendar,
  Truck,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import StatCard from "../../components/common/StatCard.jsx";
import { useStore } from "../../components/store/AppStore.jsx";

export default function StaffOverview() {
  const navigate = useNavigate();
  const { data, todayISO } = useStore();

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // ✅ computed from store (real values)
  const stats = useMemo(() => {
    const projects = data.projects || [];
    const tasks = data.tasks || [];
    const appts = data.appointments || [];

    const today = todayISO();
    const todayTasks = tasks.filter((t) => t.dueDate === today);
    const pendingTasks = tasks.filter((t) => t.dueDate === "pending");
    const todaysAppointments = appts.filter((a) =>
      String(a.dateTime || "").startsWith(today)
    );

    return {
      activeProjectsCount: projects.length,
      todayTasksCount: todayTasks.length,
      pendingTasksCount: pendingTasks.length,
      todaysAppointmentsCount: todaysAppointments.length,
      todayTasks,
      projects,
    };
  }, [data.projects, data.tasks, data.appointments, todayISO]);

  // show small preview lists
  const previewTasks = stats.todayTasks.slice(0, 4);
  const previewProjects = stats.projects.slice(0, 3);

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 min-h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800">Overview</h1>
          <p className="text-gray-500 mt-1">
            Welcome back! Here’s your workspace.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Today</p>
          <p className="text-sm font-bold text-gray-800">{currentDate}</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={FolderKanban}
          title="My Active Projects"
          value={String(stats.activeProjectsCount)}
          color="blue"
          onClick={() => navigate("/projects")}
        />

        <StatCard
          icon={ClipboardList}
          title="Today’s Tasks"
          value={String(stats.todayTasksCount)}
          color="orange"
          onClick={() => navigate("/tasks")}
        />

        {/* Vehicles count is not in store yet, so keep it as "0" safely */}
        <StatCard
          icon={Truck}
          title="Assigned Vehicles"
          value={"0"}
          color="green"
          onClick={() => navigate("/vehicle")}
        />

        <StatCard
          icon={Calendar}
          title="Today’s Appointments"
          value={String(stats.todaysAppointmentsCount)}
          color="purple"
          onClick={() => navigate("/appointments")}
        />
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaskList tasks={previewTasks} onViewAll={() => navigate("/tasks")} />
        <ProjectList
          projects={previewProjects}
          onViewAll={() => navigate("/projects")}
        />
      </div>
    </div>
  );
}

function TaskList({ tasks, onViewAll }) {
  return (
    <div className="bg-white rounded-[14px] shadow-sm border border-[#eee] overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b">
        <h2 className="text-lg font-extrabold text-gray-800">My Tasks Today</h2>
        <button
          onClick={onViewAll}
          className="text-sm text-blue-600 hover:text-blue-700 font-bold"
          type="button"
        >
          View All
        </button>
      </div>

      <div className="p-5 space-y-3">
        {tasks.length === 0 ? (
          <div className="text-sm text-gray-400">No tasks due today.</div>
        ) : (
          tasks.map((t) => (
            <div
              key={t.id}
              className="flex items-start gap-3 p-4 bg-gray-50 rounded-[12px]"
            >
              <input type="checkbox" className="mt-1" />
              <div className="flex-1">
                <p className="font-bold text-gray-800">{t.name}</p>

                <div className="flex gap-3 text-xs text-gray-500 mt-2 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Due Today
                  </span>

                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {t.location || "—"}
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded-full font-bold ${
                      t.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : t.status === "Blocked"
                        ? "bg-red-100 text-red-700"
                        : t.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {t.status}
                  </span>
                </div>

                {t.assignedWorker ? (
                  <div className="text-xs text-gray-500 mt-2">
                    Assigned: <b>{t.assignedWorker}</b>
                    {t.role ? <span> ({t.role})</span> : null}
                  </div>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ProjectList({ projects, onViewAll }) {
  return (
    <div className="bg-white rounded-[14px] shadow-sm border border-[#eee] overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b">
        <h2 className="text-lg font-extrabold text-gray-800">My Projects</h2>
        <button
          onClick={onViewAll}
          className="text-sm text-blue-600 hover:text-blue-700 font-bold"
          type="button"
        >
          View All
        </button>
      </div>

      <div className="p-5 space-y-4">
        {projects.length === 0 ? (
          <div className="text-sm text-gray-400">No projects available.</div>
        ) : (
          projects.map((p) => (
            <div key={p.id} className="p-4 border rounded-[12px]">
              <div className="flex justify-between gap-3 mb-2">
                <div>
                  <h3 className="font-extrabold text-gray-800">{p.name}</h3>
                  <p className="text-xs text-gray-500">
                    {p.location || "—"} • {p.customer || "—"}
                  </p>
                </div>

                <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100">
                  {p.status || "—"}
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs text-gray-500">
                {p.status === "Construction" || p.status === "Finishing" ? (
                  <CheckCircle className="w-3 h-3 text-green-600" />
                ) : (
                  <AlertCircle className="w-3 h-3 text-orange-600" />
                )}
                {p.startDate ? `Start: ${p.startDate}` : "Start date not set"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

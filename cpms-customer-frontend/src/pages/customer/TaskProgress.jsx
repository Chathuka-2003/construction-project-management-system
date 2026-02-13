import { useEffect, useMemo, useState } from "react";
import { getProjectsByCustomer } from "../../api/projectApi";
import { getTasksByProject } from "../../api/taskApi";
import { getCustomerIdFromStorage } from "../../util/auth";

function todayLabel() {
  return new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function calcStats(tasks = []) {
  const total = tasks.length;
  const completed = tasks.filter((t) => Number(t.progress) >= 100).length;
  const inProgress = tasks.filter((t) => {
    const p = Number(t.progress);
    return p > 0 && p < 100;
  }).length;

  const overall =
    total === 0
      ? 0
      : Math.round(
          tasks.reduce((sum, t) => sum + clamp(Number(t.progress) || 0, 0, 100), 0) / total
        );

  return { total, completed, inProgress, overall };
}

export default function TaskProgress() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // projects list
  const [projects, setProjects] = useState([]);

  // tasksByProjectId: { [projectId]: TaskResponseDTO[] }
  const [tasksByProjectId, setTasksByProjectId] = useState({});

  useEffect(() => {
    let alive = true;

    async function loadAll() {
      try {
        setLoading(true);
        setErr("");

        const customerId = getCustomerIdFromStorage();
        if (!customerId) {
          throw new Error("Customer ID not found. Please login again.");
        }

        // 1) get customer projects
        const projList = await getProjectsByCustomer(customerId);
        if (!alive) return;

        const safeProjects = Array.isArray(projList) ? projList : [];
        setProjects(safeProjects);

        // 2) get tasks for each project (parallel)
        const results = await Promise.all(
          safeProjects.map(async (p) => {
            try {
              const tasks = await getTasksByProject(p.id);
              return [p.id, Array.isArray(tasks) ? tasks : []];
            } catch {
              return [p.id, []]; // if one project fails, don’t break page
            }
          })
        );

        if (!alive) return;

        const map = {};
        for (const [pid, tasks] of results) map[pid] = tasks;
        setTasksByProjectId(map);
      } catch (e) {
        if (!alive) return;
        setErr(
          e?.response?.data?.message ||
            e?.response?.data ||
            e?.message ||
            "Failed to load task progress"
        );
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadAll();
    return () => {
      alive = false;
    };
  }, []);

  // overall stats across ALL projects/tasks
  const overallStats = useMemo(() => {
    const allTasks = Object.values(tasksByProjectId).flat();
    return calcStats(allTasks);
  }, [tasksByProjectId]);

  return (
    <div className="flex min-h-screen bg-[#f4f1ec]">
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold">Task Progress</h1>
            <p className="text-sm text-gray-500">All Projects (Customer)</p>
          </div>
          <p className="text-sm text-gray-500">Date: {todayLabel()}</p>
        </div>

        {/* Errors */}
        {err && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {String(err)}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mb-6 rounded-xl bg-white p-4 text-sm text-gray-600">
            Loading projects and tasks...
          </div>
        )}

        {/* Top Stats (ALL projects) */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <StatCard label="Total Tasks" value={String(overallStats.total)} />
          <StatCard label="Completed" value={String(overallStats.completed)} valueClass="text-green-300" />
          <StatCard label="In progress" value={String(overallStats.inProgress)} valueClass="text-blue-300" />
          <StatCard label="Overall progress" value={`${overallStats.overall}%`} />
        </div>

        {/* Overall Progress */}
        <div className="bg-[#5c6572] text-white p-6 rounded-xl mb-10">
          <div className="flex justify-between mb-3">
            <h3 className="font-medium">Overall progress (All Projects)</h3>
            <span className="text-sm">{overallStats.overall}%</span>
          </div>
          <div className="w-full bg-[#394457] h-3 rounded-full">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
              style={{ width: `${overallStats.overall}%` }}
            />
          </div>
        </div>

        {/* Projects + Tasks */}
        {!loading && projects.length === 0 && !err && (
          <div className="rounded-xl bg-white p-4 text-sm text-gray-600">
            No projects found for this customer.
          </div>
        )}

        <div className="space-y-10">
          {projects.map((p) => {
            const tasks = tasksByProjectId[p.id] || [];
            const stats = calcStats(tasks);

            return (
              <div key={p.id} className="bg-white rounded-2xl shadow-sm p-6">
                {/* Project header */}
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{p.name}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {p.location || "-"} • {p.status || "-"} • Start: {p.startDate || "-"}
                    </p>
                    {p.description && (
                      <p className="text-sm text-gray-600 mt-3 max-w-4xl">{p.description}</p>
                    )}
                  </div>

                  {/* Project stats mini cards */}
                  <div className="grid grid-cols-2 gap-3 min-w-[260px]">
                    <MiniStat label="Tasks" value={stats.total} />
                    <MiniStat label="Completed" value={stats.completed} />
                    <MiniStat label="In Progress" value={stats.inProgress} />
                    <MiniStat label="Overall" value={`${stats.overall}%`} />
                  </div>
                </div>

                {/* Project overall bar */}
                <div className="mt-5 bg-[#5c6572] text-white p-4 rounded-xl">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Project task progress</span>
                    <span className="text-sm">{stats.overall}%</span>
                  </div>
                  <div className="w-full bg-[#394457] h-3 rounded-full">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                      style={{ width: `${stats.overall}%` }}
                    />
                  </div>
                </div>

                {/* Tasks */}
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Tasks</h3>

                  {tasks.length === 0 ? (
                    <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                      No tasks found for this project.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-6">
                      {tasks.map((t) => (
                        <TaskCard
                          key={t.id}
                          title={t.title || "Untitled Task"}
                          percent={clamp(Number(t.progress) || 0, 0, 100)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, valueClass = "" }) {
  return (
    <div className="bg-[#5c6572] text-white p-5 rounded-xl">
      <p className="text-sm text-gray-300">{label}</p>
      <h2 className={`text-2xl font-bold ${valueClass}`}>{value}</h2>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-bold text-gray-900">{value}</p>
    </div>
  );
}

function TaskCard({ title, percent }) {
  const barClass =
    percent >= 100
      ? "bg-green-400"
      : percent >= 60
      ? "bg-yellow-400"
      : percent > 0
      ? "bg-orange-400"
      : "bg-gray-500";

  return (
    <div className="bg-[#5c6572] text-white p-6 rounded-xl">
      <div className="flex justify-between mb-3">
        <h4 className="font-medium">{title}</h4>
        <span className="text-sm text-gray-300">{percent}%</span>
      </div>

      <div className="w-full bg-[#394457] h-3 rounded-full">
        <div className={`h-3 rounded-full ${barClass}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

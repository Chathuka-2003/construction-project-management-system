import { useNavigate } from "react-router-dom";

export default function StaffDashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "staff";

  const cards = [
    { title: "Assigned Projects", sub: "Active projects", value: "2", border: "border-l-orange-500", go: role === "admin" ? "/admin/projects" : "/staff/projects" },
    { title: "Today's Tasks", sub: "Due today", value: "1", border: "border-l-emerald-500", go: "/staff/tasks" },
    { title: "Pending Tasks", sub: "Not completed", value: "1", border: "border-l-red-500", go: "/staff/tasks" },
    { title: "Appointments", sub: "Upcoming", value: "2", border: "border-l-blue-500", go: "/staff/appointments" },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
      <p className="mt-1 text-sm text-slate-500">Welcome back! Here's your daily overview</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <button
            key={c.title}
            onClick={() => navigate(c.go)}
            className={[
              "text-left rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md hover:ring-slate-300",
              "border-l-4",
              c.border,
            ].join(" ")}
          >
            <p className="text-sm font-semibold text-slate-900">{c.title}</p>
            <p className="mt-1 text-xs text-slate-500">{c.sub}</p>
            <p className="mt-4 text-3xl font-extrabold text-slate-900">{c.value}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import "..app.css";

export default function StaffDashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Staff Dashboard</h2>
      <p style={{ color: "#6f6f6f" }}>
        Welcome back! Here's your daily overview
      </p>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="col-3">
          <div
            className="card clickable"
            onClick={() => navigate("/projects")}
            style={{ borderLeftColor: "#d28b5c" }}
          >
            <p className="card-title">Assigned Projects</p>
            <p className="card-sub">Active projects</p>
            <div className="big">2</div>
          </div>
        </div>

        <div className="col-3">
          <div
            className="card clickable"
            onClick={() => navigate("/tasks")}
            style={{ borderLeftColor: "#27ae60" }}
          >
            <p className="card-title">Today's Tasks</p>
            <p className="card-sub">Due today</p>
            <div className="big">1</div>
          </div>
        </div>

        <div className="col-3">
          <div
            className="card clickable"
            onClick={() => navigate("/tasks")}
            style={{ borderLeftColor: "#c0392b" }}
          >
            <p className="card-title">Pending Tasks</p>
            <p className="card-sub">Not completed</p>
            <div className="big">1</div>
          </div>
        </div>

        <div className="col-3">
          <div
            className="card clickable"
            onClick={() => navigate("/appointments")}
            style={{ borderLeftColor: "#2e86de" }}
          >
            <p className="card-title">Appointments</p>
            <p className="card-sub">Upcoming</p>
            <div className="big">2</div>
          </div>
        </div>
      </div>
    </div>
  );
}
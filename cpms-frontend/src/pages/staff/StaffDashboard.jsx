
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
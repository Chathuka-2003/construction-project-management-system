import { useNavigate } from "react-router-dom";

export default function StaffDashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="text-[22px] font-extrabold">Staff Dashboard</h2>
      <p className="text-[#6f6f6f] text-[13px] mt-1">
        Welcome back! Here&apos;s your daily overview
      </p>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {/* Assigned Projects */}
        <div
          onClick={() => navigate("/projects")}
          className="bg-white rounded-[14px] shadow-[0_10px_22px_rgba(0,0,0,.10)] p-4 cursor-pointer border-l-[8px] border-l-[#d28b5c] hover:-translate-y-[2px] transition"
        >
          <p className="font-extrabold text-[16px]">Assigned Projects</p>
          <p className="text-[#6f6f6f] text-[13px]">Active projects</p>
          <div className="text-[34px] font-black mt-2">2</div>
        </div>

        {/* Today's Tasks */}
        <div
          onClick={() => navigate("/tasks")}
          className="bg-white rounded-[14px] shadow-[0_10px_22px_rgba(0,0,0,.10)] p-4 cursor-pointer border-l-[8px] border-l-[#27ae60] hover:-translate-y-[2px] transition"
        >
          <p className="font-extrabold text-[16px]">Today&apos;s Tasks</p>
          <p className="text-[#6f6f6f] text-[13px]">Due today</p>
          <div className="text-[34px] font-black mt-2">1</div>
        </div>

        {/* Pending Tasks */}
        <div
          onClick={() => navigate("/tasks")}
          className="bg-white rounded-[14px] shadow-[0_10px_22px_rgba(0,0,0,.10)] p-4 cursor-pointer border-l-[8px] border-l-[#c0392b] hover:-translate-y-[2px] transition"
        >
          <p className="font-extrabold text-[16px]">Pending Tasks</p>
          <p className="text-[#6f6f6f] text-[13px]">Not completed</p>
          <div className="text-[34px] font-black mt-2">1</div>
        </div>

        {/* Appointments */}
        <div
          onClick={() => navigate("/appointments")}
          className="bg-white rounded-[14px] shadow-[0_10px_22px_rgba(0,0,0,.10)] p-4 cursor-pointer border-l-[8px] border-l-[#2e86de] hover:-translate-y-[2px] transition"
        >
          <p className="font-extrabold text-[16px]">Appointments</p>
          <p className="text-[#6f6f6f] text-[13px]">Upcoming</p>
          <div className="text-[34px] font-black mt-2">2</div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Appointments = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    project: "",
    location: "",
    worker: "",
    startDate: "",
    endDate: "",
    purpose: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (
      !form.project ||
      !form.location ||
      !form.worker ||
      !form.startDate ||
      !form.endDate ||
      !form.purpose
    ) {
      toast.error("Please fill all fields");
      return;
    }

    toast.success("Appointment booked successfully!");
    setForm({
      project: "",
      location: "",
      worker: "",
      startDate: "",
      endDate: "",
      purpose: "",
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      {/* ================= LEFT SIDE ================= */}
      <div className="space-y-6">
        {/* BOOK APPOINTMENT */}
        <div className="bg-[#7b736d] rounded-xl p-6 text-white">
          <h2 className="mb-4 text-lg font-semibold">Book Appointment</h2>

          <div className="space-y-3 text-sm">
            <select
              name="project"
              value={form.project}
              onChange={handleChange}
              className="w-full bg-[#6b625b] rounded px-3 py-2"
            >
              <option value="">Choose project</option>
              <option>Green Villa Project</option>
              <option>Modern Office Complex</option>
            </select>

            <select
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full bg-[#6b625b] rounded px-3 py-2"
            >
              <option value="">Select location</option>
              <option>Colombo 07</option>
              <option>Colombo 03</option>
            </select>

            <select
              name="worker"
              value={form.worker}
              onChange={handleChange}
              className="w-full bg-[#6b625b] rounded px-3 py-2"
            >
              <option value="">Choose worker</option>
              <option>John Anderson</option>
              <option>Sarah Williams</option>
              <option>Michael Chen</option>
            </select>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className="bg-[#6b625b] rounded px-3 py-2"
              />
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className="bg-[#6b625b] rounded px-3 py-2"
              />
            </div>

            <input
              name="purpose"
              value={form.purpose}
              onChange={handleChange}
              placeholder="Enter purpose of appointment"
              className="w-full bg-[#6b625b] rounded px-3 py-2"
            />

            <button
              onClick={handleSubmit}
              className="w-full py-2 text-sm bg-orange-500 rounded hover:bg-orange-600"
            >
              Submit
            </button>
          </div>
        </div>

        {/* HISTORY */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-[#3b342f]">History</h3>

          <div className="space-y-3">
            <HistoryCard
              title="Green Villa Project"
              person="John Anderson"
              date="12/15/2024 - 12/20/2024"
              purpose="Foundation inspection"
              status="Completed"
              color="green"
            />

            <HistoryCard
              title="Modern Office Complex"
              person="Sarah Williams"
              date="12/22/2024 - 12/28/2024"
              purpose="Electrical work review"
              status="Pending"
              color="yellow"
            />

            <HistoryCard
              title="Green Villa Project"
              person="Michael Chen"
              date="1/3/2025 - 1/5/2025"
              purpose="Plumbing inspection"
              status="Cancelled"
              color="red"
            />
          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="space-y-6">
        {/* ONGOING PROJECT */}
        <div className="bg-[#7b736d] rounded-xl p-6 text-white">
          <h2 className="mb-4 text-lg font-semibold">My Ongoing Projects</h2>

          <div className="space-y-3 text-sm">
            <Field label="Project Title" value="Green Villa Project" />
            <Field label="Status" value="In Progress" />
            <Field label="Manager" value="John Anderson" />

            <div>
              <p className="mb-1 text-xs">Progress</p>
              <div className="w-full h-2 rounded-full bg-black/20">
                <div className="bg-orange-500 h-2 rounded-full w-[65%]" />
              </div>
              <p className="mt-1 text-xs">65%</p>
            </div>

            {/* ✅ OPEN CHAT BUTTON */}
            <button
              onClick={() => navigate("/customer/messages")}
              className="w-full py-2 text-sm bg-orange-500 rounded hover:bg-orange-600"
            >
              Open Chat
            </button>
          </div>
        </div>

        {/* CONFIRMED PROJECTS */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-[#3b342f]">
            Confirmed Projects
          </h3>

          <ConfirmedCard
            title="Green Villa Project"
            location="123 Green Avenue, Colombo 07"
            manager="John Anderson"
            next="1/10/2025"
          />

          <ConfirmedCard
            title="Modern Office Complex"
            location="45 Business Park, Colombo 03"
            manager="Sarah Williams"
            next="1/15/2025"
          />
        </div>
      </div>
    </div>
  );
};

/* ===== SMALL COMPONENTS ===== */

const Field = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-300">{label}</p>
    <div className="bg-[#6b625b] px-3 py-2 rounded">{value}</div>
  </div>
);

const HistoryCard = ({ title, person, date, purpose, status, color }) => (
  <div className="bg-[#7b736d] p-4 rounded text-white text-sm">
    <div className="flex justify-between">
      <h4 className="font-semibold">{title}</h4>
      <span className={`text-${color}-400 text-xs`}>{status}</span>
    </div>
    <p>👤 {person}</p>
    <p>📅 {date}</p>
    <p className="text-orange-300">Purpose: {purpose}</p>
  </div>
);

const ConfirmedCard = ({ title, location, manager, next }) => (
  <div className="bg-[#7b736d] p-4 rounded text-white text-sm mb-3">
    <h4 className="font-semibold">{title}</h4>
    <p>📍 {location}</p>
    <p>👤 {manager}</p>
    <p>⏰ Next: {next}</p>
  </div>
);

export default Appointments;

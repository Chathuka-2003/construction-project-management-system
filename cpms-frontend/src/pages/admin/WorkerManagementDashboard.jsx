import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import SectionWrapper from "../../components/cards/SectionWrapper";
import SummaryCard from "../../components/cards/SummaryCard";

export default function WorkerManagementDashboard() {
  const navigate = useNavigate();

  /* =======================
     ROLE CONTROL
  ======================= */
  const role = localStorage.getItem("role") || "staff";
  const isAdmin = role.toLowerCase() === "admin";

  /* =======================
     TAB STATE
  ======================= */
  const [activeTab, setActiveTab] = useState("workers");

  /* =======================
     FILTER STATES
  ======================= */
  const [searchWorker, setSearchWorker] = useState("");
  const [selectedProject, setSelectedProject] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [searchUser, setSearchUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");

  /* =======================
     MODAL STATES
  ======================= */
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showViewWorkerModal, setShowViewWorkerModal] = useState(false);
  const [showAssignWorkerModal, setShowAssignWorkerModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewUserModal, setShowViewUserModal] = useState(false);

  /* =======================
     DATA STATES
  ======================= */
  const [users, setUsers] = useState([]);
  const [workers, setWorkers] = useState([]);

  /* =======================
     INITIAL DATA
  ======================= */
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [
      {
        name: "Admin User",
        role: "Admin",
        department: "System Admin",
        email: "admin@company.com",
        projects: ["All Projects"],
      },
      {
        name: "Manager User",
        role: "Manager",
        department: "Operations",
        email: "manager@company.com",
        projects: ["Building A", "Road Project"],
      },
      {
        name: "HR Staff",
        role: "HR",
        department: "Human Resources",
        email: "hr@company.com",
        projects: [],
      },
    ];

    const storedWorkers = JSON.parse(localStorage.getItem("workers")) || [
      { name: "Kasun Perera", role: "Engineer", project: "Building A", status: "Active" },
      { name: "Nimal Silva", role: "Supervisor", project: "Road Project", status: "On Leave" },
      { name: "Saman Kumara", role: "Technician", project: "Bridge Construction", status: "Inactive" },
      { name: "Dilshan Fernando", role: "Labour", project: "Shopping Mall", status: "Active" },
    ];

    setUsers(storedUsers);
    setWorkers(storedWorkers);

    localStorage.setItem("users", JSON.stringify(storedUsers));
    localStorage.setItem("workers", JSON.stringify(storedWorkers));
  }, []);

  /* =======================
     STATS
  ======================= */
  const workerStats = [
    { title: "Total Workers", value: workers.length },
    { title: "Active Workers", value: workers.filter(w => w.status === "Active").length },
    { title: "Projects", value: new Set(workers.map(w => w.project)).size },
    { title: "Completion Rate", value: "92%" },
  ];

  /* =======================
     FILTER LOGIC
  ======================= */
  const filteredUsers = users.filter(user => {
    return (
      user.name.toLowerCase().includes(searchUser.toLowerCase()) &&
      (selectedRole === "All" || user.role === selectedRole)
    );
  });

  const projectOptions = ["All", ...new Set(workers.map(w => w.project))];

  const filteredWorkers = workers.filter(worker => {
    return (
      worker.name.toLowerCase().includes(searchWorker.toLowerCase()) &&
      (selectedProject === "All" || worker.project === selectedProject) &&
      (selectedStatus === "All" || worker.status === selectedStatus)
    );
  });

  /* =======================
     RENDER
  ======================= */
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">User Management Dashboard</h1>

      {/* ===== STATS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {workerStats.map((stat, i) => (
          <SummaryCard key={i} label={stat.title} value={stat.value} />
        ))}
      </div>

      <SectionWrapper
        icon="👥"
        title="Manage Users"
        description="View and manage system users and workers."
      >
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-1.5 rounded-md text-sm ${
                activeTab === "users"
                  ? "bg-amber-700 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab("workers")}
              className={`px-4 py-1.5 rounded-md text-sm ${
                activeTab === "workers"
                  ? "bg-amber-700 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Workers
            </button>
          </div>

          {/* ADMIN ONLY */}
          {isAdmin && (
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/adduser")}
                className="bg-amber-700 text-white px-4 py-2 rounded-md text-sm"
              >
                + Add New User
              </button>
              <button
                onClick={() => navigate("/addworker")}
                className="bg-amber-700 text-white px-4 py-2 rounded-md text-sm"
              >
                + Add New Worker
              </button>
            </div>
          )}
        </div>

        {/* ===== FILTERS ===== */}
        {activeTab === "users" && (
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                placeholder="Search user name..."
                value={searchUser}
                onChange={e => setSearchUser(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-md text-sm"
              />
            </div>
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option>All</option>
              <option>Admin</option>
              <option>Manager</option>
              <option>Project Coordinator</option>
              <option>HR</option>
            </select>
          </div>
        )}

        {activeTab === "workers" && (
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                placeholder="Search worker name..."
                value={searchWorker}
                onChange={e => setSearchWorker(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-md text-sm"
              />
            </div>
            <select
              value={selectedProject}
              onChange={e => setSelectedProject(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              {projectOptions.map((p, i) => (
                <option key={i}>{p}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option>All</option>
              <option>Active</option>
              <option>On Leave</option>
              <option>Inactive</option>
            </select>
          </div>
        )}
      </SectionWrapper>

      {/* USERS TABLE */}
      {activeTab === "users" && (
        <div className="bg-white rounded-xl shadow-sm border mt-6">
          {filteredUsers.map((u, i) => (
            <div key={i} className="flex justify-between px-6 py-4 border-t text-sm">
              <span>{u.name}</span>
              <span>{u.role}</span>
              <button
                onClick={() => {
                  setSelectedUser(u);
                  setShowViewUserModal(true);
                }}
                className="text-amber-700 font-medium"
              >
                View
              </button>
            </div>
          ))}
        </div>
      )}

      {/* WORKERS TABLE */}
      {activeTab === "workers" && (
        <div className="bg-white rounded-xl shadow-sm border mt-6">
          {filteredWorkers.map((w, i) => (
            <div key={i} className="flex justify-between px-6 py-4 border-t text-sm">
              <span>{w.name}</span>
              <span>{w.role}</span>
              <span>{w.project}</span>
              <span>{w.status}</span>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedWorker(w);
                    setShowViewWorkerModal(true);
                  }}
                  className="text-amber-700"
                >
                  View
                </button>

                {isAdmin && (
                  <button
                    onClick={() => {
                      setSelectedWorker(w);
                      setShowAssignWorkerModal(true);
                    }}
                    className="text-amber-700"
                  >
                    Assign
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

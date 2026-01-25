import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/common/DashboardLayout";
import SectionWrapper from "../../components/cards/SectionWrapper";
import SummaryCard from "../../components/cards/SummaryCard";

export default function WorkerManagementDashboard() {
  const navigate = useNavigate();

  // ===== TAB STATE =====
  const [activeTab, setActiveTab] = useState("workers");

  // ===== WORKER FILTER STATES =====
  const [searchWorker, setSearchWorker] = useState("");
  const [selectedProject, setSelectedProject] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // ===== USER FILTER STATES =====
  const [searchUser, setSearchUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");

  // ===== MODAL STATES =====
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showViewWorkerModal, setShowViewWorkerModal] = useState(false);
  const [showAssignWorkerModal, setShowAssignWorkerModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewUserModal, setShowViewUserModal] = useState(false);

  // ===== DATA STATES =====
  const [users, setUsers] = useState([]);
  const [topWorkers, setTopWorkers] = useState([]);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [
      { name: "Admin User", role: "Admin", department: "System Admin", email: "admin@company.com", projects: ["All Projects"] },
      { name: "Manager User", role: "Manager", department: "Operations", email: "manager@company.com", projects: ["Building A", "Road Project"] },
      { name: "HR Staff", role: "HR", department: "Human Resources", email: "hr@company.com", projects: [] },
    ];

    const storedWorkers = JSON.parse(localStorage.getItem("workers")) || [
      { name: "Kasun Perera", role: "Engineer", project: "Building A", status: "Active" },
      { name: "Nimal Silva", role: "Supervisor", project: "Road Project", status: "On Leave" },
      { name: "Saman Kumara", role: "Technician", project: "Bridge Construction", status: "Inactive" },
      { name: "Dilshan Fernando", role: "Labour", project: "Shopping Mall", status: "Active" },
    ];

    setUsers(storedUsers);
    setTopWorkers(storedWorkers);

    localStorage.setItem("users", JSON.stringify(storedUsers));
    localStorage.setItem("workers", JSON.stringify(storedWorkers));
  }, []);

  const workerStats = [
    { title: "Total Workers", value: topWorkers.length },
    { title: "Active Workers", value: topWorkers.filter(w => w.status === "Active").length },
    { title: "Projects", value: new Set(topWorkers.map(w => w.project)).size },
    { title: "Completion Rate", value: "92%" },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchUser.toLowerCase());
    const matchesRole = selectedRole === "All" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const projectOptions = ["All", ...new Set(topWorkers.map(w => w.project))];

  const filteredWorkers = topWorkers.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(searchWorker.toLowerCase());
    const matchesProject = selectedProject === "All" || worker.project === selectedProject;
    const matchesStatus = selectedStatus === "All" || worker.status === selectedStatus;
    return matchesSearch && matchesProject && matchesStatus;
  });

  return (
    <DashboardLayout role="admin">
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-6">User Management Dashboard</h1>

        {/* ===== STATS ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {workerStats.map((stat, i) => (
            <SummaryCard key={i} label={stat.title} value={stat.value} />
          ))}
        </div>

        {/* ===== USERS & WORKERS CARD ===== */}
        <SectionWrapper icon="👥" title="Manage Users" description="View and manage system users and workers.">
          <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("users")}
                className={`px-4 py-1.5 rounded-md text-sm ${activeTab === "users" ? "bg-amber-700 text-white" : "bg-gray-100 text-gray-700"}`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab("workers")}
                className={`px-4 py-1.5 rounded-md text-sm ${activeTab === "workers" ? "bg-amber-700 text-white" : "bg-gray-100 text-gray-700"}`}
              >
                Workers
              </button>
            </div>

            {/* Add Buttons */}
            <div className="flex gap-3">
              <button onClick={() => navigate("/adduser")} className="bg-amber-700 text-white px-4 py-2 rounded-md text-sm">
                + Add New User
              </button>
              <button onClick={() => navigate("/addworker")} className="bg-amber-700 text-white px-4 py-2 rounded-md text-sm">
                + Add New Worker
              </button>
            </div>
          </div>

          {/* FILTER ROW */}
          {activeTab === "users" && (
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-50">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search user name..."
                  value={searchUser}
                  onChange={e => setSearchUser(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-md text-sm"
                />
              </div>
              <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)} className="border rounded-md px-3 py-2 text-sm">
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
              <div className="relative flex-1 min-w-50">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search worker name..."
                  value={searchWorker}
                  onChange={e => setSearchWorker(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-md text-sm"
                />
              </div>
              <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="border rounded-md px-3 py-2 text-sm">
                {projectOptions.map((project, idx) => <option key={idx}>{project}</option>)}
              </select>
              <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className="border rounded-md px-3 py-2 text-sm">
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6">
            <div className="grid grid-cols-3 text-sm font-semibold text-gray-500 bg-gray-50 px-6 py-3">
              <span>User Name</span>
              <span>Role</span>
              <span>Action</span>
            </div>
            {filteredUsers.map((user, index) => (
              <div key={index} className="grid grid-cols-3 items-center text-sm text-gray-700 px-6 py-4 border-t">
                <span className="font-medium">{user.name}</span>
                <span>{user.role}</span>
                <button
                  onClick={() => { setSelectedUser(user); setShowViewUserModal(true); }}
                  className="text-amber-700 text-xs font-medium hover:underline"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        )}

        {/* WORKERS TABLE */}
        {activeTab === "workers" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6">
            <div className="grid grid-cols-5 text-sm font-semibold text-gray-500 bg-gray-50 px-6 py-3">
              <span>Worker</span>
              <span>Role</span>
              <span>Project</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            {filteredWorkers.map((worker, index) => (
              <div key={index} className="grid grid-cols-5 items-center text-sm px-6 py-4 border-t">
                <span className="font-medium">{worker.name}</span>
                <span>{worker.role}</span>
                <span>{worker.project}</span>
                <span className={`px-2 py-1 rounded-full text-xs w-fit
                  ${worker.status === "Active" ? "bg-green-100 text-green-700" :
                    worker.status === "On Leave" ? "bg-amber-100 text-amber-700" :
                    "bg-gray-200 text-gray-600"}`}
                >
                  {worker.status}
                </span>
                <div className="flex gap-3">
                  <button onClick={() => { setSelectedWorker(worker); setShowViewWorkerModal(true); }} className="text-amber-700 text-xs font-medium hover:underline">
                    View
                  </button>
                  <button onClick={() => { setSelectedWorker(worker); setShowAssignWorkerModal(true); }} className="text-amber-700 text-xs font-medium hover:underline">
                    Assign
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODALS */}
        {showViewUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
              <h2 className="text-lg font-semibold mb-4">{selectedUser.name}</h2>
              <div className="space-y-2 text-sm">
                <p><b>Role:</b> {selectedUser.role}</p>
                <p><b>Department:</b> {selectedUser.department}</p>
                <p><b>Email:</b> {selectedUser.email}</p>
                <p><b>Projects:</b> {selectedUser.projects.length > 0 ? selectedUser.projects.join(", ") : "None"}</p>
              </div>
              <div className="text-right mt-4">
                <button onClick={() => setShowViewUserModal(false)} className="px-4 py-2 bg-gray-200 rounded">Close</button>
              </div>
            </div>
          </div>
        )}

        {showViewWorkerModal && selectedWorker && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
              <h2 className="text-lg font-semibold mb-4">{selectedWorker.name}</h2>
              <div className="space-y-2 text-sm">
                <p><b>Role:</b> {selectedWorker.role}</p>
                <p><b>Project:</b> {selectedWorker.project}</p>
                <p><b>Status:</b> {selectedWorker.status}</p>
              </div>
              <div className="text-right mt-4">
                <button onClick={() => setShowViewWorkerModal(false)} className="px-4 py-2 bg-gray-200 rounded">Close</button>
              </div>
            </div>
          </div>
        )}

        {showAssignWorkerModal && selectedWorker && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Assign {selectedWorker.name}</h2>
              <form className="space-y-3">
                <input disabled value={selectedWorker.name} className="w-full border rounded px-3 py-2 bg-gray-100" />
                <input placeholder="Project Name" className="w-full border rounded px-3 py-2" />
                <select className="w-full border rounded px-3 py-2">
                  <option>Select Role</option>
                  <option>Engineer</option>
                  <option>Supervisor</option>
                  <option>Technician</option>
                  <option>Labour</option>
                </select>
                <div className="flex justify-end gap-3 pt-3">
                  <button type="button" onClick={() => setShowAssignWorkerModal(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-amber-700 text-white rounded">Assign</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

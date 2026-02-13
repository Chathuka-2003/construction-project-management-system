// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Unauthorized from "./pages/auth/Unauthorized";

import ProtectedRoute from "./routes/ProtectedRoute";

import AdminLayout from "./layouts/AdminLayout";
import StaffLayout from "./layouts/StaffLayout";

import AdminOverview from "./pages/admin/AdminOverview";
import StaffOverview from "./pages/staff/StaffOverview";
import PaymentsDashboard from "./pages/payments/PaymentsDashboard";
import AdminProfile from "./pages/admin/AdminProfile";
import StaffProfile from "./pages/staff/StaffProfile";

import AssignedProjects from "./pages/staff/AssignedProjects";
import StaffDashboard from "./pages/staff/StaffDashboard";
import TaskManagement from "./pages/staff/TaskManagement";
import StaffAppointments from "./pages/staff/StaffAppointments.jsx";
import Messages from "./pages/staff/Messages";

import AddUserform from "./pages/forms/AddUserform";
import AddWorkerform from "./pages/forms/AddWorkerform";

import VehicleDashboard from "./pages/vehicle/VehicleDashboard";
import VehicleAssignment from "./pages/vehicle/VehicleAssignments";
import ManageVehicles from "./pages/vehicle/ManageVehicles";

import AllocationDashboard from "./pages/allocation/AllocationDashboard";
import WorkerManagementDashboard from "./pages/admin/WorkerManagementDashboard";

import NewProjectModal from "./pages/model/NewProjectModal";
import NewTaskModal from "./pages/model/NewTaskModal";
import RegisterUser from "./pages/admin/RegisterUser";

// Optional (only if you really use these components globally)
// import Navbar from "./components/common/Navbar.jsx";
// import Footer from "./components/common/Footer.jsx";
// import "./app.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<AdminOverview />} />
            <Route path="payment" element={<PaymentsDashboard />} />
            <Route path="profile" element={<AdminProfile />} />

            {/* Admin using staff-like pages (if you want them accessible for admin too) */}
            <Route path="projects" element={<AssignedProjects />} />
            <Route path="dashboard" element={<StaffDashboard />} />
            <Route path="tasks" element={<TaskManagement />} />
            <Route path="appointments" element={<StaffAppointments />} />
            <Route path="messages" element={<Messages />} />

            {/* Vehicle */}
            <Route path="vehicle" element={<VehicleDashboard />} />
            <Route path="vehicle/assignment" element={<VehicleAssignment />} />
            <Route path="manage" element={<ManageVehicles />} />

            {/* Allocation + Workers */}
            <Route path="allocation" element={<AllocationDashboard />} />
            <Route path="workers" element={<WorkerManagementDashboard />} />

            {/* Forms */}
            <Route path="add-worker" element={<AddWorkerform />} />
            <Route path="add-user" element={<AddUserform />} />

            {/* Modals / Admin Actions */}
            <Route path="newprojects" element={<NewProjectModal />} />
            <Route path="newtask" element={<NewTaskModal />} />
            <Route path="register" element={<RegisterUser />} />
          </Route>
        </Route>

        {/* Staff Routes */}
        <Route element={<ProtectedRoute allowedRole="staff" />}>
          <Route path="/staff" element={<StaffLayout />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<StaffOverview />} />
            <Route path="payment" element={<PaymentsDashboard />} />

            <Route path="projects" element={<AssignedProjects />} />
            <Route path="dashboard" element={<StaffDashboard />} />
            <Route path="tasks" element={<TaskManagement />} />
            <Route path="appointments" element={<StaffAppointments />} />
            <Route path="messages" element={<Messages />} />

            <Route path="vehicle" element={<VehicleDashboard />} />
            <Route path="vehicle/assignment" element={<VehicleAssignment />} />

            <Route path="allocation" element={<AllocationDashboard />} />
            <Route path="profile" element={<StaffProfile />} />

            <Route path="add-worker" element={<AddWorkerform />} />
            <Route path="add-user" element={<AddUserform />} />
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

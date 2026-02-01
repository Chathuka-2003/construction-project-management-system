import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import AddUserform from "./pages/forms/AddUserform";
import AddWorkerform from "./pages/forms/AddWorkerform";

import Login from "./pages/auth/Login";
import Unauthorized from "./pages/auth/Unauthorized";

import AdminOverview from "./pages/admin/AdminOverview";
import StaffOverview from "./pages/staff/StaffOverview";
import PaymentsDashboard from "./pages/payments/PaymentsDashboard";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminLayout from "./layouts/AdminLayout";
import StaffLayout from "./layouts/StaffLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

import AssignedProjects from "./pages/staff/AssignedProjects";
import StaffDashboard from "./pages/staff/StaffDashboard";
import TaskManagement from "./pages/staff/TaskManagement";
import StaffAppointments from "./pages/staff/StaffAppointment";
import Messages from "./pages/staff/Messages";
import StaffProfile from "./pages/staff/StaffProfile";

import VehicleDashboard from "./pages/vehicle/VehicleDashboard";
import VehicleAssignment from "./pages/vehicle/VehicleAssignments";
import ManageVehicles from "./pages/vehicle/ManageVehicles";

import AllocationDashboard from "./pages/allocation/AllocationDashboard";
import WorkerManagementDashboard from "./pages/admin/WorkerManagementDashboard";
import NewProjectModal from "./pages/model/NewProjectModal";
import NewTaskModal from "./pages/model/NewTaskModal";
import RegisterUser from "./pages/admin/RegisterUser";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="overview" replace />} /> {/* /admin -> /admin/overview */}
            <Route path="overview" element={<AdminOverview />} />        {/* relative */}
            <Route path="payment" element={<PaymentsDashboard />} />     {/* relative */}
            <Route path="profile" element={<AdminProfile />} />          {/* relative */}
            <Route path="projects" element={<AssignedProjects />} />      {/* relative */}
            <Route path="dashboard" element={<StaffDashboard />} />        {/* relative */}
            <Route path="tasks" element={<TaskManagement />} />        {/* relative */}
            <Route path="appointments" element={<StaffAppointments />} />        {/* relative */}
            <Route path="messages" element={<Messages />} />        {/* relative */}
            <Route path="vehicle" element={<VehicleDashboard />} />        {/* relative */}
            <Route path="vehicle/assignment" element={<VehicleAssignment />} />        {/* relative */}
            <Route path="manage" element={<ManageVehicles />} />        {/* relative */}
            <Route path="allocation" element={<AllocationDashboard />} />        {/* relative */}
            <Route path="workers" element={<WorkerManagementDashboard />} />        {/* relative */}
            <Route path="add-worker" element={<AddWorkerform />} />        {/* relative */}
            <Route path="add-user" element={<AddUserform />} />        {/* relative */}
            <Route path="newprojects" element={<NewProjectModal />} />        {/* relative */}
            <Route path="newtask" element={<NewTaskModal />} />        {/* relative */}
            <Route path="register" element={<RegisterUser />} />        {/* relative */}
          </Route>
        </Route>

        {/* Staff Routes */}
        <Route element={<ProtectedRoute allowedRole="staff" />}>
          <Route path="/staff" element={<StaffLayout />}>
            <Route index element={<Navigate to="overview" replace />} /> {/* /staff -> /staff/overview */}
            <Route path="overview" element={<StaffOverview />} />        {/* relative */}
            <Route path="payment" element={<PaymentsDashboard />} />     {/* relative */}
            <Route path="projects" element={<AssignedProjects />} />      {/* relative */}
            <Route path="dashboard" element={<StaffDashboard />} />        {/* relative */}
            <Route path="tasks" element={<TaskManagement />} />        {/* relative */}
            <Route path="appointments" element={<StaffAppointments />} />        {/* relative */}
            <Route path="messages" element={<Messages />} />        {/* relative */}
            <Route path="vehicle" element={<VehicleDashboard />} />        {/* relative */}
            <Route path="vehicle/assignment" element={<VehicleAssignment />} />        {/* relative */}
            <Route path="allocation" element={<AllocationDashboard />} />        {/* relative */}
            <Route path="profile" element={<StaffProfile />} />          {/* relative */}
            <Route path="add-worker" element={<AddWorkerform />} />        {/* relative */}
            <Route path="add-user" element={<AddUserform />} />        {/* relative */}



          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

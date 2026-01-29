// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Auth
import CMSLoginForm from "./pages/auth/Login.jsx";

// Admin / Other dashboards
import AdminOverview from "./pages/admin/AdminOverview.jsx";
import PaymentsDashboard from "./pages/payments/PaymentsDashboard.jsx";
import AddUserform from "./pages/forms/AddUserform.jsx";
import AddWorkerform from "./pages/forms/AddWorkerForm.jsx";
import AdminProfile from "./pages/admin/AdminProfile.jsx";
import AllocationDashboard from "./pages/allocation/AllocationDashboard.jsx";
import WorkerManagementDashboard from "./pages/admin/WorkerManagementDashboard.jsx";
import VehicleDashboard from "./pages/vehicle/VehicleDashboard.jsx";
import VehicleAssignment from "./pages/vehicle/VehicleAssignments.jsx";
import ManageVehicles from "./pages/vehicle/ManageVehicles.jsx";
import WorkerTasks from "./pages/worker/WorkerTasks.jsx";

// ✅ Staff layout + pages (Navbar/Sidebar stay visible for all staff routes)
import DashboardLayout from "./components/common/DashboardLayout.jsx";
import StaffOverview from "./pages/staff/StaffOverview.jsx";
import StaffDashboard from "./pages/staff/StaffDashboard.jsx";
import AssignedProjects from "./pages/staff/AssignedProjects.jsx";
import TaskManagement from "./pages/staff/TaskManagement.jsx";
import StaffAppointments from "./pages/staff/StaffAppointments.jsx";
import Messages from "./pages/staff/Messages.jsx";
import StaffProfile from "./pages/staff/StaffProfile.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Login only (no layout) */}
        <Route path="/" element={<CMSLoginForm />} />

        {/* ✅ Staff area uses DashboardLayout (Sidebar + Navbar) */}
        <Route element={<DashboardLayout role="staff" />}>
          <Route path="/staff" element={<StaffOverview />} />
          <Route path="/dashboard" element={<StaffDashboard />} />
          <Route path="/projects" element={<AssignedProjects />} />
          <Route path="/tasks" element={<TaskManagement />} />
          <Route path="/appointments" element={<StaffAppointments />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<StaffProfile />} />
        </Route>

        {/* Other routes (keep your existing structure) */}
        <Route path="/admin" element={<AdminOverview />} />
        <Route path="/payment" element={<PaymentsDashboard />} />
        <Route path="/adduser" element={<AddUserform />} />
        <Route path="/addworker" element={<AddWorkerform />} />
        <Route path="/aprofile" element={<AdminProfile />} />
        <Route path="/allocation" element={<AllocationDashboard />} />
        <Route path="/workermanagement" element={<WorkerManagementDashboard />} />
        <Route path="/vehicle" element={<VehicleDashboard />} />
        <Route path="/assignment" element={<VehicleAssignment />} />
        <Route path="/manage" element={<ManageVehicles />} />
        <Route path="/worker" element={<WorkerTasks />} />

        {/* Optional: Not found */}
        <Route path="*" element={<div style={{ padding: 24 }}>Page not found</div>} />
      </Routes>
    </Router>
  );
}

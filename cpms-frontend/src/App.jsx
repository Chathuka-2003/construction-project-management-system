import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Auth
import CMSLoginForm from "./pages/auth/Login.jsx";

// Layout
import DashboardLayout from "./components/common/DashboardLayout.jsx";

// STAFF pages
import StaffOverview from "./pages/staff/StaffOverview.jsx";
import AssignedProjects from "./pages/staff/AssignedProjects.jsx";
import TaskManagement from "./pages/staff/TaskManagement.jsx";
import StaffAppointments from "./pages/staff/StaffAppointments.jsx";
import Messages from "./pages/staff/Messages.jsx";
import StaffProfile from "./pages/staff/StaffProfile.jsx";

// ADMIN pages
import AdminOverview from "./pages/admin/AdminOverview.jsx";
import AdminProfile from "./pages/admin/AdminProfile.jsx";
import WorkerManagementDashboard from "./pages/admin/WorkerManagementDashboard.jsx";

// Shared / Other modules
import PaymentsDashboard from "./pages/payments/PaymentsDashboard.jsx";
import AllocationDashboard from "./pages/allocation/AllocationDashboard.jsx";

// Vehicle module
import VehicleDashboard from "./pages/vehicle/VehicleDashboard.jsx";
import VehicleAssignment from "./pages/vehicle/VehicleAssignments.jsx";
import ManageVehicles from "./pages/vehicle/ManageVehicles.jsx";

// Forms
import AddUserform from "./pages/forms/AddUserform.jsx";
import AddWorkerform from "./pages/forms/AddWorkerForm.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Login only (no layout) */}
        <Route path="/" element={<CMSLoginForm />} />

        {/* ========================= */}
        {/* ✅ STAFF AREA (layout) */}
        {/* ========================= */}
        <Route element={<DashboardLayout role="staff" />}>
          <Route path="/staff" element={<StaffOverview />} />
          <Route path="/projects" element={<AssignedProjects />} />
          <Route path="/tasks" element={<TaskManagement />} />
          <Route path="/appointments" element={<StaffAppointments />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/sprofile" element={<StaffProfile />} />

          {/* Vehicle pages accessible for staff if sidebar shows them */}
          <Route path="/vehicle" element={<VehicleDashboard />} />
          <Route path="/assignment" element={<VehicleAssignment />} />
          <Route path="/manage" element={<ManageVehicles />} />

          {/* Resource management */}
          <Route path="/allocation" element={<AllocationDashboard />} />
        </Route>

        {/* ========================= */}
        {/* ✅ ADMIN AREA (layout) */}
        {/* ========================= */}
        <Route element={<DashboardLayout role="admin" />}>
          <Route path="/admin" element={<AdminOverview />} />
          <Route path="/aprofile" element={<AdminProfile />} />

          {/* Admin pages */}
          <Route path="/management" element={<WorkerManagementDashboard />} />
          <Route path="/payment" element={<PaymentsDashboard />} />

          {/* Admin also can access these modules */}
          <Route path="/projects" element={<AssignedProjects />} />
          <Route path="/tasks" element={<TaskManagement />} />
          <Route path="/appointments" element={<StaffAppointments />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/allocation" element={<AllocationDashboard />} />

          <Route path="/vehicle" element={<VehicleDashboard />} />
          <Route path="/assignment" element={<VehicleAssignment />} />
          <Route path="/manage" element={<ManageVehicles />} />
        </Route>

        {/* ========================= */}
        {/* ✅ FORMS (no layout) */}
        {/* ========================= */}
        <Route path="/adduser" element={<AddUserform />} />
        <Route path="/addworker" element={<AddWorkerform />} />

        {/* ✅ Optional: redirect old routes */}
        <Route path="/profile" element={<Navigate to="/sprofile" replace />} />
        <Route path="/dashboard" element={<Navigate to="/staff" replace />} />

        {/* Not found */}
        <Route path="*" element={<div style={{ padding: 24 }}>Page not found</div>} />
      </Routes>
    </Router>
  );
}

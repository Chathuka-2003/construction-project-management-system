// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CMSLoginForm from "./pages/auth/Login"; // your Login.jsx
import AdminOverview from "./pages/admin/AdminOverview";//AdminOverview
import StaffOverview from "./pages/staff/StaffOverview"; //staff dashboard
import PaymentsDashboard from "./pages/payments/PaymentsDashboard"; //payment dashboard
import AddUserform from "./pages/forms/AddUserform";
import AddWorkerform from "./pages/forms/AddWorkerForm";
import StaffProfile from "./pages/staff/StaffProfile";
import AdminProfile from "./pages/admin/AdminProfile";
import AllocationDashboard from "./pages/allocation/AllocationDashboard";
import WorkerManagementDashboard from "./pages/admin/WorkerManagementDashboard";
import VehicleDashboard from "./pages/vehicle/VehicleDashboard";
import VehicleAssignment from "./pages/vehicle/VehicleAssignments";
import ManageVehicles from "./pages/vehicle/ManageVehicles";
import WorkerTasks from "./pages/worker/WorkerTasks";
function App() {
  return (
    <Router>
      <Routes>
        {/* Only login page for now */}
        <Route path="/" element={<CMSLoginForm />} />
        <Route path="/admin" element={<AdminOverview />}/>
        <Route path="/staff" element={<StaffOverview/>}/>
        <Route path="/payment" element={<PaymentsDashboard/>}/>
        <Route path="/adduser" element={<AddUserform />} />
        <Route path="/addworker" element={<AddWorkerform />} />
        <Route path="/sprofile" element={<StaffProfile />} />
        <Route path="/aprofile" element={<AdminProfile />} />
        <Route path="/allocation" element={<AllocationDashboard />} />
        <Route path="/workermanagement" element={<WorkerManagementDashboard />} />
        <Route path="/vehicle" element={<VehicleDashboard />} />
        <Route path="/assignment" element={<VehicleAssignment />} />
        <Route path="/manage" element={<ManageVehicles />} />
        <Route path="/worker" element={<WorkerTasks />} />
      </Routes>
    </Router>
  );
}

export default App;



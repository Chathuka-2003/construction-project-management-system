import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React from "react";

import Login from "./pages/auth/Login";
import Unauthorized from "./pages/auth/Unauthorized";

import AdminOverview from "./pages/admin/AdminOverview";
import StaffOverview from "./pages/staff/StaffOverview";
import PaymentsDashboard from "./pages/payments/PaymentsDashboard";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminLayout from "./layouts/AdminLayout";
import StaffLayout from "./layouts/StaffLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

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

          </Route>
        </Route>

        {/* Staff Routes */}
        <Route element={<ProtectedRoute allowedRole="staff" />}>
          <Route path="/staff" element={<StaffLayout />}>
            <Route index element={<Navigate to="overview" replace />} /> {/* /staff -> /staff/overview */}
            <Route path="overview" element={<StaffOverview />} />        {/* relative */}
            <Route path="payment" element={<PaymentsDashboard />} />     {/* relative */}
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

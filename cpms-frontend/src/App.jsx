// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import React from "react";
import Login from "./pages/auth/Login";
import AdminOverview from "./pages/admin/AdminOverview";
import StaffOverview from "./pages/staff/StaffOverview";
import Unauthorized from "./pages/auth/Unauthorized";
import PaymentsDashboard from "./pages/payments/PaymentsDashboard";
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

  {/* Admin */}
  <Route element={<ProtectedRoute allowedRole="admin" />}>
    <Route path="/admin" element={<AdminLayout />}>
      <Route path="/admin/overview" element={<AdminOverview />} />
      <Route path="payment" element={<PaymentsDashboard />} />
    </Route>
  </Route>

  {/* Staff */}
  <Route element={<ProtectedRoute allowedRole="staff" />}>
    <Route path="/staff" element={<StaffLayout />}>
      <Route path="/staff/overview" element={<StaffOverview />} />
      <Route path="payment" element={<PaymentsDashboard />} />
    </Route>
  </Route>
</Routes>

    </Router>
  );
}

export default App;

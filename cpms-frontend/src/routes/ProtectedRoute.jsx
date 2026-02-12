import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRole }) => {
  const token = localStorage.getItem("token");
  const role = (localStorage.getItem("role") || "").toLowerCase(); // FIX: lowercase
  const allowed = allowedRole ? allowedRole.toLowerCase() : null;

  console.log("Token:", token);
  console.log("Role:", role);
  console.log("AllowedRole:", allowed);

  if (!token) {
    // Not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  if (allowed && role !== allowed) {
    // Logged in but role mismatch → unauthorized
    return <Navigate to="/unauthorized" replace />;
  }

  // Allowed → render nested routes
  return <Outlet />;
};

export default ProtectedRoute;

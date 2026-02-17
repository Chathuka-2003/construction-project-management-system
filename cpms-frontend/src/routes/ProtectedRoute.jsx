import { Navigate, Outlet } from "react-router-dom";

function normalizePortalRole(roleRaw) {
  const r = String(roleRaw || "").replace("ROLE_", "").trim().toUpperCase();

  // Admin portal roles
  if (["SUPERADMIN", "ADMIN", "MANAGER"].includes(r)) return "admin";

  // Staff portal roles
  if (["ENGINEER", "OTHER_STAFF", "WORKER"].includes(r)) return "staff";


  // Customers cannot use company portal
  if (r === "CUSTOMER") return "customer";

  return null;
}

const ProtectedRoute = ({ allowedRole }) => {
  const token = localStorage.getItem("token");
  const rawRole = localStorage.getItem("role"); // SUPERADMIN etc
  const portalRole = normalizePortalRole(rawRole);

  // Not logged in
  if (!token) return <Navigate to="/login" replace />;

  // Customer blocked from company portal
  if (portalRole === "customer" || !portalRole)
    return <Navigate to="/unauthorized" replace />;

  // allowedRole is "admin" or "staff" (your App.jsx stays same)
  const allowed = String(allowedRole || "").toLowerCase();
  if (allowed && portalRole !== allowed)
    return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
};

export default ProtectedRoute;


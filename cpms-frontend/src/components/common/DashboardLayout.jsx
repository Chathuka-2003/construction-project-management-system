import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar.jsx";
import Navbar from "./Navbar.jsx";

export default function DashboardLayout({ role }) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <Sidebar role={role} />

      {/* Right side */}
      <div className="flex flex-col flex-1 h-full">
        {/* Top Navbar */}
        <Navbar role={role} />

        {/* Page content */}
        <main className="flex-1 bg-gray-100 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// StaffLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar"; // Ensure the path is correct

export default function StaffLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

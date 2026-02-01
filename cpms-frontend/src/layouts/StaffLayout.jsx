import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function StaffLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 w-full min-w-0 px-6 py-6 bg-gray-50 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

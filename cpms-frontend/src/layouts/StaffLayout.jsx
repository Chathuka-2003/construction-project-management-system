import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function StaffLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">

      <Sidebar />

      {/* Main: only this scrolls */}
      
      <main className="flex-1 min-w-0 overflow-y-auto p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}

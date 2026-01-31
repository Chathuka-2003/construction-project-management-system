import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar.jsx";
import Footer from "./Footer.jsx";

export default function DashboardLayout({ role }) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left: Sidebar */}
      <Sidebar role={role} />

      {/* Right: Page area */}
      <div className="flex flex-col flex-1 h-full">
        {/* Content */}
        <main className="flex-1 bg-gray-100 overflow-y-auto p-6">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

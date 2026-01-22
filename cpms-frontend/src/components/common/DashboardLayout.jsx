import Sidebar from "../Sidebar";
import React from "react";
import { Outlet } from "react-router-dom";
export default function DashboardLayout({ role, children }) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
        <div className="h-full">
      <Sidebar role={role} />
      </div>
      <main className="flex-1 h-full bg-gray-100  overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

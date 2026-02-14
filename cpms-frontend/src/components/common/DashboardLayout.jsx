import React from "react";
import Sidebar from "../Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout({ role, children }) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar role={role} />

      <div className="flex flex-col flex-1 h-full">
        <Navbar role={role} />
        <main className="flex-1 bg-gray-100 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

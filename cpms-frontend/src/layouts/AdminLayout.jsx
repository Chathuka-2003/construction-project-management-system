import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function AdminLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <Sidebar role="admin" />

      {/* Main: only this scrolls */}
      <main className="flex-1 min-w-0 overflow-y-auto p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}

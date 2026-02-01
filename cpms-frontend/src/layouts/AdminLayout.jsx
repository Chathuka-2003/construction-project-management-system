import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar role="admin" />

      {/* Main content - REMOVED px-6 left padding, kept only py-6 and right padding */}
      <main className="flex-1 w-full min-w-0 pr-6 py-6 bg-gray-50 overflow-y:auto overflow-hidden">
        <Outlet /> {/* Child routes render here */}
      </main>
    </div>
  );
}

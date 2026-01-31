import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar role="admin" />

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet /> {/* This is where /admin/* child routes render */}
      </main>
    </div>
  );
}

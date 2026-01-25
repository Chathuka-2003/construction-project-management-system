import React from "react";

export default function Navbar({ role }) {
  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-6">
      <h1 className="text-sm font-semibold text-gray-700">
        {role === "admin" ? "Admin Dashboard" : "Staff Dashboard"}
      </h1>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">
          {role === "admin" ? "Admin Profile" : "Staff Profile"}
        </span>
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
          {role === "admin" ? "A" : "S"}
        </div>
      </div>
    </header>
  );
}

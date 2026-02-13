// src/layouts/CustomerLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const CustomerLayout = () => {
  return (
    <div className="flex h-screen bg-[#f4f1ec]">
      <Sidebar />

      {/* 🔥 IMPORTANT FIX */}
      <div className="flex-1 overflow-auto">
        <div className="h-full min-h-0 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CustomerLayout;

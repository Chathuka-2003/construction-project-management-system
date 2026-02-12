import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const CustomerLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#f4f1ec]">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default CustomerLayout;

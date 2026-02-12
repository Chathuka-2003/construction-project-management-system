import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  FiHome,
  FiFolder,
  FiTrendingUp,
  FiCreditCard,
  FiCalendar,
  FiMessageSquare,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

const Sidebar = () => {
  const navigate = useNavigate();

  const base =
    "flex items-center gap-3 px-4 py-2 rounded-lg transition font-medium";
  const active = "bg-orange-500";
  const inactive = "hover:bg-orange-400";

  const handleLogout = () => {
    // 🔥 Clear auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();

    toast.success("Logged out successfully");

    // 🔁 Redirect to login
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-[#4a403a] text-white p-6 flex flex-col">
      <h2 className="mb-10 text-xl font-bold">Construction Management</h2>

      <nav className="flex-1 space-y-2">
        <NavLink
          to="/customer/dashboard"
          className={({ isActive }) =>
            `${base} ${isActive ? active : inactive}`
          }
        >
          <FiHome size={18} />
          Dashboard
        </NavLink>

        <NavLink
          to="/customer/project-details"
          className={({ isActive }) =>
            `${base} ${isActive ? active : inactive}`
          }
        >
          <FiFolder size={18} />
          Project Details
        </NavLink>

        <NavLink
          to="/customer/taskprogress"
          className={({ isActive }) =>
            `${base} ${isActive ? active : inactive}`
          }
        >
          <FiTrendingUp size={18} />
          Task Progress
        </NavLink>

        <NavLink
          to="/customer/payments"
          className={({ isActive }) =>
            `${base} ${isActive ? active : inactive}`
          }
        >
          <FiCreditCard size={18} />
          Payments
        </NavLink>

        <NavLink
          to="/customer/appointments"
          className={({ isActive }) =>
            `${base} ${isActive ? active : inactive}`
          }
        >
          <FiCalendar size={18} />
          Appointments
        </NavLink>

        <NavLink
          to="/customer/messages"
          className={({ isActive }) =>
            `${base} ${isActive ? active : inactive}`
          }
        >
          <FiMessageSquare size={18} />
          Messages
        </NavLink>

        <NavLink
          to="/customer/profile"
          className={({ isActive }) =>
            `${base} ${isActive ? active : inactive}`
          }
        >
          <FiUser size={18} />
          Profile
        </NavLink>
      </nav>

      {/* 🔴 Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 mt-6 text-sm text-left text-red-300 hover:text-red-400"
      >
        <FiLogOut size={16} />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;

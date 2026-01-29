import { NavLink } from "react-router-dom";

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    [
      "no-underline relative px-[4px] py-[6px]",
      isActive ? "text-[#d28b5c]" : "text-white",
    ].join(" ");

  return (
    <nav className="bg-[#4b3f3a] text-white px-[18px] py-[12px] flex items-center justify-between">
      {/* brand */}
      <div className="flex items-center gap-[10px]">
        <img
          src="/logo.jpeg"
          alt="EcoBuild logo"
          className="w-[44px] h-[44px] object-contain"
        />
        <div className="leading-[1.05]">
          <b className="block text-[22px]">EcoBuild</b>
          <span className="block text-[12px] opacity-90">
            Construction Management System
          </span>
        </div>
      </div>

      {/* links */}
      <div className="flex items-center gap-[18px] max-[900px]:gap-[12px] max-[900px]:flex-wrap max-[900px]:justify-end">
        {/* ✅ Overview page */}
        <NavLink to="/staff" className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/projects" className={linkClass}>
          Projects
        </NavLink>
        <NavLink to="/tasks" className={linkClass}>
          Tasks
        </NavLink>
        <NavLink to="/appointments" className={linkClass}>
          Appointments
        </NavLink>
        <NavLink to="/messages" className={linkClass}>
          Messages
        </NavLink>
        <NavLink to="/profile" className={linkClass}>
          Profile
        </NavLink>
      </div>
    </nav>
  );
}

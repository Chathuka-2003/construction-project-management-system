import { NavLink } from "react-router-dom";
import "..app.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="brand">
        <img src="/logo.jpeg"/>
        <div className="brand-title">
          <b>EcoBuild</b>
          <span>Construction Management System</span>
        </div>
      </div>

      <div className="nav-links">
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/tasks">Tasks</NavLink>
        <NavLink to="/appointments">Appointments</NavLink>
        <NavLink to="/messages">Messages</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </div>
    </nav>
  );
}

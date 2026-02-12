import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.jpeg";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const linkStyle = {
    color: "white",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
  };

  return (
    <nav style={{ backgroundColor: "#432606ea", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
      {/* Logo */}
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "white", fontWeight: "bold", fontSize: "1.5rem", textDecoration: "none" }}>
        <img src={logo} alt="EcohBuild Logo" style={{ height: "40px", width: "40px", objectFit: "contain" }} />
        <span>EcohBuild</span>
      </Link>

      {/* Desktop Links */}
      <div style={{ display: isMobile ? "none" : "flex", gap: "1.5rem" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>Home</Link>
        <Link to="/about" style={{ color: "white", textDecoration: "none" }}>About</Link>
        <Link to="/gallery" style={{ color: "white", textDecoration: "none" }}>Gallery</Link>
        <Link to="/login" style={{ color: "white", textDecoration: "none" }}>Login</Link>
      </div>

      {/* Mobile Menu Icon */}
      <span style={{ fontSize: "1.5rem", cursor: "pointer", display: isMobile ? "block" : "none" }} onClick={() => setOpen(!open)}>
        {open ? "✖" : "☰"}
      </span>

      {/* Mobile Links */}
      {open && isMobile && (
        <div style={{ position: "absolute", top: "100%", right: 0, backgroundColor: "hsla(32, 90%, 12%, 0.76)", padding: "1rem", borderRadius: "0.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Link to="/" onClick={() => setOpen(false)} style={{ color: "white", textDecoration: "none" }}>Home</Link>
          <Link to="/about" onClick={() => setOpen(false)} style={{ color: "white", textDecoration: "none" }}>About</Link>
          <Link to="/gallery" onClick={() => setOpen(false)} style={{ color: "white", textDecoration: "none" }}>Gallery</Link>
          <Link to="/login" onClick={() => setOpen(false)} style={{ color: "white", textDecoration: "none" }}>Login</Link>
        </div>
      )}
    </nav>
  );
}

import React from "react";
import { Mail, Phone, MapPin, Leaf } from "lucide-react";

export default function Footer() {
  const styles = {
    footer: {
      backgroundColor: "#451a03",
      color: "white",
      padding: "48px 0",
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 10px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "32px",
    },
    logoBox: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "10px",
    },
    logoIcon: {
      backgroundColor: "#d97706",
      width: "40px",
      height: "40px",
      borderRadius: "4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    textSmall: {
      fontSize: "18px",
      color: "#fde68a",
      lineHeight: "1",
    },
    title: {
      fontWeight: "600",
      marginBottom: "15px",
    },
    link: {
      color: "#fde68a",
      fontSize: "16px",
      textDecoration: "none",
      display: "block",
      marginBottom: "8px",
    },
    contactRow: {
      display: "flex",
      gap: "10px",
      marginBottom: "8px",
      alignItems: "flex-start",
    },
    icon: {
      color: "#fbbf24",
      marginTop: "8px",
    },
    bottom: {
      borderTop: "1px solid #92400e",
      marginTop: "32px",
      paddingTop: "20px",
      textAlign: "center",
      fontSize: "18px",
      color: "#fcd34d",
    },
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.grid}>
          {/* Logo */}
          <div>
            <div style={styles.logoBox}>
              <div style={styles.logoIcon}>
                <Leaf size={22} />
              </div>
              <h2>EcohBuild</h2>
            </div>
            <p style={styles.textSmall}>
              Building a smarter, greener future through sustainable construction management.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 style={styles.title}>Quick Links</h3>
            <a href="/" style={styles.link}>Home</a>
            <a href="/about" style={styles.link}>About</a>
            <a href="/gallery" style={styles.link}>Gallery</a>
            <a href="/login" style={styles.link}>Login</a>
          </div>

          {/* Contact */}
          <div>
            <h3 style={styles.title}>Contact Us</h3>

            <div style={styles.contactRow}>
              <Phone size={18} style={styles.icon} />
              <div>
                <p style={styles.textSmall}>+1 (555) 123-4567</p>
                <p style={{ fontSize: "12px", color: "#fcd34d" }}>Mon–Fri, 9AM–6PM</p>
              </div>
            </div>

            <div style={styles.contactRow}>
              <Mail size={18} style={styles.icon} />
              <div>
                <p style={styles.textSmall}>info@ecohbuild.com</p>
                <p style={styles.textSmall}>support@ecohbuild.com</p>
              </div>
            </div>

            <div style={styles.contactRow}>
              <MapPin size={18} style={styles.icon} />
              <div>
                <p style={styles.textSmall}>123 Green Street</p>
                <p style={styles.textSmall}>Eco City, EC 12345</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={styles.bottom}>
          © {new Date().getFullYear()} EcohBuild. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

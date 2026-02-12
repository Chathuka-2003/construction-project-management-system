
    import React from "react";

export default function AboutSection() {
  return (
    <section style={{ padding: "2rem 0", backgroundColor: "rgba(255, 255, 255, 0.66)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
        
        <div style={{ textAlign: "center", maxWidth: "768px", margin: "0 auto 4rem" }}>
          <h2 style={{ color: "#431C06", fontSize: "2rem", marginBottom: "1rem" }}>
            About EcohBuild
          </h2>
          <p style={{ color: "#7C4A12", fontSize: "1.2rem" }}>
            A modern construction management system committed to sustainability and excellence
          </p>
        </div>

        
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "3rem"
        }}>
         
          <div style={{
            background: "linear-gradient(to bottom right, #FFFBF0, #FFE8B0)",
            borderRadius: "1rem",
            padding: "2rem",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            border: "1px solid #F5E0C3",
            transition: "box-shadow 0.3s"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{
                backgroundColor: "#FFB600",
                color: "white",
                width: "3rem",
                height: "3rem",
                borderRadius: "0.5rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "1.5rem"
              }}>
                🌿
              </div>
              <h2 style={{ color: "#431C06", fontSize: "1.25rem", fontWeight: "600" }}>
                Vision Statement
              </h2>
            </div>
            <p style={{ color: "#7C4A12", lineHeight: "1.6" }}>
              To develop EcohBuild as a modern construction management system that integrates technology and efficient management to build a sustainable future as quickly as possible.
            </p>
          </div>

          
          <div style={{
            background: "linear-gradient(to bottom right, #FFFBF0, #FFE8B0)",
            borderRadius: "1rem",
            padding: "2rem",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            border: "1px solid #F5E0C3",
            transition: "box-shadow 0.3s"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{
                backgroundColor: "#FF8C00",
                color: "white",
                width: "3rem",
                height: "3rem",
                borderRadius: "0.5rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "1.5rem"
              }}>
                🎯
              </div>
              <h2 style={{ color: "#431C06", fontSize: "1.25rem", fontWeight: "600" }}>
                Mission Statement
              </h2>
            </div>
            <ul style={{ color: "#7C4A12", lineHeight: "1.6", paddingLeft: "1rem", listStyleType: "disc" }}>
              <li>To provide an intelligent and user-friendly platform for managing construction projects with minimal environmental impact.</li>
              <li>To commit to quality, timely delivery, and customer satisfaction in every project.</li>
              <li>To deliver long-term, responsible solutions in the construction industry, considering environmental and social responsibilities.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

  

export function Welcome() {
  const sectionStyle = {
    padding: "4rem 2rem",
    background: "linear-gradient(135deg, #d97706, #b45309)",
    color: "white",
    textAlign: "center"
  
  };

  const titleStyle = {
    fontSize: "2rem",
    marginBottom: "1rem"
  };

  const descStyle = {
    fontSize: "1.3rem",
    marginBottom: "0.1rem"
  };

  return (
    <section style={sectionStyle}>
      <h2 style={titleStyle}>🌿 Welcome to EcohBuild!</h2>
      <p style={descStyle}>
        Building a smarter, greener future — together.
      </p>
      <p style={descStyle}>
        Manage your construction projects efficiently, sustainably, and with confidence.
      </p>
    </section>
  );
}

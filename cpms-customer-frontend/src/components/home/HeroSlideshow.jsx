import { useState, useEffect } from "react";


import slide1 from "../../assets/slide1.jpeg";
import slide2 from "../../assets/slide2.jpg";
import slide3 from "../../assets/slide3.jpeg";

const slides = [
  {
    image: slide1,
    title: "Sustainable Construction",
    description: "Building a greener future with eco-friendly solutions"
  },
  {
    image: slide2,
    title: "Smart Technology",
    description: "Integrating modern technology for efficient management"
  },
  {
    image: slide3,
    title: "Quality Construction",
    description: "Delivering excellence with environmental responsibility"
  }
];

export function HeroSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const containerStyle = {
    position: "relative",
    width: "100%",
    height: "600px",
    overflow: "hidden"
  };

  const overlayStyle = {
    position: "absolute",
    autoplaySpeed: 5000,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(48, 45, 40, 0.56)"
  };

  const textStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "white",
    textAlign: "center",
    maxWidth: "700px"
  };

  const imgStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "opacity 1s ease-in-out",
    position: "absolute",
    top: 0,
    left: 0
  };

  return (
    <div style={containerStyle}>
      {slides.map((slide, index) => (
        <div
          key={index}
          style={{ ...imgStyle, opacity: index === current ? 1 : 0 }}
        >
          <img
            src={slide.image}
            alt={slide.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={overlayStyle}></div>
          <div style={textStyle}>
            <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
              {slide.title}
            </h1>
            <p style={{ fontSize: "1.2rem" }}>{slide.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

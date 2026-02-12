import React, { useState } from "react";


import img1 from "../assets/1.jpg";
import img2 from "../assets/2.jpg";
import img3 from "../assets/3.jpg";
import img4 from "../assets/4.jpg";
import img5 from "../assets/5.jpg";
import img6 from "../assets/6.jpg";
import img7 from "../assets/7.jpg";
import img8 from "../assets/8.jpg";
import img9 from "../assets/9.jpg";
import img10 from "../assets/10.jpg";
import img11 from "../assets/11.jpg";
import img12 from "../assets/12.jpg";
import img13 from "../assets/13.jpg";
import img14 from "../assets/14.jpg";
import img15 from "../assets/15.jpg";
import img16 from "../assets/16.jpg";

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryImages = [
    { url: img1, title: "Project 1", description: "Description 1" },
    { url: img2, title: "Project 2", description: "Description 2" },
    { url: img3, title: "Project 3", description: "Description 3" },
    { url: img4, title: "Project 4", description: "Description 4" },
    { url: img5, title: "Project 5", description: "Description 5" },
    { url: img6, title: "Project 6", description: "Description 6" },
    { url: img7, title: "Project 7", description: "Description 7" },
    { url: img8, title: "Project 8", description: "Description 8" },
    { url: img9, title: "Project 9", description: "Description 9" },
    { url: img10, title: "Project 10", description: "Description 10" },
    { url: img11, title: "Project 11", description: "Description 11" },
    { url: img12, title: "Project 12", description: "Description 12" },
    { url: img13, title: "Project 13", description: "Description 13" },
    { url: img14, title: "Project 14", description: "Description 14" },
    { url: img15, title: "Project 15", description: "Description 15" },
    { url: img16, title: "Project 16", description: "Description 16" },
  ];

  return (
    <section style={{ padding: "3rem 1rem", backgroundColor: "#FFFBF0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
       
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "2rem", color: "#431C06", marginBottom: "0.5rem" }}>
            Project Gallery
          </h2>
          <p style={{ color: "#7C4A12", fontSize: "1.2rem" }}>
            Explore our portfolio of sustainable construction projects
          </p>
        </div>

        
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {galleryImages.map((image, index) => (
            <div
              key={index}
              style={{
                position: "relative",
                cursor: "pointer",
                overflow: "hidden",
                borderRadius: "1rem",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              }}
              onClick={() => setSelectedImage(index)}
            >
              <img
                src={image.url}
                alt={image.title}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  transition: "transform 0.3s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "rgba(67, 28, 6, 0.7)",
                  color: "#fff",
                  padding: "0.5rem",
                  textAlign: "center",
                }}
              >
                <strong>{image.title}</strong>
              </div>
            </div>
          ))}
        </div>

       
        {selectedImage !== null && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.9)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 50,
            }}
            onClick={() => setSelectedImage(null)}
          >
            <img
              src={galleryImages[selectedImage].url}
              alt={galleryImages[selectedImage].title}
              style={{
                maxWidth: "90%",
                maxHeight: "80%",
                borderRadius: "1rem",
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </section>
  );
}

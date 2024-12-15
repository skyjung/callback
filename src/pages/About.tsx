import React from "react";
import { Container } from "react-bootstrap";
import CustomNavbar from "../components/Navbar";

const AboutPage: React.FC = () => {
  return (
    <>
    <CustomNavbar></CustomNavbar>
    <Container id="about" className="home-section">
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      textAlign: "center",
      padding: "20px",
    }}>
      <h2>
        CALLBACK is a vibrant platform designed for aspiring filmmakers, actors, and creatives.
        Our goal is to connect talent with opportunities, making it easier than ever to bring
        creative visions to life.
        Whether you are looking for casting calls, searching for roles, or building a community
        of like-minded individuals, CALLBACK is your one-stop destination. Together, we aim to
        nurture and showcase talent in the world of visual storytelling.
      </h2>
    </div>
    </Container>
    </>
    
  );
};

export default AboutPage;
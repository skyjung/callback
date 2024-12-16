import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from "react-bootstrap";
import CustomNavbar from '../components/Navbar';
import Type from '../components/Type';
import StopMotionGallery from '../components/StopMotionGallery';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';

const LandingPage: React.FC = () => {
  const auth = getAuth();
  const [user] = useAuthState(auth);

  // Array of background images
  const backgroundImages = [
    "/home/1.jpg",
    "/home/2.jpg",
    "/home/3.jpg",
    "/home/4.jpg",
    "/home/5.jpg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [backgroundImages.length]);



  return (
    <>
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        minHeight: "100vh",
        width: "100%",
        overflow: "hidden", // Prevent scrollbars
      }}
    >
      <div style={{ flex: "0 0 3%", backgroundColor: "#1D1D1D" }}></div>

    <div style={{
      backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
      backgroundSize: "cover",
      backgroundPosition: "center right",
      transition: "background-image", // Smooth transition
      minHeight: "100vh",
      overflow: "hidden", // Prevent scrollbars
    }}>
    <CustomNavbar></CustomNavbar>
    <section>
    <Container fluid className="home-section" id="landing">
      <Row className="align-content-center" style={{ width: "400px", marginTop: '5rem'}}>
        <Col xs={12} md={8}>
            <p style={{ fontSize: '1.5rem', padding: '30px' , opacity: '1.5'}}>
              a community of aspiring filmmakers, actors, & creatives.
            </p>
        </Col>
        </Row>
      <Row className="align-items-end"
            style={{
              position: "absolute",
              bottom: "0",
              marginLeft: '0.5rem',
              width: "100%",}}>
        <Col xs={12} md={8} >
          <Type />
        </Col>
      </Row>
    </Container>
    </section>
    </div>
    </div>
    {/* <div className="landing">
    {user && 
        <section>
        <Container fluid className="home-section" id="landing">
          <Row className="align-items-center justify-content-center" style={{ height: "100vh" }}>
            <Col xs={12} md={10} className='d-flex justify-content-center' style={{padding: "0 1rem 0 1rem"}}>
            <StopMotionGallery path={"home"} count={8}></StopMotionGallery>            
            </Col>
          </Row>
        </Container>
        </section>
    } 
    </div> */}
    
    </>
    
  );
};

export default LandingPage;

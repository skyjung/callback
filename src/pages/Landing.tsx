import React from 'react';
import { Container, Row, Col } from "react-bootstrap";
import CustomNavbar from '../components/Navbar';
import Type from '../components/Type';
import StopMotionGallery from '../components/StopMotionGallery';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';

const LandingPage: React.FC = () => {
  const auth = getAuth();
  const [user] = useAuthState(auth);

  return (
    <>
    <CustomNavbar></CustomNavbar>
    <section>
    <Container fluid className="home-section" id="landing">
      <Row className="align-content-center" style={{ width: "400px", marginTop: '5rem'}}>
        <Col xs={12} md={8}>
            <p style={{ fontSize: '1.5rem', padding: '30px' }}>
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
        
    </>
    
  );
};

export default LandingPage;

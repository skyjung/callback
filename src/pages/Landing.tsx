import React from 'react';
import { Container, Row, Col } from "react-bootstrap";
import CustomNavbar from '../components/Navbar';
import Type from '../components/Type';

const LandingPage: React.FC = () => {
  return (
    <>
    <section>
    <CustomNavbar></CustomNavbar>
    <Container fluid className="home-section" id="landing">
        <div className="text-center" style={{ padding: '50px 20px', color: '#1D1D1D' }}>
            <h1><Type/></h1>
            <p style={{ color: '#FFF2B1', fontSize: '1.5rem' }}>
                Welcome to Callback! Discover roles, post casting calls, and connect.
            </p>
        </div>
    </Container>
    </section>
    
        
    </>
    
  );
};

export default LandingPage;

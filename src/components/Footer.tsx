import React from "react";
import { Container, Row, Col } from "react-bootstrap";
// import {
//   AiFillGithub,
//   AiFillInstagram,
//   AiFillYoutube
// } from "react-icons/ai";


function Footer() {
  let date = new Date();
  let year = date.getFullYear();
  return (
    <Container fluid className="footer">
      <Row>
        <Col md="12" className="footer-copywright">
          <p>Copyright © {year} CALLBACK</p>
        </Col>
        {/* <Col md="4" className="footer-body">
          <a href={"https://github.com/skyjung"} className="social-icon" target="_blank">
            <AiFillGithub/>
          </a>
          <a href={"https://www.instagram.com/skyyjung/"} className="social-icon" target="_blank">
            <AiFillInstagram/>
          </a>
          <a href={"https://www.youtube.com/channel/UCO7Y1BDiYihJ9N7C3GpIeiQ"} className="social-icon" target="_blank">
            <AiFillYoutube/>
          </a>
          <a href={"https://www.linkedin.com/in/sky-jung-4ab024190/"} className="social-icon" target="_blank">
            <FaLinkedinIn/>
          </a>
        </Col> */}
      </Row>
    </Container>
  );
}

export default Footer;

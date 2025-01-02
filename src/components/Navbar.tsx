import React, { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const CustomNavbar: React.FC = () => {
  const [expand, updateExpanded] = useState(true);
  const [navColour, updateNavbar] = useState(false);
  const auth = getAuth();
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  function scrollHandler() {
    if (window.scrollY >= 20) {
      updateNavbar(true);
    } else {
      updateNavbar(false);
    }
  }

  window.addEventListener("scroll", scrollHandler);

  return (
    <Navbar
      expanded={true}
      fixed="top"
      expand="md"
      className={navColour ? "sticky" : "navbar"}
      style={{zIndex: 999}}
    >
      <Container style={{'minWidth': '100%'}}>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          onClick={() => updateExpanded(!expand)}
          style={{
            background: "none",
            border: "none",
            padding: 0,
          }}
        >
          <img
            src="/logo.svg" // Path to your logo image
            alt="Logo"
            style={{
              height: "50px",
              cursor: "pointer",
            }}
          />
        </Navbar.Toggle>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto" defaultActiveKey="#home">
            <Nav.Item>
              <Nav.Link as={Link} to="/" onClick={() => updateExpanded(false)}>
                home
              </Nav.Link>
            </Nav.Item>
            {/* <Nav.Item>
                <Nav.Link as={Link} to="/about" onClick={() => updateExpanded(false)}>
                    about
                </Nav.Link>
            </Nav.Item> */}
            {user ? 
            <>
            <Nav.Item>
              <Nav.Link as={Link} to="/profile" onClick={() => updateExpanded(false)}>
                profile
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/post" onClick={() => updateExpanded(false)}>
                post
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/search" onClick={() => updateExpanded(false)}>
                search
              </Nav.Link>
            </Nav.Item> 
            <Nav.Item>
              <Nav.Link as={Link} to="/" onClick={handleLogout}>
                logout
              </Nav.Link>
            </Nav.Item> 
            </> :
            <>
            <Nav.Item>
                <Nav.Link as={Link} to="/login" onClick={() => updateExpanded(false)}>
                    login
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link as={Link} to="/register" onClick={() => updateExpanded(false)}>
                    register
                </Nav.Link>
            </Nav.Item>
            
            </>
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;


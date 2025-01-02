import React, { useEffect, useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getDownloadURL } from "firebase/storage";
import { Dropdown } from "react-bootstrap";

const CustomNavbar: React.FC = () => {
  const [expand, updateExpanded] = useState(true);
  const [navColour, updateNavbar] = useState(false);
  const auth = getAuth();
  const db = getFirestore();
  const [user] = useAuthState(auth);
  const [photoFile, setPhotoFile] = useState("");
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

  useEffect(() => {
    const fetchPhoto = async () => {
      if(user){
        const docRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(docRef);
        const userData = userDoc.data();
        setPhotoFile(userData.photo || "");
      }
    }
    fetchPhoto();
  }, []);

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
            {/* <Nav.Item>
              <Nav.Link as={Link} to="/profile" onClick={() => updateExpanded(false)}>
                profile
              </Nav.Link>
            </Nav.Item> */}
            <Nav.Item>
              <Nav.Link as={Link} to="/create" onClick={() => updateExpanded(false)}>
                create
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/search" onClick={() => updateExpanded(false)}>
                search
              </Nav.Link>
            </Nav.Item> 
            <Dropdown align="end" style={{position: "fixed", top: "20px", right: "20px", zIndex: 999}}>
              <Dropdown.Toggle
                id="profile-dropdown"
                style={{
                  background: "none",
                  border: "none",
                  boxShadow: "none",
                  padding: 0,
                  
                }}
              >
                <div style={{ display: "flex", alignItems: "center", cursor: "pointer", }}>
                  <img
                    src={photoFile} // Replace with the user's profile photo
                    alt="Profile"
                    style={{
                      width: "55px",
                      height: "55px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginRight: "8px",
                    }}
                  />
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu style={{background: 'none', border: '2px solid #E70000', borderRadius: '0'}}>
                <Dropdown.Item as={Link} to="/profile" style={{fontSize: 'large', fontWeight: 700}}>
                  Profile
                </Dropdown.Item>
                <Dropdown.Item onClick={handleLogout} style={{fontSize: 'large', fontWeight: 700}}>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            {/* <a href="/profile" className="profile-icon">
              <img src={photoFile} className="profile-icon"/>
            </a>  */}
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


import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import firebaseApp from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import CustomNavbar from "../components/Navbar";
 // Initialize useNavigate

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const auth = getAuth(firebaseApp); // Pass the Firebase app to getAuth

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // alert("Registration successful!");
      navigate("/"); // Redirect to landing page
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
    <CustomNavbar></CustomNavbar>
    <Container id="register" className="home-section">
      <div className="content">
        <h2>Register</h2>
        <form onSubmit={handleRegister} className="form">
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="button">Register</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>  
    </Container>
    </>
    
  );
};

export default Register;

import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from 'react-router-dom';
import CustomNavbar from "../components/Navbar";
import { Container } from "react-bootstrap";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const auth = getAuth();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // alert("Login successful!");
      navigate("/"); // Redirect to landing page
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
    <CustomNavbar></CustomNavbar>
    <Container id="login" className="home-section">
      <div className="content">
        <form onSubmit={handleLogin} className="form">
        <h2>Login</h2>
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
          <button type="submit" className="button">Login</button>
          <p style={{marginTop: '10px'}}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#55987D' }}>
              Register here
            </Link>
          </p>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        
      </div>
    </Container>
    </>
    
  );
};

export default Login;

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import LandingPage from "./pages/Landing";
import CastPosting from "./components/CastPosting";
import SearchPage from "./components/Search";
import UserProfile from "./components/UserProfile";
import AboutPage from "./pages/About";
import ProtectedRoute from "./ProtectedRoute";
import Footer from "./components/Footer";

const App = () => {
  return (
    <Router>
      <Routes>
        
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/" element={<LandingPage />} />
        {/* Protected routes */}
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post"
          element={
            <ProtectedRoute>
              <CastPosting />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
    
  );
};

export default App;

import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import LandingPage from "./pages/Landing";
import CastPosting from "./components/CastPosting";
import SearchPage from "./components/Search";
import UserProfile from "./components/UserProfile";
import AboutPage from "./pages/About";
import ProtectedRoute from "./ProtectedRoute";
import Footer from "./components/Footer";
import { AnimatePresence } from "framer-motion";
import PageWipe from "./components/PageWipe";


// Routes with Animations
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/register"
          element={
            <PageWipe>
              <Register />
            </PageWipe>
          }
        />
        <Route
          path="/login"
          element={
            <PageWipe>
              <Login />
            </PageWipe>
          }
        />
        <Route
          path="/about"
          element={
            <PageWipe>
              <AboutPage />
            </PageWipe>
          }
        />
        <Route
          path="/"
          element={
            <PageWipe>
              <LandingPage />
            </PageWipe>
          }
        />
        {/* Protected routes */}
        <Route
          path="/search"
          element={
            <PageWipe>
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            </PageWipe>
          }
        />
        <Route
          path="/create"
          element={
            <PageWipe>
              <ProtectedRoute>
                <CastPosting />
              </ProtectedRoute>
            </PageWipe>
          }
        />
        <Route
          path="/profile"
          element={
            <PageWipe>
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            </PageWipe>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

// Main App Component
const App = () => {
  return (
    <Router>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden", 
        }}
      >
        <div style={{ flex: 1, position: "relative" , overflow: "hidden", }}>
          <AnimatedRoutes />
          <Footer />
        </div>
        
      </div>
    </Router>
  );
};

export default App;

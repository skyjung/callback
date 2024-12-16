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

// PageWipe Component for Transitions
// const PageWipe = ({ children }) => {
//   return (
//     <motion.div
//       initial={{ translateY: "100%" }}
//       animate={{ translateY: "0%" }}
//       exit={{ translateY: "-100%" }}
//       transition={{
//         duration: 0.8,
//         ease: [0.4, 0, 0.2, 1],
//       }}
//       style={{
//         position: "absolute",
//         width: "100%",
//         height: "100%",
//       }}
//     >
//       {children}
//     </motion.div>
//   );
// };

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
          path="/post"
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
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <div style={{ flex: 1 }}>
          <AnimatedRoutes />
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;

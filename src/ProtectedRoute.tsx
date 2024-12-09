import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactElement; // Ensure the children prop is a valid React element
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <p>Loading...</p>
      </div>
    );
  }

  // If no user, redirect to login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If user exists, render the protected content
  return children;
};

export default ProtectedRoute;

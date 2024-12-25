// Project Page Implementation
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, query, where, collection, getDocs } from "firebase/firestore";
import { Container, Row, Col } from "react-bootstrap";
import CustomNavbar from "../components/Navbar";
import RoleCard from "../components/RoleCard";

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState({ ongoing: [], past: [], future: [] });
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchProjects = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const roleIds = userDoc.data().linkedRoles || [];
          const rolesRef = collection(db, "roles");
          const q = query(rolesRef, where("__name__", "in", roleIds));
          const rolesSnapshot = await getDocs(q);
          const roles = rolesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          const now = new Date();

          const categorized = {
            ongoing: roles.filter((role) => {
              const start = role.filmingDates?.start?.toDate();
              const end = role.filmingDates?.end?.toDate();
              return start <= now && end >= now;
            }),
            past: roles.filter((role) => {
              const end = role.filmingDates?.end?.toDate();
              return end < now;
            }),
            future: roles.filter((role) => {
              const start = role.filmingDates?.start?.toDate();
              return start > now;
            }),
          };
          setProjects(categorized);
        }
      }
    };

    fetchProjects();
  }, [auth, db]);

  return (
    <>
      <CustomNavbar />
      <Container className="default-section">
        <h2>Projects</h2>
        {Object.entries(projects).map(([category, roles]) => (
          <div key={category}>
            <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
            {roles.length > 0 ? (
              roles.map((role) => <RoleCard key={role.id} role={role} onCall={handleCall} alreadyCalled={false} />)
            ) : (
              <p>No {category} projects</p>
            )}
          </div>
        ))}
      </Container>
    </>
  );
};

export default ProjectsPage;

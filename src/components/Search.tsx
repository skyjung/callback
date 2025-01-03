import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, query, orderBy, doc, updateDoc, where, arrayUnion, getDoc, arrayRemove } from "firebase/firestore";
import { Container, Card, Button } from "react-bootstrap";
import CustomNavbar from "./Navbar";
import { getAuth } from "firebase/auth";

import RoleCard from "./RoleCard";

interface Role {
  id: string;
  name: string;
  ageRange?: { start: number; end: number };
  ethnicity?: string;
  description?: string;
  filmingDates?: { start: any; end: any };
  location?: string;
  traits?: string;
  contact?: string;
  createdAt?: any;
}


const SearchPage: React.FC = () => {
  const db = getFirestore();
  const auth = getAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [calledRoles, setCalledRoles] = useState<any[]>([]);
  const [postedRoles, setPostedRoles] = useState<any[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesRef = collection(db, "roles");
        const q = query(rolesRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const rolesList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Role));
        setRoles(rolesList);
      } catch (error) {
        console.error("Error fetching roles: ", error);
      }
    };

    fetchRoles();
  }, [db]);

  useEffect(() => {
    const fetchCalledRoles = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            setCalledRoles(userDoc.data().calledRoles || []);
          }
        } catch (error) {
          console.error("Error fetching called roles: ", error);
        }
      }
    };

    const fetchPostedRoles = async () => {
      const user = auth.currentUser;
      if (user) {
        try { 
          const postedRolesQuery = query(collection(db, "roles"), where("postedBy", "==", user.uid));
          const postedRolesSnapshot = await getDocs(postedRolesQuery);
          const postedRolesList = postedRolesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setPostedRoles(postedRolesList);
        }
        catch (error) {
          console.error("Error fetching posted roles: ", error)
        }
      }
    };

    fetchCalledRoles();
    fetchPostedRoles();
  }, [db, auth]);

  const handleCall = async (roleId: string) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        if (calledRoles.includes(roleId)) {
          await updateDoc(userRef, {
            calledRoles: arrayRemove(roleId),
          });
          setCalledRoles((prev) => prev.filter((id) => id !== roleId));
          // alert("Role has been removed from your profile.");
        } else {
          await updateDoc(userRef, {
            calledRoles: arrayUnion(roleId),
          });
          setCalledRoles((prev) => [...prev, roleId]);
          // alert("Role has been added to your profile.");
        }
      } catch (error) {
        console.error("Error toggling call status: ", error);
      }
    } else {
      alert("You need to log in to call a role.");
    }
  };

  const filteredRoles = searchTerm
    ? roles.filter((role) => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
          role.name.toLowerCase().includes(searchTermLower) ||
          role.location?.toLowerCase().includes(searchTermLower) ||
          (role.traits && role.traits.toLowerCase().includes(searchTermLower)) ||
          (role.ageRange && `${role.ageRange.start}-${role.ageRange.end}`.includes(searchTermLower)) ||
          (role.filmingDates &&
            (new Date(role.filmingDates.start).toLocaleDateString().includes(searchTermLower) ||
              new Date(role.filmingDates.end).toLocaleDateString().includes(searchTermLower)))
        );
      })
    : roles;

  return (
    <>
      <CustomNavbar />
      <Container id="search" className="default-section">
        <div className="search" style={{paddingRight: '2rem'}}>
          <h3 className="page_title">search</h3>
          <input
            type="text"
            placeholder="Search by Role, Location, Traits, Age Range, or Dates"
            className="searchbar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="search-results">
            {filteredRoles.length > 0 ? (
              filteredRoles.map((role) => (
                <div className="role-card">
                  <RoleCard
                    key={role.id}
                    role={role}
                    posted={postedRoles.includes(role.id)}
                    onCall={handleCall}
                    alreadySaved={calledRoles.includes(role.id)}
                  />
                </div>
                
              ))
            ) : (
              <p>No roles found.</p>
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export default SearchPage;

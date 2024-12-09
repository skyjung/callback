import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, query } from "firebase/firestore";
import { Container } from "react-bootstrap";
import CustomNavbar from "./Navbar";

const SearchPage: React.FC = () => {
  const db = getFirestore();

  const [roles, setRoles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch roles from Firestore
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesRef = collection(db, "roles");
        const querySnapshot = await getDocs(query(rolesRef));
        const rolesList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setRoles(rolesList);
      } catch (error) {
        console.error("Error fetching roles: ", error);
      }
    };

    fetchRoles();
  }, [db]);

  // Filter roles based on search term
  const filteredRoles = roles.filter((role) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      role.name.toLowerCase().includes(searchTermLower) ||
      role.location.toLowerCase().includes(searchTermLower) ||
      (role.traits && role.traits.toLowerCase().includes(searchTermLower)) ||
      (role.ageRange &&
        `${role.ageRange.start}-${role.ageRange.end}`.includes(searchTermLower)) ||
      (role.filmingDates &&
        (new Date(role.filmingDates.start).toLocaleDateString().includes(searchTermLower) ||
          new Date(role.filmingDates.end).toLocaleDateString().includes(searchTermLower)))
    );
  });

  const formatDate = (date: any): string => {
    if (!date) return "Not specified";
  
    // Handle Firestore Timestamp
    if (date.seconds) {
      return new Date(date.seconds * 1000).toLocaleDateString();
    }
  
    // Handle ISO string or other valid date string
    return new Date(date).toLocaleDateString();
  };

  return (
    <>
      <CustomNavbar />
      <Container id="search" className="home-section">
        <div className="search">
          <h1>Search Roles</h1>
          <input
            type="text"
            placeholder="Search by Role, Location, Traits, Age Range, or Dates"
            className="input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div>
            {filteredRoles.length > 0 ? (
              filteredRoles.map((role) => (
                <div
                  key={role.id}
                  style={{
                    border: "1px solid #FFF2B1",
                    marginBottom: "10px",
                    padding: "10px",
                    borderRadius: "5px",
                  }}
                >
                  <h4>{role.name}</h4>
                  <p>
                    Age Range:{" "}
                    {role.ageRange
                      ? `${role.ageRange.start} - ${role.ageRange.end}`
                      : "Not specified"}
                  </p>
                  <p>Ethnicity: {role.ethnicity || "Not specified"}</p>
                  <p>Description: {role.description}</p>
                  <p>
                    Filming Dates:{" "}
                    {role.filmingDates
                      ? `${formatDate(role.filmingDates.start)} - ${formatDate(role.filmingDates.end)}`: "Not specified"}
                  </p>
                  <p>Location: {role.location || "Not specified"}</p>
                  <p>Nice-to-Have: {role.traits || "Not specified"}</p>
                  <p>Compensation: {role.compensation || "Not specified"}</p>
                  <p>Posted: {formatDate(role.createdAt) || "Not specified"}</p>
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

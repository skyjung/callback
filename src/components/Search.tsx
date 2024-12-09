import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";

const SearchPage: React.FC = () => {
  const db = getFirestore();

  const [roles, setRoles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch roles from Firestore
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesRef = collection(db, "roles");
        const q = query(rolesRef);
        const querySnapshot = await getDocs(q);
        const rolesList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setRoles(rolesList);
      } catch (error) {
        console.error("Error fetching roles: ", error);
      }
    };

    fetchRoles();
  }, [db]);

  // Filter roles based on search term
  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.traits.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "20px", color: "#FFF2B1" }}>
      <h2>Search Roles</h2>
      <input
        type="text"
        placeholder="Search by Role, Location, or Traits"
        className="form-control mb-3"
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
              <p>Age: {role.age}</p>
              <p>Ethnicity: {role.ethnicity}</p>
              <p>Description: {role.description}</p>
              <p>Filming Dates: {role.filmingDates}</p>
              <p>Location: {role.location}</p>
              <p>Nice-to-Have: {role.traits}</p>
              <p>Compensation: {role.compensation}</p>
            </div>
          ))
        ) : (
          <p>No roles found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;

// import React, { useState, useEffect } from "react";
// import { getFirestore, collection, getDocs, query } from "firebase/firestore";
// import { Container } from "react-bootstrap";
// import CustomNavbar from "./Navbar";

// const SearchPage: React.FC = () => {
//   const db = getFirestore();

//   const [roles, setRoles] = useState<any[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");

//   // Fetch roles from Firestore
//   useEffect(() => {
//     const fetchRoles = async () => {
//       try {
//         const rolesRef = collection(db, "roles");
//         const querySnapshot = await getDocs(query(rolesRef));
//         const rolesList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//         setRoles(rolesList);
//       } catch (error) {
//         console.error("Error fetching roles: ", error);
//       }
//     };

//     fetchRoles();
//   }, [db]);

//   // Filter roles based on search term
//   const filteredRoles = roles.filter((role) => {
//     const searchTermLower = searchTerm.toLowerCase();
//     return (
//       role.name.toLowerCase().includes(searchTermLower) ||
//       role.location.toLowerCase().includes(searchTermLower) ||
//       (role.traits && role.traits.toLowerCase().includes(searchTermLower)) ||
//       (role.ageRange &&
//         `${role.ageRange.start}-${role.ageRange.end}`.includes(searchTermLower)) ||
//       (role.filmingDates &&
//         (new Date(role.filmingDates.start).toLocaleDateString().includes(searchTermLower) ||
//           new Date(role.filmingDates.end).toLocaleDateString().includes(searchTermLower)))
//     );
//   });

//   const formatDate = (date: any): string => {
//     if (!date) return "Not specified";
  
//     // Handle Firestore Timestamp
//     if (date.seconds) {
//       return new Date(date.seconds * 1000).toLocaleDateString();
//     }
  
//     // Handle ISO string or other valid date string
//     return new Date(date).toLocaleDateString();
//   };

//   return (
//     <>
//       <CustomNavbar />
//       <Container id="search" className="home-section">
//         <div className="search">
//           <h1>Search Roles</h1>
//           <input
//             type="text"
//             placeholder="Search by Role, Location, Traits, Age Range, or Dates"
//             className="input"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <div>
//             {filteredRoles.length > 0 ? (
//               filteredRoles.map((role) => (
//                 <div
//                   key={role.id}
//                   style={{
//                     border: "2px solid red",
//                     marginBottom: "10px",
//                     padding: "10px",
//                   }}
//                 >
//                   <h4>{role.name}</h4>
//                   <p>
//                     Age Range:{" "}
//                     {role.ageRange
//                       ? `${role.ageRange.start} - ${role.ageRange.end}`
//                       : "Not specified"}
//                   </p>
//                   <p>Ethnicity: {role.ethnicity || "Not specified"}</p>
//                   <p>Description: {role.description}</p>
//                   <p>
//                     Filming Dates:{" "}
//                     {role.filmingDates
//                       ? `${formatDate(role.filmingDates.start)} - ${formatDate(role.filmingDates.end)}`: "Not specified"}
//                   </p>
//                   <p>Location: {role.location || "Not specified"}</p>
//                   <p>Nice-to-Have: {role.traits || "Not specified"}</p>
//                   <p>Compensation: {role.compensation || "Not specified"}</p>
//                   <p>Posted: {formatDate(role.createdAt) || "Not specified"}</p>
//                 </div>
//               ))
//             ) : (
//               <p>No roles found.</p>
//             )}
//           </div>
//         </div>
//       </Container>
//     </>
//   );
// };

// export default SearchPage;

import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, query, orderBy, doc, updateDoc, arrayUnion, getDoc, arrayRemove } from "firebase/firestore";
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
  const [calledRoles, setCalledRoles] = useState<string[]>([]);

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

    fetchCalledRoles();
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
          alert("Role has been removed from your profile.");
        } else {
          await updateDoc(userRef, {
            calledRoles: arrayUnion(roleId),
          });
          setCalledRoles((prev) => [...prev, roleId]);
          alert("Role has been added to your profile.");
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
      <Container id="search" className="home-section">
        <div className="search" style={{paddingRight: '2rem'}}>
          <h4 className="page_title">Search roles</h4>
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
                <RoleCard
                  key={role.id}
                  role={role}
                  onCall={handleCall}
                  alreadyCalled={calledRoles.includes(role.id)}
                />
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

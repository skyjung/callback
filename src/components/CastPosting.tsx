import React, { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Container } from "react-bootstrap";
import CustomNavbar from "./Navbar";
import { Timestamp } from "firebase/firestore";


const CastPosting: React.FC = () => {
  const db = getFirestore();
  const auth = getAuth();

  const [role, setRole] = useState({
    name: "",
    ageStart: "",
    ageEnd: "",
    ethnicity: "",
    description: "",
    filmingStart: "",
    filmingEnd: "",
    location: "",
    traits: "",
    contact: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRole({ ...role, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      alert("You need to log in to post a casting call!");
      return;
    }

    try {
      const rolesRef = collection(db, "roles");
      await addDoc(rolesRef, {
        name: role.name,
        ageRange: {
          start: parseInt(role.ageStart, 10),
          end: parseInt(role.ageEnd, 10),
        },
        ethnicity: role.ethnicity,
        description: role.description,
        filmingDates: {
          start: Timestamp.fromDate(new Date(role.filmingStart)),
          end: Timestamp.fromDate(new Date(role.filmingEnd)),
        },
        location: role.location,
        traits: role.traits,
        contact: role.contact, 
        postedBy: user.uid,
        createdAt: new Date(),
      });
      alert("Casting call posted successfully!");
      setRole({
        name: "",
        ageStart: "",
        ageEnd: "",
        ethnicity: "",
        description: "",
        filmingStart: "",
        filmingEnd: "",
        location: "",
        traits: "",
        contact: "",
      });
    } catch (error) {
      console.error("Error posting casting call: ", error);
      alert("Failed to post casting call.");
    }
  };

  return (
    <>
      <CustomNavbar />
      <Container id="cast-posting" className="home-section">
        <div className="content">
          <h1>Post a Casting Call</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Role Name"
              value={role.name}
              onChange={handleChange}
              className="input"
              required
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="number"
                name="ageStart"
                placeholder="Age Range Start"
                value={role.ageStart}
                onChange={handleChange}
                className="input"
                required
              />
              <input
                type="number"
                name="ageEnd"
                placeholder="Age Range End"
                value={role.ageEnd}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            <input
              type="text"
              name="ethnicity"
              placeholder="Ethnicity"
              value={role.ethnicity}
              onChange={handleChange}
              className="input"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={role.description}
              onChange={handleChange}
              className="input"
              required
            ></textarea>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="date"
                name="filmingStart"
                placeholder="Filming Start Date"
                value={role.filmingStart}
                onChange={handleChange}
                className="input"
                required
              />
              <input
                type="date"
                name="filmingEnd"
                placeholder="Filming End Date"
                value={role.filmingEnd}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            <input
              type="text"
              name="location"
              placeholder="Filming Location (e.g., Cambridge, MA)"
              value={role.location}
              onChange={handleChange}
              className="input"
            />
            <input
              type="text"
              name="traits"
              placeholder="Nice-to-Have Traits/Experience"
              value={role.traits}
              onChange={handleChange}
              className="input"
            />
            <input
              type="text"
              name="contact"
              placeholder="Contact (e.g. example@gmail.com)"
              value={role.contact}
              onChange={handleChange}
              className="input"
              required
            />
            <button
              type="submit"
              className="button"
              style={{ backgroundColor: "#28691E", color: "#FFF2B1" }}
            >
              Post Role
            </button>
          </form>
        </div>
      </Container>
    </>
  );
};

export default CastPosting;

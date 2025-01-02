import React, { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Col, Container, Row } from "react-bootstrap";
import CustomNavbar from "./Navbar";
import { Timestamp } from "firebase/firestore";
import {Role} from "./RoleCard";
import RoleCardPreview from "./RoleCardPreview";

const CastPosting: React.FC = () => {
  const db = getFirestore();
  const auth = getAuth();
  const [role, setRole] = useState<Role>({
    id: "",
    name: "",
    ageRange: {start: null, end: null},
    ethnicity: "",
    description: "",
    filmingDates: {start: null, end: null},
    location: "",
    traits: "",
    contact: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

    const { name, value } = e.target;

    // Handle nested updates for ageRange and filmingDates
    if (name === "ageRangeStart") {
      setRole((prev) => ({ ...prev, ageRange: { ...prev.ageRange, start: value } }));
    } else if (name === "ageRangeEnd") {
      setRole((prev) => ({ ...prev, ageRange: { ...prev.ageRange, end: value } }));
    } else if (name === "filmingStart") {
      setRole((prev) => ({ ...prev, filmingDates: { ...prev.filmingDates, start: value } }));
    } else if (name === "filmingEnd") {
      setRole((prev) => ({ ...prev, filmingDates: { ...prev.filmingDates, end: value } }));
    } else {
      // For all other fields
      setRole((prev) => ({ ...prev, [name]: value }));
    }
    // setRole({ ...role, [e.target.name]: e.target.value });
  };

  function verifyRole (role: Role): boolean {
    if (!role) return false;
    // Check required fields
    if (!role.name || role.name.trim() === "") {
      console.error("Invalid Role Name");
      return false;
    }

    if (!role.ageRange || !role.ageRange.start || !role.ageRange.end) {
      console.error("Invalid Age Range");
      return false;
    }

    if (isNaN(Number(role.ageRange.start)) || isNaN(Number(role.ageRange.end))) {
      console.error("Age Range must be numbers");
      return false;
    }

    if (Number(role.ageRange.start) > Number(role.ageRange.end)) {
      console.error("Age Range start cannot be greater than end");
      return false;
    }

    if (!role.filmingDates || !role.filmingDates.start || !role.filmingDates.end) {
      console.error("Invalid Filming Dates");
      return false;
    }

    const startDate = new Date(role.filmingDates.start);
    const endDate = new Date(role.filmingDates.end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error("Filming Dates must be valid dates");
      return false;
    }

    if (startDate > endDate) {
      console.error("Filming start date cannot be after end date");
      return false;
    }

    if (!role.contact || role.contact.trim() === "") {
      console.error("Invalid Contact Information");
      return false;
    }

    // Optional fields validation
    if (role.ethnicity && role.ethnicity.trim() === "") {
      console.warn("Ethnicity is specified but empty");
    }

    if (role.location && role.location.trim() === "") {
      console.warn("Location is specified but empty");
    }

    if (role.traits && role.traits.trim() === "") {
      console.warn("Traits are specified but empty");
    }

    if (role.description && role.description.trim() === "") {
      console.warn("Description is specified but empty");
    }

    // If all checks pass
    return true;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      alert("You need to log in to post a casting call!");
      return;
    }

    try {
      if(verifyRole(role)){
        const rolesRef = collection(db, "roles");
        await addDoc(rolesRef, {
          name: role.name,
          ageRange: {
            start: role.ageRange.start,
            end: role.ageRange.end,
          },
          ethnicity: role.ethnicity,
          description: role.description,
          filmingDates: {
            start: Timestamp.fromDate(new Date(role.filmingDates.start)),
            end: Timestamp.fromDate(new Date(role.filmingDates.end)),
          },
          location: role.location,
          traits: role.traits,
          contact: role.contact, 
          postedBy: user.uid,
          createdAt: new Date(),
        });
        alert("Casting call posted successfully!");
        setRole({
          id: "",
          name: "",
          ageRange: {start: null, end: null },
          ethnicity: "",
          description: "",
          filmingDates: {start: null, end: null},
          location: "",
          traits: "",
          contact: "",
        });
      }
    } catch (error) {
      console.error("Error posting casting call: ", error);
      alert("Failed to post casting call.");
    }
  };

  return (
    <>
      <CustomNavbar />
      <Container id="cast-posting" className="default-section">
        <div style={{width: '100%', paddingLeft: '2rem'}}>
          <h3 className="page_title">create</h3>
          <Row xs={12}>
            <Col xs={6}>
            <div style={{padding: '5rem'}}>
              <h4>preview role card</h4>
              <RoleCardPreview
                  roleProps = {role}
                />
            </div>
            </Col>
            <Col xs={5}>
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
                  name="ageRangeStart"
                  placeholder="Age Range Start"
                  value={role.ageRange.start}
                  onChange={handleChange}
                  className="input"
                  required
                />
                <input
                  type="number"
                  name="ageRangeEnd"
                  placeholder="Age Range End"
                  value={role.ageRange.end}
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
                  value={role.filmingDates.start}
                  onChange={handleChange}
                  className="input"
                  required
                />
                <input
                  type="date"
                  name="filmingEnd"
                  placeholder="Filming End Date"
                  value={role.filmingDates.end}
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
                create
              </button>
            </form>
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
};

export default CastPosting;

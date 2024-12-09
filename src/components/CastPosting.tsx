import React, { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const CastPosting: React.FC = () => {
  const db = getFirestore();
  const auth = getAuth();

  const [role, setRole] = useState({
    name: "",
    age: "",
    ethnicity: "",
    description: "",
    filmingDates: "",
    location: "",
    traits: "",
    compensation: "",
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
        ...role,
        postedBy: user.uid, // Associate with logged-in user
        createdAt: new Date(), // Timestamp for sorting
      });
      alert("Casting call posted successfully!");
      setRole({
        name: "",
        age: "",
        ethnicity: "",
        description: "",
        filmingDates: "",
        location: "",
        traits: "",
        compensation: "",
      });
    } catch (error) {
      console.error("Error posting casting call: ", error);
      alert("Failed to post casting call.");
    }
  };

  return (
    <div style={{ padding: "20px", color: "#FFF2B1" }}>
      <h2>Post a Casting Call</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Role Name"
          value={role.name}
          onChange={handleChange}
          className="form-control mb-3"
          required
        />
        <input
          type="text"
          name="age"
          placeholder="Age Range"
          value={role.age}
          onChange={handleChange}
          className="form-control mb-3"
          required
        />
        <input
          type="text"
          name="ethnicity"
          placeholder="Ethnicity"
          value={role.ethnicity}
          onChange={handleChange}
          className="form-control mb-3"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={role.description}
          onChange={handleChange}
          className="form-control mb-3"
          required
        ></textarea>
        <input
          type="text"
          name="filmingDates"
          placeholder="Filming Dates"
          value={role.filmingDates}
          onChange={handleChange}
          className="form-control mb-3"
        />
        <input
          type="text"
          name="location"
          placeholder="Filming Location"
          value={role.location}
          onChange={handleChange}
          className="form-control mb-3"
        />
        <input
          type="text"
          name="traits"
          placeholder="Nice-to-Have Traits/Experience"
          value={role.traits}
          onChange={handleChange}
          className="form-control mb-3"
        />
        <input
          type="text"
          name="compensation"
          placeholder="Compensation"
          value={role.compensation}
          onChange={handleChange}
          className="form-control mb-3"
        />
        <button
          type="submit"
          className="btn"
          style={{ backgroundColor: "#28691E", color: "#FFF2B1" }}
        >
          Post Role
        </button>
      </form>
    </div>
  );
};

export default CastPosting;

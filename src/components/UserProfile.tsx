import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Container } from "react-bootstrap";
import CustomNavbar from "./Navbar";

type Profile = {
    name: string;
    age: string; // Use `string` if age is stored as a string, or `number` if it's numeric
    ethnicity: string;
    photo: string;
    resume: string;
  };
  


const UserProfile: React.FC = () => {
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState({
    name: "",
    ageRange: "",
    ethnicity: "",
    photo: "",
    resume: "",
  });
  const [editing, setEditing] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // Fetch logged-in user and their profile
  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const docRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(docRef);
        if (userDoc.exists()) {
            const userData = userDoc.data();
            setProfile({
                name: userData.name || "",
                ageRange: userData.age || "",
                ethnicity: userData.ethnicity || "",
                photo: userData.photo || "",
                resume: userData.resume || "",
              });
        }
      }
    });
  }, [auth, db]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setResumeFile(e.target.files[0]);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setPhotoFile(e.target.files[0]);
  };

  const validateProfile = (profile) => {
    return {
      name: profile.name || "Unknown",
      age: profile.age || "", // Ensure `age` is a number
      ethnicity: profile.ethnicity || "Unknown",
      photo: profile.photo || "",
      resume: profile.resume || "",
    };
  };


  const handleSave = async () => {
    if (user) {
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, profile);

      // Handle file upload
      // Upload resume if a new file is provided
      if (resumeFile) {
        const resumeRef = ref(storage, `resumes/${user.uid}`);
        await uploadBytes(resumeRef, resumeFile);
        const resumeURL = await getDownloadURL(resumeRef);
        profile.resume = resumeURL;
      }

      // Upload photo if a new file is provided
      if (photoFile) {
        const photoRef = ref(storage, `photos/${user.uid}`);
        await uploadBytes(photoRef, photoFile);
        const photoURL = await getDownloadURL(photoRef);
        profile.photo = photoURL;
      }
      const validatedProfile = validateProfile(profile);
      // Update Firestore document
      try {
        await setDoc(docRef, validatedProfile, { merge: true });
        console.log("Profile saved successfully.");
        setEditing(false);
      } catch (error) {
        console.error("Error saving profile:", error);
      }
    }
  };

  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <>
    <CustomNavbar></CustomNavbar>
    <Container id="user-profile" className="section">
    <div className="profile">
      <h1>User Profile</h1>
      {profile.photo ? (
        <div>
          <img
            src={profile.photo}
            alt="Profile"
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #FFF2B1",
            }}
          />
        </div>
      ) : (
        <p>No profile picture uploaded.</p>
      )}
      {editing ? (
        <>
          <input
            className="input"
            type="text"
            name="name"
            value={profile.name}
            onChange={handleInputChange}
            placeholder="Name"
            
          />
          <input
            className="input"
            type="text"
            name="ageRange"
            value={profile.ageRange}
            onChange={handleInputChange}
            placeholder="Age"
            
          />
          <input
            type="text"
            name="ethnicity"
            value={profile.ethnicity}
            onChange={handleInputChange}
            placeholder="Ethnicity"
            className="input"
          />
          <label>
            Upload Resume:
            <input
                type="file"
                onChange={handleResumeChange}
                className="input"
            />
            </label>
            <label>
            Upload Profile Picture:
            <input
                type="file"
                onChange={handlePhotoChange}
                className="input"
            />
            </label>
          <button
            onClick={handleSave}
            className="button"
            style={{ backgroundColor: "#55987D", color: "#FFF2B1" }}
          >
            Save
          </button>
        </>
      ) : (
        <>
          <p>Name: {profile.name}</p>
          <p>Age: {profile.ageRange}</p>
          <p>Ethnicity: {profile.ethnicity}</p>
          {profile.resume && (
            <p>
              Resume:{" "}
              <a href={profile.resume} target="_blank" rel="noopener noreferrer">
                Download
              </a>
            </p>
          )}
          
          <button
            onClick={() => setEditing(true)}
            className="btn"
            style={{ backgroundColor: "#CD4646", color: "#FFF2B1" }}
          >
            Edit Profile
          </button>
        </>
      )}
    </div>
    </Container>
    </>
    
  );
};

export default UserProfile;

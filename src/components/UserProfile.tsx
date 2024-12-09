import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const UserProfile: React.FC = () => {
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState({
    name: "",
    ageRange: "",
    ethnicity: "",
    resume: "",
  });
  const [editing, setEditing] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  // Fetch logged-in user and their profile
  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const docRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(docRef);
        if (userDoc.exists()) {
          setProfile(userDoc.data());
        }
      }
    });
  }, [auth, db]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleSave = async () => {
    if (user) {
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, profile);

      // Handle file upload
      if (file) {
        const storageRef = ref(storage, `resumes/${user.uid}`);
        await uploadBytes(storageRef, file);
        const resumeURL = await getDownloadURL(storageRef);
        await setDoc(docRef, { ...profile, resume: resumeURL }, { merge: true });
        setProfile({ ...profile, resume: resumeURL });
      }

      setEditing(false);
    }
  };

  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <div style={{ padding: "20px", color: "#FFF2B1" }}>
      <h2>User Profile</h2>
      {editing ? (
        <>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleInputChange}
            placeholder="Name"
            className="form-control mb-3"
          />
          <input
            type="text"
            name="ageRange"
            value={profile.ageRange}
            onChange={handleInputChange}
            placeholder="Age Range"
            className="form-control mb-3"
          />
          <input
            type="text"
            name="ethnicity"
            value={profile.ethnicity}
            onChange={handleInputChange}
            placeholder="Ethnicity"
            className="form-control mb-3"
          />
          <input
            type="file"
            onChange={handleFileChange}
            className="form-control mb-3"
          />
          <button
            onClick={handleSave}
            className="btn"
            style={{ backgroundColor: "#55987D", color: "#FFF2B1" }}
          >
            Save
          </button>
        </>
      ) : (
        <>
          <p>Name: {profile.name}</p>
          <p>Age Range: {profile.ageRange}</p>
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
  );
};

export default UserProfile;

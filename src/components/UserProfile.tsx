import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, query, where, arrayRemove } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Col, Container, Row } from "react-bootstrap";
import CustomNavbar from "./Navbar";
import RoleCard from "./RoleCard";

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
  const [calledRoles, setCalledRoles] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const format_text = (text: string) => {
    // return text.toUpperCase();
    return text;

  }
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
                ageRange: userData.ageRange || "",
                ethnicity: userData.ethnicity || "",
                photo: userData.photo || "",
                resume: userData.resume || "",
              });
              if (userData.calledRoles && userData.calledRoles.length > 0) {
                const rolesRef = collection(db, "roles");
                const q = query(rolesRef, where("__name__", "in", userData.calledRoles));
                const rolesSnapshot = await getDocs(q);
                const rolesList = rolesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setCalledRoles(rolesList);
              }
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

  const handleCall = async (roleId: string) => {
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, { calledRoles: arrayRemove(roleId) }, { merge: true });
        setCalledRoles((prev) => prev.filter((role) => role.id !== roleId));
        alert("Role has been removed from your called list.");
      } catch (error) {
        console.error("Error removing called role: ", error);
      }
    }
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
    <Row>
    <Col className="profile">
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
          <p style={{fontSize: '5rem'}}>{format_text(profile.name)}</p>
          {profile.photo ? (
            <div>
              <img
                src={profile.photo}
                alt="Profile"
                style={{
                  width: "350px",
                  height: "350px",
                  borderRadius: "0%",
                  objectFit: "cover",
                  border: "2px solid #E70000",
                }}
              />
            </div>
          ) : (
            <p>No profile picture uploaded.</p>
          )}
          <div style={{display: 'flex', gap: '5px', flexDirection: 'column'}}>
          <p style={{fontSize: '2rem', margin: 0}}>Age: {profile.ageRange}</p>
          <p style={{fontSize: '2rem', margin: 0}}>Ethnicity: {profile.ethnicity}</p>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', width: '350px'}}>
          {profile.resume && (
            <button 
              className= "button"
              onClick={() => {
                const link = document.createElement('a');
                link.href = profile.resume;
                link.target = '_blank'; // Optional if the file opens in a new tab
                link.download = `${profile.name}_Resume.pdf`; // Adjust the file name if needed
                link.click();
              }}
              >
              Download Resume
            </button>
          )}
          
          <button
            onClick={() => setEditing(true)}
            className="button"
            style={{ backgroundColor: "#CD4646", color: "#FFF2B1" }}
          >
            Edit Profile
          </button>
          </div>
          
        </>
      )}
    </Col>
    <Col className="profile">
        <h2 className="page_title">Saved Roles</h2>
        <div className="posting">
          {calledRoles.length > 0 ? (
                calledRoles.map((role) => (
                  <RoleCard
                    key={role.id}
                    role={role}
                    onCall={handleCall}
                    alreadyCalled={true}
                  />
                ))
              ) : (
                <p>No roles called yet.</p>
              )}
        </div>
    </Col>
    </Row>
    
    </Container>
    </>
    
  );
};

export default UserProfile;

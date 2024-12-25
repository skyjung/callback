import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, deleteDoc, setDoc, collection, getDocs, query, where, arrayRemove } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Col, Container, Row } from "react-bootstrap";
import CustomNavbar from "./Navbar";
import RoleCard from "./RoleCard";
import { FaEdit, FaDownload } from "react-icons/fa";

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
  const [postedRoles, setPostedRoles] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

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

          const postedRolesQuery = query(collection(db, "roles"), where("postedBy", "==", currentUser.uid));
          const postedRolesSnapshot = await getDocs(postedRolesQuery);
          const postedRolesList = postedRolesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setPostedRoles(postedRolesList);
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

  const handleRemove = async (roleId: string) => {
    if (user) {
      try {
        const roleRef = doc(db, "roles", roleId);
        const roleDoc = await getDoc(roleRef);
        if (!roleDoc.exists()) {
          alert("Role not found.");
          return;
        }
        const roleData = roleDoc.data();
        if (roleData?.postedBy !== user.uid) {
          alert("You can only remove roles you posted.");
          return;
        }
        await deleteDoc(roleRef);
        alert("Role successfully removed.");
      } catch (error) {
        console.error("Error removing role: ", error);
        alert("Failed to remove role.");
      }
    }
  };

  const handleSave = async () => {
    if (user) {
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, profile);

      if (resumeFile) {
        const resumeRef = ref(storage, `resumes/${user.uid}`);
        await uploadBytes(resumeRef, resumeFile);
        const resumeURL = await getDownloadURL(resumeRef);
        profile.resume = resumeURL;
      }

      if (photoFile) {
        const photoRef = ref(storage, `photos/${user.uid}`);
        await uploadBytes(photoRef, photoFile);
        const photoURL = await getDownloadURL(photoRef);
        profile.photo = photoURL;
      }

      try {
        await setDoc(docRef, profile, { merge: true });
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
      <CustomNavbar />
      <Container id="user-profile" className="profile-section">
        <Row style={{height: '100vh'}}>
        <Col
            xs={3}
            className="profile"
            style={{
              backgroundColor: "#fff8e1",
              outline: "solid 2px #1e1e1e",
              textAlign: "left",
            }}
          >
            <h2 className="page_title">Profile</h2>
            <div>
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
                  <input type="file" onChange={handleResumeChange} className="input" style={{marginBottom: 0}}/>
                  Upload Resume
                </label>
                <label>
                  <input type="file" onChange={handlePhotoChange} className="input" style={{marginBottom: 0}} />
                  Upload Photo
                </label>
                <button onClick={handleSave} className="button">
                  Save
                </button>
              </>
            ) : (
              <div >
                {profile.photo && (
                  <img
                    src={profile.photo}
                    alt="Profile"
                    className="profile-photo"
                  />
                )}
                <p className="role-card-text" style={{fontWeight: 600}}>{profile.name}</p>
                <p className="role-card-text">Age: {profile.ageRange}</p>
                <p className="role-card-text">Ethnicity: {profile.ethnicity}</p>
                <div style={{display: 'flex', gap: '10px', marginTop: '5px'}}>
                {profile.resume && (
                  <button
                    style={{
                      background: 'transparent',
                      border: 'none'
                    }}
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = profile.resume;
                      link.download = `${profile.name}_Resume.pdf`;
                      link.click();
                    }}
                  >
                    <img
                      src="/download.svg"
                      alt="download"
                      style={{ height: "35px", objectFit: 'cover' }}
                    />
                  </button>
                )}
                <button
                  onClick={() => setEditing(true)}
                  style={{
                    background: 'transparent',
                    border: 'none'
                  }}
                >
                  <img
                    src="/edit.svg"
                    alt="edit"
                    style={{ height: "35px", objectFit: 'cover' }}
                  />
                </button>
                </div>
                
              </div>
            )}
            </div>
            
          </Col>
          <Col
            xs={4}
            className="roles"
            style={{
              backgroundColor: "#f9f9f9",
              outline: "solid 2px #E70000",
              height: "100vh",
              overflowY: "auto",
            }}
          >
            <h2>Posted Roles</h2>
            <div className="posting">
              {postedRoles.length > 0 ? (
                postedRoles.map((role) => (
                  <RoleCard
                    key={role.id}
                    role={role}
                    onCall={handleCall}
                    alreadySaved={true}
                    posted={true}
                    handleRemove={handleRemove}
                  />
                ))
              ) : (
                <p>No roles posted yet.</p>
              )}
            </div>
          </Col>
          <Col
            xs={4}
            className="roles"
            style={{
              backgroundColor: "#eef7ff",
              outline: "solid 2px #E70000",
              height: "100vh",
              overflowY: "auto",
              paddingRight: '5rem',
            }}
          >
            <h2>Saved Roles</h2>
            <div className="posting">
              {calledRoles.length > 0 ? (
                calledRoles.map((role) => (
                  <RoleCard
                    key={role.id}
                    role={role}
                    onCall={handleCall}
                    alreadySaved={calledRoles.some((savedRole) => savedRole.id === role.id)}
                    posted={false}
                  />
                ))
              ) : (
                <p>No roles saved yet.</p>
              )}
            </div>
          </Col>
          
        </Row>
      </Container>
    </>
  );
};

export default UserProfile;

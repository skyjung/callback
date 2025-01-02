import * as React from "react";
import { motion } from "framer-motion"; // For animation
import { Role } from "./RoleCard"; // Adjust the import path as necessary

interface RolePageProps {
  role: Role;
  onClose: () => void;
}

const RolePage: React.FC<RolePageProps> = ({ role, onClose }) => {
  return (
    <>
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        height: "100vh",
        width: "50vw",
        background: "#FFF0E8",
        boxShadow: "-2px 0px 10px rgba(0, 0, 0, 0.2)",
        zIndex: 1000,
        overflowY: "auto",
        padding: "20px",
      }}
    >
    <button
        onClick={onClose}
        style={{
          position: "absolute",
          float: 'left',
          width: '35px',
          height: '35px',
          border: 'none',
        //   border: "3px solid #E70000",
          background: "transparent",
          fontSize: "2.5rem",
          fontWeight: 800,
          cursor: "pointer",
          color: '#E70000'
        }}
      >
        &times;
     </button>
    <div className="role-page"> 
      <h2 style={{ fontSize: "5rem", color: "#E70000" }}>{role.name}</h2>
      <h3>
        <strong>Who:</strong> {role.ageRange ? `${role.ageRange.start} - ${role.ageRange.end}` : "Not specified"}, {role.ethnicity || "Not specified"}
      </h3>
      <h3>
        <strong>When:</strong> {role.filmingDates ? `${new Date(role.filmingDates.start).toLocaleDateString()} - ${new Date(role.filmingDates.end).toLocaleDateString()}` : "Not specified"}
      </h3>
      <h3>
        <strong>Where:</strong> {role.location || "Not specified"}
      </h3>
      <h3>
        <strong>What:</strong> {role.description || "Not specified"}
      </h3>
      <h3>
        <strong>Nice-to-Have:</strong> {role.traits || "Not specified"}
      </h3>
      <h3>
        <strong>Contact:</strong> <a href={`mailto:${role.contact}`}>{role.contact}</a>
      </h3>
      <h3>
        <strong>Posted:</strong> {role.createdAt ? new Date(role.createdAt).toLocaleDateString() : "Not specified"}
      </h3>
      <div style={{ marginTop: "3rem" }}>
        <h3><strong>Project Link:</strong></h3>
        <a href="/home" target="_blank" rel="noopener noreferrer">
          View Project
        </a>
      </div>
      {/* <div style={{ marginTop: "1rem" }}>
        <h3>Images:</h3>
        <div style={{ display: "flex", gap: "10px" }}>
          <img src="/image1.jpg" alt="Project" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
          <img src="/image2.jpg" alt="Project" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
        </div>
      </div> */}
      <div/>
      </div>
      
      
    </motion.div>
    
    </>
  );
};

export default RolePage;

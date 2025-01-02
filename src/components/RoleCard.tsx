import * as React from "react";
import { useState } from "react";
import { Card } from "react-bootstrap";
import RolePage from "./RolePage";

export interface Role {
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

const RoleCard: React.FC<{ role: Role; onCall: (roleId: string) => void; alreadySaved: boolean; posted:boolean; handleRemove?: (roleId: string) => void; }> = ({ role, onCall, alreadySaved, posted, handleRemove }) => {
  const [showRolePage, setShowRolePage] = useState(false);

  const handleViewDetails = () => {
    setShowRolePage(true);
  };

  const handleClose = () => {
    console.log("close");
    setShowRolePage(false);
  }

  
  const formatDate = (date: any): string => {
    if (!date) return "Not specified";
    if (date.seconds) {
      return new Date(date.seconds * 1000).toLocaleDateString();
    }
    return new Date(date).toLocaleDateString();
  };

  // Pass role contact to handleCall
  function handleContact() {
    window.location.href = `mailto:${role.contact}?subject=Interested in your role posting&body=Hi, I am interested in the role posted.`;
  };
  const handleCallClick = () => {
    // console.log("clicked");
    onCall(role.id);
  };


  return (
    <>
    <Card className="role-card" style={{background: 'none', boxShadow: 'none', border: '2px solid #E70000'}} onClick={handleViewDetails}>
      <div className="role-card-buttons">
        {posted ? 
          <button style={{ border: "none", background: "transparent" }} onClick={() => handleRemove(role.id)}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <img
                src="/remove.svg"
                alt="X"
                style={{ height: "25px", objectFit: 'cover' }}
              />
              <span style={{ fontSize: "x-small", color: '#E70000' }}>Remove</span>
            </div>
          </button> 
          : 
          <>
            <button style={{ border: "none", background: "transparent" }} onClick={handleCallClick}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <img
                  src={alreadySaved ? "/unsave.svg" : "/save.svg"}
                  alt={alreadySaved ? "unsave" : "save"}
                  style={{ height: "25px", objectFit: 'cover' }}
                />
                <span style={{ fontSize: "x-small", color: '#E70000' }}>{alreadySaved ? "Unsave" : "Save"}</span>
              </div>
            </button>
            <button style={{ border: "none", background: "transparent" }} onClick={handleContact}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <img
                  src="/contact.svg"
                  alt="contact"
                  style={{ height: "25px", objectFit: 'cover' }}
                />
                <span style={{ fontSize: "x-small", color: '#E70000'}}>Contact</span>
              </div>
            </button>
          </>

          }   
        </div>
      <Card.Body className="role-card-body">
        <Card.Title style={{color: '#E70000', fontWeight: 800, fontSize: 'xx-large', fontFamily: 'InstrumentSerif'}}>{role.name}</Card.Title>
          <Card.Text className="role-card-text"><strong>Who: </strong> {role.ageRange ? `${role.ageRange.start} - ${role.ageRange.end}` : "Not specified"},{role.ethnicity || "Not specified"} </Card.Text>
          {/* <Card.Text className="role-card-text">Ethnicity: {role.ethnicity || "Not specified"}</Card.Text> */}
          <Card.Text className="role-card-text">
          <strong>When: </strong> {role.filmingDates ? `${formatDate(role.filmingDates.start)} - ${formatDate(role.filmingDates.end)}` : "Not specified"}
          </Card.Text>
          <Card.Text className="role-card-text"><strong>Where: </strong>{role.location || "Not specified"}</Card.Text>
          <Card.Text className="role-card-text"><strong>What: </strong> {role.description || "Not specified"}</Card.Text>
          {/* <Card.Text className="role-card-text">Nice-to-Have: {role.traits || "Not specified"}</Card.Text> */}
          {/* <Card.Text className="role-card-text">Contact: {role.contact || "Not specified"}</Card.Text> */}
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', position: 'absolute', top: '220px', paddingRight: '5rem'}}>
          <Card.Text className="role-card-text" style={{display: 'flex', fontWeight: 500}}>Posted {formatDate(role.createdAt) || "Not specified"}</Card.Text>    
          <Card.Text className="role-card-text" style={{display: 'flex', fontWeight: 500}}>Expires: {formatDate(role.createdAt) || "Not specified"}</Card.Text>      
          </div>
          
      </Card.Body>
    </Card>
    {showRolePage && <RolePage role={role} onClose={handleClose} />}
    </>
  );
};

export default RoleCard;
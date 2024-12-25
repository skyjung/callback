import * as React from "react";
import { Card } from "react-bootstrap";

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

const RoleCard: React.FC<{ role: Role; onCall: (roleId: string) => void; alreadySaved: boolean; posted:boolean; handleRemove?: (roleId: string) => void; }> = ({ role, onCall, alreadySaved, posted, handleRemove }) => {
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
    console.log("clicked");
    onCall(role.id);
  };
  return (
    <Card style={{ marginBottom: "10px", border: "2px solid #E70000", borderRadius: '0px', background: 'none', height: '400px', display: 'flex', flexDirection: 'column'}}>
      <div className="role-card-buttons">
        {posted ? 
          <button style={{border: "none", background: "transparent"}} onClick={() => handleRemove(role.id)}>
            <img
              src="/remove.svg"
              alt="X"
              style={{ height: "35px", objectFit: 'cover' }}
            />
          </button> :
          <>
            <button style={{border: "none", background: "transparent"}} onClick={handleCallClick}>
            <img
              src={alreadySaved ? "/unsave.svg" : "/save.svg"}
              alt={alreadySaved ? "unsave" : "save"}
              style={{ height: "35px", objectFit: 'cover' }}
            />
            </button>
            <button style={{border: "none", background: "transparent"}} onClick={handleContact}>
            <img
              src="/contact.svg"
              alt="contact"
              style={{ height: "35px", objectFit: 'cover' }}
            />
            </button>
          </>
          }   
        </div>
      <Card.Body>
        <Card.Title style={{color: '#E70000', fontWeight: 500, fontSize: 'x-large'}}>{role.name}</Card.Title>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px',  marginBottom: '0px'}}>
          <Card.Text className="role-card-text">Age Range: {role.ageRange ? `${role.ageRange.start} - ${role.ageRange.end}` : "Not specified"}</Card.Text>
          <Card.Text className="role-card-text">Ethnicity: {role.ethnicity || "Not specified"}</Card.Text>
          <Card.Text className="role-card-text">Description: {role.description || "Not specified"}</Card.Text>
          <Card.Text className="role-card-text">
            Filming Dates: {role.filmingDates ? `${formatDate(role.filmingDates.start)} - ${formatDate(role.filmingDates.end)}` : "Not specified"}
          </Card.Text>
          <Card.Text className="role-card-text">Location: {role.location || "Not specified"}</Card.Text>
          <Card.Text className="role-card-text">Nice-to-Have: {role.traits || "Not specified"}</Card.Text>
          <Card.Text className="role-card-text">Contact: {role.contact || "Not specified"}</Card.Text>
          <Card.Text className="role-card-text">Posted: {formatDate(role.createdAt) || "Not specified"}</Card.Text>
        </div>
        
        
      </Card.Body>
    </Card>
  );
};

export default RoleCard;
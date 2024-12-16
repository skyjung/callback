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

const RoleCard: React.FC<{ role: Role; onCall: (roleId: string) => void; alreadyCalled: boolean }> = ({ role, onCall, alreadyCalled }) => {
  const formatDate = (date: any): string => {
    if (!date) return "Not specified";
    if (date.seconds) {
      return new Date(date.seconds * 1000).toLocaleDateString();
    }
    return new Date(date).toLocaleDateString();
  };

  return (
    <Card style={{ marginBottom: "10px", border: "2px solid #E70000", borderRadius: '0px', background: 'none'}}>
      <Card.Body>
        <Card.Title style={{color: '#E70000', fontWeight: 500, fontSize: 'xx-large'}}>{role.name}</Card.Title>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px',  marginBottom: '10px'}}>
          <Card.Text style={{ marginBottom: 0 }}>Age Range: {role.ageRange ? `${role.ageRange.start} - ${role.ageRange.end}` : "Not specified"}</Card.Text>
          <Card.Text style={{ marginBottom: 0 }}>Ethnicity: {role.ethnicity || "Not specified"}</Card.Text>
          <Card.Text style={{ marginBottom: 0 }}>Description: {role.description || "Not specified"}</Card.Text>
          <Card.Text style={{ marginBottom: 0 }}>
            Filming Dates: {role.filmingDates ? `${formatDate(role.filmingDates.start)} - ${formatDate(role.filmingDates.end)}` : "Not specified"}
          </Card.Text>
          <Card.Text style={{ marginBottom: 0 }}>Location: {role.location || "Not specified"}</Card.Text>
          <Card.Text style={{ marginBottom: 0 }}>Nice-to-Have: {role.traits || "Not specified"}</Card.Text>
          <Card.Text style={{ marginBottom: 0 }}>Contact: {role.contact || "Not specified"}</Card.Text>
          <Card.Text style={{ marginBottom: 0 }}>Posted: {formatDate(role.createdAt) || "Not specified"}</Card.Text>
        </div>
        <button className="button" onClick={() => onCall(role.id)} disabled={alreadyCalled}>
          {alreadyCalled ? "Remove" : "Call"}
        </button>
      </Card.Body>
    </Card>
  );
};

export default RoleCard;
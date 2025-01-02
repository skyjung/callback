import * as React from "react";
import { Card } from "react-bootstrap";
import { Role } from "./RoleCard";
import { DateTime } from "luxon";

const RoleCardPreview: React.FC<{ roleProps: Role; }> = ({ roleProps }) => {

    const formatDate = (date: any): string => {
        if (!date) return "Not specified";

        const parsedDate = date.seconds
            ? DateTime.fromSeconds(date.seconds).setZone("local")
            : DateTime.fromISO(date).setZone("local");

        return parsedDate.toLocaleString(DateTime.DATE_SHORT);
        };
  return (
    <>
    <Card className="role-card" style={{background: 'none', boxShadow: 'none', border: '2px solid #E70000'}}>
      <div className="role-card-buttons">
            <button style={{ border: "none", background: "transparent" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <img
                  src={"/save.svg"}
                  alt={"save"}
                  style={{ height: "25px", objectFit: 'cover' }}
                />
                <span style={{ fontSize: "x-small", color: '#E70000' }}>{"Save"}</span>
              </div>
            </button>
            <button style={{ border: "none", background: "transparent" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <img
                  src="/contact.svg"
                  alt="contact"
                  style={{ height: "25px", objectFit: 'cover' }}
                />
                <span style={{ fontSize: "x-small", color: '#E70000'}}>Contact</span>
              </div>
            </button>
         
        </div>
      <Card.Body className="role-card-body">
        <Card.Title style={{color: '#E70000', fontWeight: 800, fontSize: 'xx-large', fontFamily: 'InstrumentSerif'}}>{roleProps.name}</Card.Title>
          <Card.Text className="role-card-text"><strong>Who: </strong> {roleProps.ageRange ? `${roleProps.ageRange.start} - ${roleProps.ageRange.end}` : "Not specified"}, {roleProps.ethnicity || "Not specified"} </Card.Text>
          <Card.Text className="role-card-text">
          <strong>When: </strong> {roleProps.filmingDates ? `${formatDate(roleProps.filmingDates.start)} - ${formatDate(roleProps.filmingDates.end)}` : "Not specified"}
          </Card.Text>
          <Card.Text className="role-card-text"><strong>Where: </strong>{roleProps.location || "Not specified"}</Card.Text>
          <Card.Text className="role-card-text"><strong>What: </strong> {roleProps.description || "Not specified"}</Card.Text>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', position: 'absolute', top: '220px', paddingRight: '5rem'}}>
          <Card.Text className="role-card-text" style={{display: 'flex', fontWeight: 500}}>Posted {formatDate(roleProps.createdAt) || "Not specified"}</Card.Text>    
          <Card.Text className="role-card-text" style={{display: 'flex', fontWeight: 500}}>Expires: {formatDate(roleProps.createdAt) || "Not specified"}</Card.Text>      
          </div>
      </Card.Body>
    </Card>
    </>
  );
};

export default RoleCardPreview;
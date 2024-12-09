import React from 'react';

interface ButtonProps {
  label: string;
  color: string;
  onClick: () => void;
}

const CustomButton: React.FC<ButtonProps> = ({ label, color, onClick }) => {
  return (
    <button
      className="btn"
      style={{
        backgroundColor: color,
        color: '#1D1D1D',
        fontWeight: 'bold',
        border: 'none',
      }}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default CustomButton;
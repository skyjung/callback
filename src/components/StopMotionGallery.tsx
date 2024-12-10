import React, { useEffect, useState } from "react";

interface Props {
  path: string;
  count: number; // Corrected to use TypeScript's `number` type instead of `Number`
}

const StopMotionGallery: React.FC<Props> = ({ path, count }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const pauseIcon = "/pause.svg";
  const playIcon = "/play.svg";

  const footerStyle: React.CSSProperties = {
    padding: "20px",
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % count);
      }, 500);
    }

    return () => clearInterval(interval);
  }, [isRunning, count]);

  const handleClick = () => {
    setIsRunning(!isRunning);
  };

  const renderImages = () => {
    const images = [];
    for (let i = 1; i <= count; i++) {
      console.log(`/${path}/${i}.jpg`);
      images.push(
        <img
          key={i}
          src={`/${path}/${i}.jpg`}
          alt={`image-${i}`}
          className={`frame ${i - 1 === currentIndex ? "visible" : ""}`}
          style={{
            width: "320px",
            height: "180px",
            objectFit: "cover",
            transform: i - 1 === currentIndex ? "scale(1)" : "scale(1)",
            transition: "transform 0.1s ease-in-out",
            zIndex: i - 1 === currentIndex ? 1 : 0,
            pointerEvents: i - 1 === currentIndex ? "auto" : "none",
          }}
          onMouseEnter={(e) => {
            if (!isRunning && i - 1 === currentIndex) {
              e.currentTarget.style.transform = "scale(1.6)";
              // e.currentTarget.style.width = "fit-content";
              e.currentTarget.style.maxWidth = "500px";
            }
          }}
          onMouseLeave={(e) => {
            if (!isRunning && i - 1 === currentIndex) {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.width = "320px";
              e.currentTarget.style.height = "180px";
            }
          }}
        />
      );
    }
    return images;
  };

  return (
    <div id="stopmotion-container">
      {renderImages()}
      <div style={footerStyle}>
        <button
          style={{
            border: "none",
            background: "transparent",
            float: "right",
          }}
          onClick={handleClick}
        >
          <img
            src={isRunning ? pauseIcon : playIcon}
            alt={isRunning ? "Pause" : "Play"}
            style={{ width: "35px", height: "35px" }}
          />
        </button>
      </div>
    </div>
  );
};

export default StopMotionGallery;
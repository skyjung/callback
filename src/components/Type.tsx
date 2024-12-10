import React, { useState } from "react";
import Typewriter from "typewriter-effect";

function Type() {
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  return (
    <>
      {!isTypingComplete ? (
        <Typewriter
          options={{
            strings: [
              "CALLBACK...",
            ],
            autoStart: true,
            loop: true, // Set loop to false
            deleteSpeed: 30,
          }}
          onInit={(typewriter) => {
            typewriter
              .typeString("CALLBACK...")
              .pauseFor(1000)
              .callFunction(() => {
                setIsTypingComplete(true);
              })
              .start();
          }}
        />
      ) : (
        <h1 className="Typewriter__wrapper" style={{fontWeight: 500, lineHeight:'1.5', whiteSpace: "nowrap",}}>
          CALLBACK ...
        </h1>
      )}
    </>
  );
}

export default Type;

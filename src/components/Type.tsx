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
              "callback",
            ],
            autoStart: true,
            loop: true, // Set loop to false
            deleteSpeed: 30,
          }}
          onInit={(typewriter) => {
            typewriter
              .typeString("callback")
              .pauseFor(1000)
              .callFunction(() => {
                setIsTypingComplete(true);
              })
              .start();
          }}
        />
      ) : (
        <p className="Typewriter__wrapper">
          callback<br></br>
        </p>
      )}
    </>
  );
}

export default Type;

import React from "react";
import { motion } from "framer-motion";

const PageWipe: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ translateY: "100%" }}
      animate={{ translateY: "0%" }}
      exit={{ translateY: "-100%" }}
      transition={{
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
      }}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "#1D1D1D", // Adjust based on your theme
        zIndex: 999,
        overflow: "hidden", // Prevent extra blank space
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageWipe;
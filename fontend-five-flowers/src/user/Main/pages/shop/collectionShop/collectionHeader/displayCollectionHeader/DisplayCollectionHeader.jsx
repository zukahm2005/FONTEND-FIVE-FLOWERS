import { motion } from "framer-motion";
import React, { useState } from "react";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { FaThList } from "react-icons/fa";
import "./displayCollection.scss";

const DisplayCollectionHeader = ({ onDisplayChange }) => {
  const [activeDisplay, setActiveDisplay] = useState("grid");

  const handleDisplayChange = (display) => {
    setActiveDisplay(display);
    onDisplayChange(display);
  };

  return (
    <div className="display-container">
      <motion.div
        className={`display-grid ${activeDisplay === "grid" ? "active" : ""}`}
        onClick={() => handleDisplayChange("grid")}
        animate={{
          backgroundColor: activeDisplay === "grid" ? "#fa422d" : "white",
        }}
      >
        <p>
          <BsFillGrid3X3GapFill className="icon" />
        </p>
      </motion.div>
      <motion.div
        className={`display-list ${activeDisplay === "list" ? "active" : ""}`}
        onClick={() => handleDisplayChange("list")}
        animate={{
          backgroundColor: activeDisplay === "list" ? "#fa422d" : "white",
        }}
      >
        <p>
          <FaThList className="icon" />
        </p>
      </motion.div>
    </div>
  );
};

export default DisplayCollectionHeader;

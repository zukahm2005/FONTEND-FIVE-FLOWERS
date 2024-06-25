import React, { useState } from "react";
import { motion } from "framer-motion";
import ApiSpecialHome from "./apiSpecialHome/ApiSpecialHome";
import "./special.scss";

const SpecialHome = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleHover = (index) => {
    setHoveredIndex(index);
  };

  return (
    <div className="special-home-container">
      <div className="special-home-features">
        <div className="special-features-main">
          <p>FEATURES</p>
        </div>
        <div className="special-feature-name">
          <p>Special Features</p>
        </div>
      </div>
      <div className="special-home-icon">
        {ApiSpecialHome.map((feature, index) => (
          <div
            key={feature.specialId}
            className="special-home-main"
            onMouseEnter={() => handleHover(index)}
          >
            <motion.div
              className="special-img"
              animate={hoveredIndex === index ? { rotateY: [0, 180, 0] } : { rotateY: 0 }}
              transition={{ duration: 1.5 }}
            >
              <img src={feature.specialIcon} alt={feature.specialTitle} />
            </motion.div>
            <div className="special-name">
              <h3>{feature.specialTitle}</h3>
            </div>
            <div className="special-content">
              <p>{feature.specialDescription}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpecialHome;

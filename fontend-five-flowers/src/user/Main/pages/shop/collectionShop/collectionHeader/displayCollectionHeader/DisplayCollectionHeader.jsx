import React from "react";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { FaThList } from "react-icons/fa";
import "./displayCollection.scss";

const DisplayCollectionHeader = ({ onDisplayChange }) => {
  return (
    <div className="display-container">
      <div className="display-grid" onClick={() => onDisplayChange("grid")}>
        <p>
          <BsFillGrid3X3GapFill />
        </p>
      </div>
      <div className="display-list" onClick={() => onDisplayChange("list")}>
        <p>
          <FaThList />
        </p>
      </div>
    </div>
  );
};

export default DisplayCollectionHeader;

import React from "react";
import { Link } from "react-router-dom";
import "./component.scss";
const Component = () => {
  return (
    <div className="component-container">
      <div className="component-main">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
};

export default Component;

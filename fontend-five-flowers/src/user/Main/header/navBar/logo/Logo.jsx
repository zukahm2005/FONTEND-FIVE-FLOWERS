import React from "react";
import { Link } from "react-router-dom";
import "./login.scss";
const Logo = () => {
  return (
    <div className="logo-container">
      <Link to="/">
        <img
          src="/logoeco.png"
          alt="logo"
        />
      </Link>
    </div>
  );
};

export default Logo;

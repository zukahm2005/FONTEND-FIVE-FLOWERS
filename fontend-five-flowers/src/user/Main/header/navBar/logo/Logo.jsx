import React from "react";
import { Link } from "react-router-dom";
import "./login.scss";
const Logo = () => {
  return (
    <div className="logo-container">
      <Link to="/">
        <img
          src="https://bikex-club.myshopify.com/cdn/shop/files/logo_1_300x300.png?v=1629277962"
          alt=""
        />
      </Link>
    </div>
  );
};

export default Logo;

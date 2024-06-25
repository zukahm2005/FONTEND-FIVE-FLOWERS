import React from "react";
import Component from "./components/Component";
import "./header.scss";
import Logo from "./logo/Logo";
import NavBar from "./navBar/NavBar";
const Header = () => {
  return (
    <div className="header-container">
      <div className="header-main">
        <div className="header-logo">
          <Logo />
        </div>
        <div className="header-navBar">
          <NavBar />
        </div>
        <div className="header-components">
          <Component />
        </div>
      </div>
    </div>
  );
};

export default Header;

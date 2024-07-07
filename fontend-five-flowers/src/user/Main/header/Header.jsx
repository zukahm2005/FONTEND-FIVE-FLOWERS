import { Drawer } from 'antd';
import React, { useState } from "react";
import Component from "./components/Component";
import "./header.scss";
import NavBar from "./navBar/NavBar";
import Logo from "./navBar/logo/Logo";
const Header = ({ cart }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerContent, setDrawerContent] = useState(null);

  const showDrawer = (content) => {
    setDrawerContent(content);
    setDrawerVisible(true);
  };

  const onClose = () => {
    setDrawerVisible(false);
  };

  return (
    <div className="header-container">
      <div className="header-main">
        <div className="header-logo">
          <Logo />
        </div>
        <div className="header-pages">
          <NavBar />
        </div>
        <div className="header-components">
          <Component showDrawer={showDrawer} cart={cart} />
        </div>
      </div>
      <Drawer
        placement="right"
        onClose={onClose}
        visible={drawerVisible}
      >
        {drawerContent}
      </Drawer>
    </div>
  );
};

export default Header;

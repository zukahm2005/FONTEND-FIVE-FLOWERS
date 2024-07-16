import { MenuOutlined } from '@ant-design/icons';
import { Drawer } from 'antd';
import React, { useState } from "react";
import Component from "./components/Component";
import "./header.scss";
import NavBar from "./navBar/NavBar";
import Logo from "./navBar/logo/Logo";

const Header = ({ cart }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerContent, setDrawerContent] = useState(null);
  const [menuDrawerVisible, setMenuDrawerVisible] = useState(false);

  const showDrawer = (content) => {
    setDrawerContent(content);
    setDrawerVisible(true);
  };

  const onClose = () => {
    setDrawerVisible(false);
  };

  const toggleMenuDrawer = () => {
    setMenuDrawerVisible(!menuDrawerVisible);
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
          <MenuOutlined className="header-menu-icon" onClick={toggleMenuDrawer} />
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
      <Drawer
        placement="right"
        onClose={toggleMenuDrawer}
        visible={menuDrawerVisible}
      >
        <NavBar />
      </Drawer>
    </div>
  );
};

export default Header;

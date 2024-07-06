import { Dropdown, Menu } from 'antd';
import React, { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { CgProfile } from "react-icons/cg";
import { MdAccountCircle } from "react-icons/md";
import Cart from "./cart/Cart";
import { CartContext } from './cart/cartContext/CartProvider';
import "./component.scss";
import IconContextCart from "./iconContextCart/IconContextCart";
import Profile from "./profile/Profile";

const Component = ({ showDrawer, cart }) => {
  const { isLoggedIn, logout } = useContext(CartContext);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleMenuClick = (e) => {
    if (e.key === 'logout') {
      logout();
    } else if (e.key === 'profile') {
      navigate('/cart-user'); // Navigate to /cart-user page
    }
    setVisible(false);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="profile">Profile</Menu.Item>
      <Menu.Item key="logout">Logout</Menu.Item>
    </Menu>
  );

  return (
    <div className="component-container">
      <div className="profile-component-container">
        {isLoggedIn ? (
          <Dropdown overlay={menu} trigger={['click']}>
            <MdAccountCircle style={{ fontSize: '30px', cursor: 'pointer' }} />
          </Dropdown>
        ) : (
          <div onClick={() => showDrawer(<Profile />)}>
            <CgProfile style={{ fontSize: '24px', cursor: 'pointer' }} />
          </div>
        )}
      </div>
      <div className="cart-component-container" onClick={() => showDrawer(<Cart cart={cart} />)}>
        <IconContextCart />
      </div>
    </div>
  );
};

export default Component;

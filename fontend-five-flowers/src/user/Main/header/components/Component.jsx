import { Dropdown, Menu } from 'antd';
import React, { useContext, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { MdAccountCircle } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import Cart from "./cart/Cart";
import { CartContext } from './cart/cartContext/CartProvider';
import "./component.scss";
import IconContextCart from "./iconContextCart/IconContextCart";
import Profile from "./profile/Profile";

const Component = ({ showDrawer, cart }) => {
  const { isLoggedIn, logout } = useContext(CartContext);
  const [selectedKey, setSelectedKey] = useState('');
  const navigate = useNavigate();

  const handleMenuClick = (e) => {
    setSelectedKey(e.key); // Set selectedKey khi người dùng click vào mục
    if (e.key === 'logout') {
      logout();
    } else if (e.key === 'profile') {
      navigate('/cart-user');
    } else if (e.key === 'your-bike') {
      navigate('/your-bike');
    } else if (e.key === 'practice') {
      navigate('/practice');
    } else if (e.key === 'chat-window') {
      navigate('/chat-window'); // Điều hướng đến trang Trip Planner
    }else if (e.key === 'profile-user') {
      navigate('/profile-user'); // Điều hướng đến trang Trip Planner
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick} selectedKeys={[selectedKey]} className="dropdown-menu">
      <Menu.Item key="profile-user">Profile</Menu.Item>
      <Menu.Item key="profile">Orders</Menu.Item>
      <Menu.Item key="chat-window">Trip Planner</Menu.Item> 
      <Menu.Item key="your-bike">Your Bike</Menu.Item>
      <Menu.Item key="practice">Practice</Menu.Item>
      <Menu.Item key="logout">Logout</Menu.Item>
    </Menu>
  );

  return (
    <div className="component-container">
      <div className="profile-component-container">
        {isLoggedIn ? (
          <Dropdown overlay={menu} trigger={['click']} placement="bottomCenter">
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

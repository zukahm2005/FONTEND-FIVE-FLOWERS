import React from "react";
import Cart from "./cart/Cart";
import "./component.scss";
import IconContextCart from "./iconContextCart/IconContextCart";
import IconContextProfile from "./iconContextProfile/iconContextProfile";
import Profile from "./profile/Profile";
const Component = ({ showDrawer, cart }) => {
  return (
    <div className="component-container">
      <div
        className="profile-component-container"
        onClick={() => showDrawer(<Profile />)}
      >
        <p>
          <IconContextProfile />
        </p>
      </div>
      <div
        className="cart-component-container"
        onClick={() => showDrawer(<Cart  cart={cart}  />)}
      >
        <p>
          {" "}
          <IconContextCart />
        </p>
      </div>
    </div>
  );
};
export default Component;

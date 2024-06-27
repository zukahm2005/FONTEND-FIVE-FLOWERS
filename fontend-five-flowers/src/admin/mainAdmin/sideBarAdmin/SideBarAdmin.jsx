import React from "react";
import { Link } from "react-router-dom";
import "./sideBarAdmin.scss"; // Đảm bảo rằng bạn có file CSS cho thành phần này

const SideBarAdmin = () => {
  return (
    <div className="sidebar-container-admin">
      <div className="side-bar-admin-link">
        <Link to="address">Address</Link>
      </div>
      <div className="side-bar-admin-link">
        <Link to="blog">Blog</Link>
      </div>
      <div className="side-bar-admin-link">
        <Link to="product">Product</Link>
      </div>
      <div className="side-bar-admin-link">
        <Link to="brand">Brand</Link>
      </div>
      <div className="side-bar-admin-link">
        <Link to="category">Category</Link>
      </div>
    </div>
  );
};

export default SideBarAdmin;

import { motion } from "framer-motion";
import React from "react";
import { AiOutlineProduct } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { BsCart2 } from "react-icons/bs";
import { MdOutlineHome } from "react-icons/md";
import { RiBloggerLine } from "react-icons/ri";
import { TbAddressBook, TbBrandAirbnb } from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";
import "./sideBarAdmin.scss"; // Đảm bảo rằng bạn có file CSS cho thành phần này
import { MdPayment } from "react-icons/md";

const SideBarAdmin = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="sidebar-container-admin">

      {/* ==== home ======= */}
      <Link to="home">
        <motion.div
          className={`side-bar-admin-link ${isActive("home") ? "active" : ""}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="side-bar-admin-icon">
            <p>
              <MdOutlineHome />
            </p>
          </div>
          <div className="side-bar-admin-page">
            <p>Home</p>
          </div>
        </motion.div>
      </Link>

      {/* ==== product ======= */}
      <Link to="product">
        <motion.div
          className={`side-bar-admin-link ${isActive("product") ? "active" : ""}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="side-bar-admin-icon">
            <p>
              <AiOutlineProduct />
            </p>
          </div>
          <div className="side-bar-admin-page">
            <p>Product</p>
          </div>
        </motion.div>
      </Link>

      {/* ==== address ======= */}
      <Link to="address">
        <motion.div
          className={`side-bar-admin-link ${isActive("address") ? "active" : ""}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="side-bar-admin-icon">
            <p>
              <TbAddressBook />
            </p>
          </div>
          <div className="side-bar-admin-page">
            <p>Address</p>
          </div>
        </motion.div>
      </Link>

      {/* ==== blog ======= */}
      <Link to="blog">
        <motion.div
          className={`side-bar-admin-link ${isActive("blog") ? "active" : ""}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="side-bar-admin-icon">
            <p>
              <RiBloggerLine />
            </p>
          </div>
          <div className="side-bar-admin-page">
            <p>Blog</p>
          </div>
        </motion.div>
      </Link>
     
      {/* ==== brand ======= */}
      <Link to="brand">
        <motion.div
          className={`side-bar-admin-link ${isActive("brand") ? "active" : ""}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="side-bar-admin-icon">
            <p>
              <TbBrandAirbnb />
            </p>
          </div>
          <div className="side-bar-admin-page">
            <p>Brand</p>
          </div>
        </motion.div>
      </Link>

      {/* ==== category ======= */}
      <Link to="category">
        <motion.div
          className={`side-bar-admin-link ${isActive("category") ? "active" : ""}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="side-bar-admin-icon">
            <p>
              <BiCategory />
            </p>
          </div>
          <div className="side-bar-admin-page">
            <p>Category</p>
          </div>
        </motion.div>
      </Link>
      <Link to="orders">
        <motion.div
          className={`side-bar-admin-link ${isActive("orders") ? "active" : ""}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="side-bar-admin-icon">
            <p>
            <BsCart2 />
            </p>
          </div>
          <div className="side-bar-admin-page">
            <p>Order</p>
          </div>
        </motion.div>
      </Link>
      <Link to="payment">
        <motion.div
          className={`side-bar-admin-link ${isActive("payment") ? "active" : ""}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="side-bar-admin-icon">
            <p>
            <MdPayment />
            </p>
          </div>
          <div className="side-bar-admin-page">
            <p>Payment</p>
          </div>
        </motion.div>
      </Link>
    </div>
  );
};

export default SideBarAdmin;

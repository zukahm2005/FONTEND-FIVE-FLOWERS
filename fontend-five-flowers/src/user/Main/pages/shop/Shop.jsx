import React from "react";
import { Link } from "react-router-dom";
import "./shop.scss";
const Shop = () => {
  return (
    <div className="shop-container">
      <div className="top-shop-container">
        <div className="name-top-shop-container">
          <h1>COLLECTION</h1>
        </div>
        <div className="name-bottom-shop-container">
          <div className="home-name-bsc">
            <Link to="/"><p>Home</p></Link>
          </div>
          <span className="breadcrumb__sep"><p>/</p></span>
          <p>Products</p>
        </div>
      </div>
      <div className="background-bot-shop-container">
        <div className="bot-shop-container">
        </div>
      </div>
    </div>
  );
};

export default Shop;

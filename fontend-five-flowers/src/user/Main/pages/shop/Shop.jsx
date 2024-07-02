import React from "react";
import { Link } from "react-router-dom";
import CollectionGrid from "./collectionShop/collectionGrid/CollectionGrid";
import CollectionHeader from "./collectionShop/collectionHeader/CollectionHeader";
import "./shop.scss";
import SideBarShop from "./sideBarShop/SideBarShop";
const Shop = () => {
  return (
    <div className="shop-container">
      <div className="top-shop-container">
        <div className="name-top-shop-container">
          <h1>COLLECTION</h1>
        </div>
        <div className="name-bottom-shop-container">
          <div className="home-name-bsc">
            <Link to="/">
              <p>Home</p>
            </Link>
          </div>
          <span className="breadcrumb__sep">
            <p>/</p>
          </span>
          <p>Products</p>
        </div>
      </div>
      <div className="background-bot-shop-container">
        <div className="bot-shop-container">
          <div className="sidebar-shop-container">
            <SideBarShop />
          </div>
          <div className="collection-grid-container">
            <div className="header-collection-grid-container">
              <CollectionHeader />
            </div>
            <div className="botton-collection-grid-container">
              <CollectionGrid />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;

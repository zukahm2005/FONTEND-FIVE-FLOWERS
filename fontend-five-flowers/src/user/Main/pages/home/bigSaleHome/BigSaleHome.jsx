import React from "react";
import { Link } from "react-router-dom";
import "./bigSaleHome.scss";

const BigSaleHome = () => {
  return (
    <div className="big-sale-container">
      <div className="info-big-sale-container">
        <div className="name-big-sale">
          <p>BIG SALE</p>
        </div>
        <div className="title-big-sale">
          <p>NEW BIKE BY MANUFACTURES BIKO</p>
        </div>
        <div className="button-big-sale">
          <button>
          <Link to="/shop"><p>BUY NOW</p></Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BigSaleHome;

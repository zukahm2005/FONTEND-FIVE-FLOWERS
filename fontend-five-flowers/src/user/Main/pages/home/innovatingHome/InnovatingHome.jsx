import React from "react";
import { Link } from "react-router-dom";
import "./innovatingHome.scss";

const InnovatingHome = () => {
  return (
    <div className="innova-home-container">
      <div className="innova-home-img">
        <div className="inova-img">
          <img
            src="https://bikex-club.myshopify.com/cdn/shop/files/img-1_95a20f74-3471-4d98-a190-e2a7cd3f7e26_1000X_1_1512x.jpg?v=1614290800"
            alt="Innovating to reimagine riding bicycle"
          />
        </div>
      </div>
      <div className="innova-home-content">
        <div className="innova-name">
          <p>Innovating to reimagine riding bicycle</p>
        </div>
        <div className="innova-content">
          <p>
          Discover how we innovate to reimagine the cycling experience. With advanced designs and cutting-edge technology, we offer a more comfortable and efficient way to ride. Join us as we step into the future of cycling, where every journey is remarkable and unforgettable.
          </p>
        </div>
        <div className="innova-button">
          <button>
            <Link to="/shop">
              <p>BUY NOW</p>
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InnovatingHome;

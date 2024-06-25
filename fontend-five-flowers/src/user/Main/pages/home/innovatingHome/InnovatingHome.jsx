import React from "react";
import "./innovatingHome.scss";

const InnovatingHome = () => {
  return (
    <div className="innova-home-container">
      <div className="innova-home-img">
        <div className="inova-img">
          <img
            src="https://bikex-club.myshopify.com/cdn/shop/files/img-1_95a20f74-3471-4d98-a190-e2a7cd3f7e26_1000X_1_1512x.jpg?v=1614290800"
            alt=""
          />
        </div>
      </div>
      <div className="innova-home-content">
        <div className="innova-name">
          <p>Innovating to reimagine riding bicycle</p>
        </div>
        <div className="innova-content">
          <p>
            Phasellus eget condimentum nibh. Nunc id enim id velit commodo
            efficitur. Duis auctor, mauris in maximus cursus, purus neque
            ultricies velit Vivamus a turpis nisi. Fusce feugiat feugiat congue
            in mauris id sollicitudin.
          </p>
        </div>
        <div className="innova-button">
          <button>
            <p>BUY NOW</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InnovatingHome;

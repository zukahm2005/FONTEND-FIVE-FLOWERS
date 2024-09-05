import React from "react";
import "./bikeWithHotspots.scss";

const BikeWithHotspots = () => {
  return (
    <div className="bike-container">
      <img src="https://bikex-club.myshopify.com/cdn/shop/files/img-2_232fd66a-cc99-4806-8f20-8caee377e128_1_2048x.jpg?v=1614290801" alt="Bike" className="bike-image" />

      <div className="hotspot hotspot-1">
        <div className="tooltip">FRONT BASKET<br />Double butted alloy, 5 degree back sweep, 25mm</div>
      </div>

      <div className="hotspot hotspot-2">
        <div className="tooltip">COMFORT SEAT<br />Smooth & Comfort</div>
      </div>

      <div className="hotspot hotspot-3">
        <div className="tooltip">HANDLE BARS<br />Double butted alloy, 5 degree back sweep, 25mm</div>
      </div>

      <div className="hotspot hotspot-4">
        <div className="tooltip">BACK TYRE<br />Corsa Control, TLR 30mm</div>
      </div>

      <div className="hotspot hotspot-5">
        <div className="tooltip">PEDALS<br />Corsa Control, TLR 30mm</div>
      </div>

      {/* Các điểm đánh dấu bổ sung */}
      <div className="hotspot hotspot-6">
        <div className="tooltip">BACK CARRIER<br />Sturdy Aluminium Frame</div>
      </div>

      <div className="hotspot hotspot-7">
      <div className="tooltip">FRONT TYRE<br />Corsa Control</div>
      </div>

      <div className="hotspot hotspot-8">
        <div className="tooltip">CHAIN PINEUL<br />Durable Steel Chain</div>
      </div>

     
    </div>
  );
};

export default BikeWithHotspots;

import { motion } from "framer-motion";
import React from "react";
import "./bikeWithHotspots.scss";

const BikeWithHotspots = () => {
  return (
    <div className="bike-container">
      <img 
        src="https://bikex-club.myshopify.com/cdn/shop/files/img-2_232fd66a-cc99-4806-8f20-8caee377e128_1_2048x.jpg?v=1614290801" 
        alt="Bike" 
        className="bike-image1" 
      />

      <motion.div className="hotspot hotspot-1">
        <span className="pulse"></span>
        <div className="tooltip">
          FRONT BASKET
          <br />
          Double butted alloy, 5 degree back sweep, 25mm
        </div>
      </motion.div>

      <motion.div className="hotspot hotspot-2">
        <span className="pulse"></span>
        <div className="tooltip">
          COMFORT SEAT
          <br />
          Smooth & Comfort
        </div>
      </motion.div>

      <motion.div className="hotspot hotspot-3">
        <span className="pulse"></span>
        <div className="tooltip">
          HANDLE BARS
          <br />
          Double butted alloy, 5 degree back sweep, 25mm
        </div>
      </motion.div>

      <motion.div className="hotspot hotspot-4">
        <span className="pulse"></span>
        <div className="tooltip">
          BACK TYRE
          <br />
          Corsa Control, TLR 30mm
        </div>
      </motion.div>

      <motion.div className="hotspot hotspot-5">
        <span className="pulse"></span>
        <div className="tooltip">
          PEDALS
          <br />
          Corsa Control, TLR 30mm
        </div>
      </motion.div>

      {/* Các điểm đánh dấu bổ sung */}
      <motion.div className="hotspot hotspot-6">
        <span className="pulse"></span>
        <div className="tooltip">
          BACK CARRIER
          <br />
          Sturdy Aluminium Frame
        </div>
      </motion.div>

      <motion.div className="hotspot hotspot-7">
        <span className="pulse"></span>
        <div className="tooltip">
          FRONT TYRE
          <br />
          Corsa Control
        </div>
      </motion.div>

      <motion.div className="hotspot hotspot-8">
        <span className="pulse"></span>
        <div className="tooltip">
          CHAIN PINEUL
          <br />
          Durable Steel Chain
        </div>
      </motion.div>
    </div>
  );
};

export default BikeWithHotspots;

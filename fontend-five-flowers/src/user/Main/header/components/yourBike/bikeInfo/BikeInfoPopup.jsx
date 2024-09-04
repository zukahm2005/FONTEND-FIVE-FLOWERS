import React from 'react';
import './BikeInfoPopup.scss';

const BikeInfoPopup = ({ bike, coordinates }) => {
  console.log('Rendering BikeInfoPopup with:', bike, coordinates); // Add this line

  return (
    <div className="bike-info-popup">
      <img src={`http://localhost:8080/api/v1/images/${bike.imageUrl}`} alt={bike.name} className="bike-image" />
      <h3>{bike.name}</h3>
      <p>Tọa độ: {coordinates.latitude}, {coordinates.longitude}</p>
    </div>
  );
};

export default BikeInfoPopup;

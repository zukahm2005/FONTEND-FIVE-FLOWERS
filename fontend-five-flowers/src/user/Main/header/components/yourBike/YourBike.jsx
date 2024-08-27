import React, { useState } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { GrBike } from "react-icons/gr";
import './yourBike.scss';  // Import file CSS của bạn

const YourBike = () => {
  const [viewState, setViewState] = useState({
    longitude: 105.8542,
    latitude: 21.0285,
    zoom: 13
  });

  return (
    <div className="map-container">
      <Map
        {...viewState}
        style={{ width: '50%', height: '500px' }}  // Đảm bảo rằng chiều cao và chiều rộng được thiết lập chính xác
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onMove={evt => setViewState(evt.viewState)}
        mapboxAccessToken="pk.eyJ1IjoienVrYWhtMms1IiwiYSI6ImNtMGNvb2wwZzAwdTcybHM2ODFpZ3p3Z3MifQ.UPYPfCuIQeqUWDyt1SspVQ"  // Sử dụng đúng token
        className="small-map-container"
      >
        <Marker longitude={105.8542} latitude={21.0285}>
          <div className="custom-bike-icon">
            <GrBike />
          </div>
        </Marker>
        <NavigationControl position="top-left" />
      </Map>
    </div>
  );
};

export default YourBike;

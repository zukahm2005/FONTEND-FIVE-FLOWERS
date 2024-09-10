import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDirections, { addWaypoint } from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
import './Service.css'; // Nhập file CSS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiamondTurnRight, faTimes } from '@fortawesome/free-solid-svg-icons';

const MAPBOX_TOKEN = 'pk.eyJ1IjoienVrYWhtMms1IiwiYSI6ImNtMGNvb2wwZzAwdTcybHM2ODFpZ3p3Z3MifQ.UPYPfCuIQeqUWDyt1SspVQ'; // Thay thế bằng token Mapbox của bạn

mapboxgl.accessToken = MAPBOX_TOKEN;

function Service() {
  const [showClearButton, setShowClearButton] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null); // Thêm state

  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [directions, setDirections] = useState(null);
  const mapContainer = useRef(null);
  const [currentPopup, setCurrentPopup] = useState(null);

  const startPoint = { latitude: 21.028511, longitude: 105.782096, name: 'Điểm bắt đầu' };

  const fixedPoints = [
    { latitude: 21.02434, longitude: 105.78721, name: 'DỊCH VỤ XE ĐẠP TẠI TOAN THANG CYCLES' },
    { latitude: 21.02220, longitude: 105.77870, name: 'Dịch vụ sửa chữa bảo dưỡng xe đạp thể thao' },
    { latitude: 21.02863, longitude: 105.77218, name: 'sửa chữa bảo dưỡng xe đạp CX-C10 chuyên nghiệp' },
    { latitude: 21.0297, longitude: 105.7833, name: 'Dịch vụ bảo trì - bảo dưỡng cho xe đạp tại XEDAP.VN' },
    { latitude: 21.03043, longitude: 105.77172, name: 'DỊCH VỤ SỬA CHỮA XE ĐẠP LƯU ĐỘNG (BIKE SOS)' },
    { latitude: 21.03411, longitude: 105.77499, name: 'Dịch Vụ Sửa Chữa Bảo Dưỡng Xe Đạp Chuyên Nghiệp Tại XE ĐẠP 88' },
    { latitude: 21.02586, longitude: 105.77328, name: ' Cửa hàng xe đạp New way' },
    { latitude: 21.0264, longitude: 105.7801, name: 'An Tôn bike store' },
    { latitude: 21.03331, longitude: 105.78488, name: 'Cửa hàng xe đạp Thống Nhất' },
    { latitude: 21.0289, longitude: 105.7894, name: 'Cửa hàng sửa xe đạp 32C Lý Nam Đế' },
  ];

  const addWaypoint = (longitude, latitude, color) => {
    new mapboxgl.Marker({ color })
      .setLngLat([longitude, latitude])
      .addTo(mapRef.current);
  };

  useEffect(() => {
    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [startPoint.longitude, startPoint.latitude],
      zoom: 15,
    });

    mapRef.current = mapInstance;
    setMap(mapInstance);

    const directionsInstance = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',
      profile: 'mapbox/cycling',
      interactive: false // Ngăn không cho chọn điểm bằng cách click vào map
    });

    setDirections(directionsInstance);

    addWaypoint(startPoint.longitude, startPoint.latitude, 'blue');


    mapInstance.off('click');
    // Add directions control to the map
    mapInstance.addControl(directionsInstance, 'top-right');

    // Add marker with label function
    const addMarkerWithLabel = (longitude, latitude, name, color) => {
      const marker = new mapboxgl.Marker({ color })
        .setLngLat([longitude, latitude])
        .addTo(mapInstance);

      const labelEl = document.createElement('div');
      labelEl.className = 'custom-label';
      labelEl.textContent = name;

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 25,
      })
        .setLngLat([longitude, latitude])
        .setDOMContent(labelEl)
        .addTo(mapInstance);
    };

    mapInstance.on('load', () => {
      fixedPoints.forEach((point, index) => {
        addMarkerWithLabel(point.longitude, point.latitude, `${point.name}`, 'red');
      });

      const nav = new mapboxgl.NavigationControl({
        visualizePitch: true,
      });
      mapInstance.addControl(nav, 'bottom-left');
    });

    // Add an event listener on the directions instance for 'route'
    directionsInstance.on('route', () => {
      const routeLayerId = mapInstance.getLayer('directions-route-line');
      if (routeLayerId) {
        mapInstance.setPaintProperty('directions-route-line', 'line-color', '#0000FF');
      }
    });

    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);

  const handleDirections = (latitude, longitude) => {
    if (directions) {
      directions.setOrigin([startPoint.longitude, startPoint.latitude]);
      directions.setDestination([longitude, latitude]);
      setShowClearButton(true);
    }
  };

  const handleRemoveDirections = () => {
    if (map && directions) {
      map.flyTo({
        center: [startPoint.longitude, startPoint.latitude],
        zoom: 15,
      });
      directions.removeRoutes();
      setShowClearButton(false);
    }
  };

  const handleDestinationChange = (latitude, longitude, name) => {
    if (map && directions) {
      if (currentPopup) {
        currentPopup.remove();
      }
      
      map.flyTo({
        center: [longitude, latitude],
        zoom: 15,
      });
      
      const popup = new mapboxgl.Popup()
      setCurrentPopup(popup);
      setSelectedPoint({ latitude, longitude, name }); // Cập nhật điểm đến được chọn
    }
  };


  return (
    <div style={{ display: 'flex', margin: '5% 3%  1.2% 2%' }}>
      {/* Sidebar */}
      <div className="sidebar">
        <h3>Nearest service workshop: </h3>
        <ul>
          {fixedPoints.map((point, index) => (
            <li key={index}>
              <span onClick={() => handleDestinationChange(point.latitude, point.longitude, point.name)}>
                {`${point.name}`}
              </span>
              <span onClick={() => handleDirections(point.latitude, point.longitude)}>
                <FontAwesomeIcon icon={faDiamondTurnRight} style={{ fontSize: '24px', paddingLeft:'10px' }} />
              </span>
            </li>
          ))}
        </ul>
        {showClearButton && (
          <button onClick={handleRemoveDirections} className="remove-directions-btn">
            Remove Instruction <FontAwesomeIcon icon={faTimes} style={{ fontSize: '24px', paddingLeft:'20px'}}/>
          </button>
        )}
      </div>

      {/* Bản đồ */}
      <div ref={mapContainer} className="map-container2" />

      {selectedPoint && (
        <div className="destination-details">
          <h4>Chi tiết điểm đến</h4>
          <p>{selectedPoint.name}</p>
          <span onClick={() => handleDirections(selectedPoint.latitude, selectedPoint.longitude)}>
            <FontAwesomeIcon icon={faDiamondTurnRight} style={{ fontSize: '24px' }}/>
          </span>
          <p>Tọa độ: {selectedPoint.latitude}, {selectedPoint.longitude}</p>
          <button onClick={() => setSelectedPoint(null)}>Đóng</button>
        </div>
      )}


    </div>
  );
}

export default Service;

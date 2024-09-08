import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
import './Service.css'; // Nhập file CSS

const MAPBOX_TOKEN = 'pk.eyJ1IjoienVrYWhtMms1IiwiYSI6ImNtMGNvb2wwZzAwdTcybHM2ODFpZ3p3Z3MifQ.UPYPfCuIQeqUWDyt1SspVQ'; // Thay thế bằng token Mapbox của bạn

mapboxgl.accessToken = MAPBOX_TOKEN;

function Service() {
  const mapRef = useRef(null); // Tham chiếu đến bản đồ
  const [map, setMap] = useState(null);
  const [directions, setDirections] = useState(null); // Lưu đối tượng MapboxDirections
  const mapContainer = useRef(null); // Tham chiếu đến container của bản đồ
  const [currentPopup, setCurrentPopup] = useState(null); // Tham chiếu đến popup hiện tại

  // Điểm bắt đầu
  const startPoint = { latitude: 21.028511, longitude: 105.782096, name: 'Điểm bắt đầu' };

  // Mảng các điểm cố định
  const fixedPoints = [
    { latitude: 21.0307, longitude: 105.7810, name: 'Point 1' },
    { latitude: 21.0357, longitude: 105.7802, name: 'Point 2' },
    { latitude: 21.0206, longitude: 105.7976, name: 'Point 3' },
    { latitude: 21.0297, longitude: 105.7833, name: 'Point 4' },
    { latitude: 21.0222, longitude: 105.8001, name: 'Point 5' },
    { latitude: 21.0349, longitude: 105.7753, name: 'Point 6' },
    { latitude: 21.0389, longitude: 105.7888, name: 'Point 7' },
    { latitude: 21.0264, longitude: 105.7801, name: 'Point 8' },
    { latitude: 21.0322, longitude: 105.7812, name: 'Point 9' },
    { latitude: 21.0289, longitude: 105.7894, name: 'Point 10' },
  ];

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
      profile: 'mapbox/driving', // Hoặc "mapbox/walking" nếu bạn muốn dùng profile khác
    });
  
    setDirections(directionsInstance);
  

    // Thêm điều hướng vào bản đồ
    mapInstance.addControl(directionsInstance, 'top-right'); 
  
    mapInstance.on('load', () => {
      new mapboxgl.Marker({ color: 'blue' })
        .setLngLat([startPoint.longitude, startPoint.latitude])
        .setPopup(new mapboxgl.Popup().setText(`${startPoint.name} - Vị trí bắt đầu`))
        .addTo(mapInstance);
  
      fixedPoints.forEach((point, index) => {
        new mapboxgl.Marker({ color: 'red' })
          .setLngLat([point.longitude, point.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setText(`${point.name} - Vị trí cố định ${index + 1}`)
              .setMaxWidth('none')
              .addTo(mapInstance)
          )
          .addTo(mapInstance);
      });
  
      const nav = new mapboxgl.NavigationControl({
        visualizePitch: true,
      });
  
      mapInstance.addControl(nav, 'top-left');
    });
  
    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);
  

  const handleDirections = (latitude, longitude) => {
    if (directions) {
      // Đặt điểm xuất phát từ vị trí bắt đầu (startPoint)
      directions.setOrigin([startPoint.longitude, startPoint.latitude]);
      // Đặt điểm đến từ điểm đã chọn
      directions.setDestination([longitude, latitude]);
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
        .setLngLat([longitude, latitude])
        .setText(name)
        .addTo(map);

      setCurrentPopup(popup);

      handleDirections(latitude, longitude);
    }
  };

  return (
    <div style={{ display: 'flex', margin: '5% auto' }}>
      {/* Sidebar */}
      <div className="sidebar">
        <h3>Chọn điểm đến:</h3>
        <ul>
          {fixedPoints.map((point, index) => (
            <li key={index}>
              <span onClick={() => handleDestinationChange(point.latitude, point.longitude, point.name)}>
                {`${point.name}`}
              </span>
              <span onClick={() => handleDirections(point.latitude, point.longitude)}> chi duong</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bản đồ */}
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default Service;

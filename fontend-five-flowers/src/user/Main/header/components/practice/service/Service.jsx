import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDirections, { addWaypoint } from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
import './Service.scss'; // Nhập file CSS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiamondTurnRight, faTimes, faEarthAmericas } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

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
    {
      latitude: 21.02434, longitude: 105.78721, name: 'BICYCLE SERVICES AT TOAN THANG CYCLES', links: 'https://shopxedap.vn/thong-tin/dich-vu-xe-dap/',
      description: 'TOAN THANG CYCLES provides services in Ho Chi Minh City, Hanoi, Da Nang: Maintenance, repairs, adjustments, and bicycle upgrades.'
    },
    {
      latitude: 21.02220, longitude: 105.77870, name: 'Sports Bicycle Repair and Maintenance Service', links: 'https://www.oliverscycles.com/articles/bike-service-repair-pg262.htm',
      description: 'Nowadays, finding a bicycle repair shop is not easy. As the largest bicycle retail chain in the country, XEDAP.VN has a team of experienced technicians...'
    },
    {
      latitude: 21.02863, longitude: 105.77218, name: 'CX-C10 Professional Bicycle Repair and Maintenance', links: 'https://hanoibike.net/products/gia-sua-chua-bao-duong-xe-dap-cx-c10-chuyen-nghiep',
      description: 'Bicycle stands for professional repair and maintenance. Acts like a mobile repair station, easy to move. Used for hanging bicycles during repair for convenience.'
    },
    {
      latitude: 21.0297, longitude: 105.7833, name: 'Bicycle Maintenance Service at XEDAP.VN', links: 'https://xedap.vn/dich-vu?srsltid=AfmBOoowIqNd6-KB7bfp5ulZl1rVK4L6E8oZ8nZQIcneZVP6Aun-d0yU',
      description: 'Besides offering a wide range of bicycles, XEDAP.VN is also a trusted place for bicycle maintenance and repair, with many satisfied customers. Skilled technicians...'
    },
    {
      latitude: 21.03043, longitude: 105.77172, name: 'MOBILE BICYCLE REPAIR SERVICE (BIKE SOS)', links: 'https://sosbikesbikes.wixsite.com/home',
      description: 'Ride Plus officially partners with XedapSOS - Vietnam’s first mobile bicycle repair service - to provide assembly, repair, and professional services...'
    },
    {
      latitude: 21.03411, longitude: 105.77499, name: 'Professional Bicycle Repair and Maintenance Service at Bicycle 88',  links: 'https://fgbike.vn/che-do-bao-hanh-bao-duong-xe-dap-88',
      description: 'Shop Xe Đạp 88 offers a one-year warranty on single-speed bike frames and a three-month warranty on parts for all Single Speed models assembled by the shop...'
    },
    {
      latitude: 21.02586, longitude: 105.77328, name: 'New Way Bicycle Store', links: 'https://newwayebikes.com/?srsltid=AfmBOorE5OHqJ92GwPyGdacsrQg4iGmfxC_X7JpBYATbz3sY4q8-zKoJ',
      description: 'Accepting orders and purchasing all types of new, slightly used bikes. Competitive prices and long-term warranty policies. Only selling genuine products with QR tags...'
    },
    {
      latitude: 21.0264, longitude: 105.7801, name: 'An Ton Bike Store', links: 'https://www.toplist.vn/top/an-ton-bike-store-606760.htm',
      description: 'An Ton Bike Store, Hanoi. 2,529 likes · 5 talking about this · 846 check-ins. - Sports bicycle repair/maintenance - Bicycle sales...'
    },
    {
      latitude: 21.03331, longitude: 105.78488, name: 'Thong Nhat Bicycle Store', links: 'https://thongnhat.com.vn/home',
      description: 'Official retail system — Genuine sports bikes, Thống Nhất mini bikes with beautiful designs. HomeCare service for at-home repairs and warranty...'
    },
    {
      latitude: 21.0289, longitude: 105.7894, name: 'Bicycle Repair Shop in Hanoi - Best Service, Best Prices', links: 'https://www.hanoibikes.com/repair',
      description: 'Bicycle Repair Shop in Hanoi - Best Service, Best Prices is a reputable sports bicycle repair shop in Hanoi, located at 108 Hang Bong, Hoan Kiem, Hanoi. The store owner is Duong Mac An Ton. Many customers...'
    }
  ];


  const addWaypoint = (longitude, latitude, color) => {
    new mapboxgl.Marker({ color })
      .setLngLat([longitude, latitude])
      .addTo(mapRef.current);
  };

  useEffect(() => {
    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
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
    const addMarkerWithLabel = (longitude, latitude, name, description, links) => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
  
      const img = document.createElement('img');
      img.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkhyAI0gTqZ-jindvXT1j0VCLg8p7whYCu9w&s';
      img.style.width = '35px';
      img.style.height = '35px';
      img.style.borderRadius = '50%';
      img.style.border = '2.5px solid #fa3e2c';
      img.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)';
      el.appendChild(img);
  
      const popup = new mapboxgl.Popup({
        closeButton: false,  
        closeOnClick: true,
      })
        .setLngLat([longitude, latitude])
        .setHTML(`<h4>${name}</h4>`);
  
      const marker = new mapboxgl.Marker(el)
        .setLngLat([longitude, latitude])
        .setPopup(popup)
        .addTo(mapRef.current);

        setCurrentPopup(popup);
  
      marker.getElement().addEventListener('click', () => {
        setSelectedPoint({ latitude, longitude, name, description, links });
      });
    };


    mapInstance.on('load', () => {
      fixedPoints.forEach((point, index) => {
        // Thay thế icon marker bằng một hình ảnh icon
        addMarkerWithLabel(point.longitude, point.latitude, point.name, point.description, point.links);
      });

      const nav = new mapboxgl.NavigationControl({
        visualizePitch: true,
      });
      mapInstance.addControl(nav, 'bottom-left');
    });



    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);



  const handleDirections = (latitude, longitude) => {
    if (directions) {
      // Xóa các tuyến đường hiện tại trước khi thêm đường dẫn mới
      const routeLayerId = mapRef.current.getLayer('directions-route-line');
      if (routeLayerId) {
        mapRef.current.setPaintProperty('directions-route-line', 'line-color', 'blue'); // Màu mới cho tuyến đường
      }

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

  const handleDestinationChange = (latitude, longitude, name, description, links) => {
    if (map && directions) {
      // Kiểm tra nếu có popup hiện tại và đảm bảo popup có thể được xóa
      if (currentPopup && typeof currentPopup.remove === 'function') {
        currentPopup.remove();  // Xóa popup hiện tại
        setCurrentPopup(null);  // Đặt lại giá trị popup về null
      }
  
      // Tạo nội dung cho popup
      const content = `
        <h4>${name}</h4>
      `;
  
      // Tạo và hiển thị popup mới
      const popup = new mapboxgl.Popup({
        closeButton: false,  
        closeOnClick: true,
      })
        .setLngLat([longitude, latitude])
        .setHTML(content)
        .addTo(map);
  
      // Cập nhật popup hiện tại và điểm đã chọn
      setCurrentPopup(popup);
      setSelectedPoint({ latitude, longitude, name, description, links });
    }
  };
  

  const Close = () => {
    if (currentPopup && typeof currentPopup.remove === 'function') {
      currentPopup.remove();  // Xóa popup hiện tại
      setCurrentPopup(null);  // Đặt lại giá trị popup về null
    }
    setSelectedPoint(null);  // Xóa thông tin điểm đã chọn
  };
  
  



  return (
    <div style={{ display: 'flex', margin: '5% 3%  1.2% 2%' }}>
      {/* Sidebar */}
      <div className="sidebar">
        <h3>Nearest service workshop: </h3>
        <ul>
          {fixedPoints.map((point, index) => (
            <li key={index}>
              <span onClick={() => handleDestinationChange(point.latitude, point.longitude, point.name, point.description, point.links)}>
              {point.name}
              </span>
              <span onClick={() => handleDirections(point.latitude, point.longitude)}>
                <FontAwesomeIcon icon={faDiamondTurnRight} style={{ fontSize: '24px', paddingLeft: '10px' }} />
              </span>
            </li>
          ))}
        </ul>


        {showClearButton && (
          <button onClick={handleRemoveDirections} className="remove-directions-btn">
            Remove Instruction <FontAwesomeIcon icon={faTimes} style={{ fontSize: '24px', paddingLeft: '20px' }} />
          </button>
        )}
      </div>

      {/* Bản đồ */}
      <div ref={mapContainer} className="map-container2" />

      {selectedPoint && (
        <div className="destination-details">
          <h4>Destination details: </h4>
          <span style={{ fontSize: '16px', fontWeight: '700' }}>{selectedPoint.name}</span>
          <p style={{ margin: '5% auto' }}>{selectedPoint.description || 'No description information available.'}</p>
          <span onClick={() => handleDirections(selectedPoint.latitude, selectedPoint.longitude)}>
            <FontAwesomeIcon icon={faDiamondTurnRight} style={{ fontSize: '24px' }} />
          </span>
          <Link to={selectedPoint.links || '#'} target="_blank">
            <FontAwesomeIcon icon={faEarthAmericas} style={{ fontSize: '24px', paddingLeft: '10px', cursor: 'pointer' }} />
          </Link>
          <p>Coordinates: {selectedPoint.latitude}, {selectedPoint.longitude}</p>
          <button onClick={Close}>Close</button>
        </div>
      )}

    </div>
  );
}
export default Service;
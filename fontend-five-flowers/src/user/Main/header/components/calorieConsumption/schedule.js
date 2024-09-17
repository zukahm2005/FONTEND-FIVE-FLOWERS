import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';

const Schedule = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  mapboxgl.accessToken = 'pk.eyJ1IjoienVrYWhtMms1IiwiYSI6ImNtMGNvb2wwZzAwdTcybHM2ODFpZ3p3Z3MifQ.UPYPfCuIQeqUWDyt1SspVQ';

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [105.8544441, 21.2828865], 
      zoom: 10,
    });

    map.current.on('load', () => {
      const directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: 'metric',
        profile: 'mapbox/driving',
        alternatives: false,
        geometries: 'geojson',
        interactive: false,
      });

      map.current.addControl(directions, 'top-left');

      directions.setOrigin([106.048004, 21.186148]);
      directions.setDestination([105.850426, 21.028511]);

      directions.addWaypoint(0, [105.917469, 21.135424]);
      directions.addWaypoint(1, [105.874098, 21.077158]);

      // Define tourist spots with custom icon
      const touristSpots = [
        {
          coordinates: [106.048004, 21.186148],
          description: 'Bắc Ninh - điểm xuất phát'
        },
        {
          coordinates: [105.917469, 21.135424],
          description: 'Thị trấn Từ Sơn - điểm dừng 1'
        },
        {
          coordinates: [105.874098, 21.077158],
          description: 'Khu công nghiệp Yên Phong - điểm dừng 2'
        },
        {
          coordinates: [105.850426, 21.028511],
          description: 'Hồ Hoàn Kiếm - điểm đến'
        }
      ];

      // Loop through each spot and add a custom marker
      touristSpots.forEach(point => {
        // Tạo một popup và tắt dấu X
        const popup = new mapboxgl.Popup({ offset: 25, closeButton: false }) // Đặt closeButton thành false để bỏ dấu X
          .setText(point.description);
      
        // Tạo một marker với icon mặc định của Mapbox
        new mapboxgl.Marker() // Sử dụng icon mặc định
          .setLngLat(point.coordinates)
          .setPopup(popup) // Liên kết popup với marker
          .addTo(map.current);
      
        // Hiển thị popup ngay lập tức khi marker được thêm vào bản đồ
        popup.addTo(map.current);
      });
      
      directions.on('route', () => {
        map.current.setPaintProperty('directions-route-line', 'line-color', 'blue');
      });
    });
  }, []);

  return (
    <div>
      <div ref={mapContainer} style={{ width: "100%", height: "1000px", margin: 'auto 0' }} />
    </div>
  );
};

export default Schedule;

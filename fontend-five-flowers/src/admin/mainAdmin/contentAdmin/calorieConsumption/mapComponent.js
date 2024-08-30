import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-sdk/services/directions';

mapboxgl.accessToken = 'pk.eyJ1IjoienVrYWhtMms1IiwiYSI6ImNtMGNvb2wwZzAwdTcybHM2ODFpZ3p3Z3MifQ.UPYPfCuIQeqUWDyt1SspVQ';

function DistanceTracker() {
  const [positions, setPositions] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [tracking, setTracking] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [initialPosition, setInitialPosition] = useState(null);
  const [destination, setDestination] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [distanceToDestination, setDistanceToDestination] = useState(null);

  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const destinationMarkerRef = useRef(null);

  const directionsService = MapboxDirections({ accessToken: mapboxgl.accessToken });

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [105.83416, 21.027764], // Tọa độ Hà Nội
      zoom: 17,
    });

    mapRef.current = map;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setInitialPosition([lat, lon]);

          map.flyTo({
            center: [lon, lat],
            zoom: 17,
          });

          const newMarker = new mapboxgl.Marker()
            .setLngLat([lon, lat])
            .addTo(map);
          markerRef.current = newMarker;
        },
        (error) => console.error('Lỗi khi lấy vị trí ban đầu:', error),
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      alert("Trình duyệt này không hỗ trợ tính năng Geolocation.");
    }
  }, []);

  useEffect(() => {
    let watchId;
    let timerInterval;

    if (tracking && initialPosition && navigator.geolocation) {
      setStartTime(Date.now());

      watchId = navigator.geolocation.watchPosition(trackPosition, handleError, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      });

      timerInterval = setInterval(() => {
        setElapsedTime(Date.now() - startTime); // Không có hệ số tốc độ, thời gian chạy bình thường
      }, 1000);
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [tracking, startTime, initialPosition]);

  const trackPosition = (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const newPosition = [lat, lon];

    setPositions((prevPositions) => {
      if (prevPositions.length > 0) {
        const lastPosition = prevPositions[prevPositions.length - 1];
        const distance = calculateDistance(lastPosition, newPosition);
        setTotalDistance((prevDistance) => prevDistance + distance);
      }
      return [...prevPositions, newPosition];
    });

    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [lon, lat],
        essential: true,
        zoom: 17,
      });

      if (markerRef.current) {
        markerRef.current.setLngLat([lon, lat]);
      }
    }

    if (destination) {
      const distanceToDest = calculateDistance(newPosition, destination);
      setDistanceToDestination(distanceToDest);

      const speed = totalDistance / (elapsedTime / 3600000) || 10; // Giả định tốc độ là 10 km/h
      const timeToDestination = (distanceToDest / speed) * 3600000; // milliseconds
      setEstimatedTime(timeToDestination); // Chỉ cập nhật ước tính một lần
    }
  };

  const calculateDistance = (coord1, coord2) => {
    const R = 6371; // Bán kính trái đất theo km
    const dLat = deg2rad(coord2[0] - coord1[0]);
    const dLon = deg2rad(coord2[1] - coord1[1]);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(coord1[0])) * Math.cos(deg2rad(coord2[0])) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const handleError = (error) => {
    console.error("Lỗi khi lấy vị trí:", error);
  };

  const handleStart = async () => {
    if (initialPosition) {
      const [lat, lon] = generateRandomDestination(initialPosition[0], initialPosition[1], 10);
      setDestination([lat, lon]);

      if (mapRef.current) {
        if (destinationMarkerRef.current) {
          destinationMarkerRef.current.remove();
        }
        const newDestinationMarker = new mapboxgl.Marker({ color: 'red' })
          .setLngLat([lon, lat])
          .addTo(mapRef.current);
        destinationMarkerRef.current = newDestinationMarker;

        mapRef.current.flyTo({
          center: [lon, lat],
          essential: true,
          zoom: 17,
        });

        const directions = await directionsService.getDirections({
          profile: 'cycling', // hoặc 'driving', 'walking'
          waypoints: [
            { coordinates: [initialPosition[1], initialPosition[0]] },
            { coordinates: [lon, lat] }
          ],
          geometries: 'geojson'
        }).send();

        const route = directions.body.routes[0].geometry;

        if (mapRef.current.getSource('route')) {
          mapRef.current.getSource('route').setData(route);
        } else {
          mapRef.current.addLayer({
            id: 'route',
            type: 'line',
            source: {
              type: 'geojson',
              data: route
            },
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#3887be',
              'line-width': 5
            }
          });
        }
      }

      setTracking(true);
      setPositions([initialPosition]);
      setTotalDistance(0);
      setElapsedTime(0);

      const distanceToDest = calculateDistance(initialPosition, [lat, lon]);
      setDistanceToDestination(distanceToDest);
      const speed = 10; // Giả định tốc độ là 10 km/h
      const timeToDestination = (distanceToDest / speed) * 3600000; // milliseconds
      setEstimatedTime(timeToDestination); // Cập nhật một lần khi bắt đầu
    }
  };

  const handleStop = () => {
    setTracking(false);

    if (destination && mapRef.current) {
        // Zoom vào điểm đến khi nhấn Stop
        mapRef.current.flyTo({
            center: [destination[1], destination[0]], // Đổi tọa độ đến điểm đích
            zoom: 17, // Mức zoom
            essential: true
        });
    }
  };

  const handleReset = () => {
    setPositions([]);
    setTotalDistance(0);
    setElapsedTime(0);
    setEstimatedTime(null);
    setDistanceToDestination(null);
    setTracking(false);

    if (destinationMarkerRef.current) {
      destinationMarkerRef.current.remove();
      destinationMarkerRef.current = null;
    }
    if (mapRef.current && mapRef.current.getLayer('route')) {
      mapRef.current.removeLayer('route');
      mapRef.current.removeSource('route');
    }
    setDestination(null);

    // Zoom đến vị trí GPS hiện tại khi nhấn Reset
    if (initialPosition && mapRef.current) {
        mapRef.current.flyTo({
            center: [initialPosition[1], initialPosition[0]], // Đổi tọa độ về vị trí GPS ban đầu
            zoom: 17, // Mức zoom
            essential: true
        });
    }
};


  const generateRandomDestination = (lat, lon, maxDistance) => {
    const earthRadius = 6371000; // Bán kính trái đất theo mét
    const distance = Math.random() * maxDistance * 1000; // Đổi khoảng cách từ km sang mét
    const bearing = Math.random() * 2 * Math.PI; // Hướng ngẫu nhiên tính bằng radian

    const lat1 = lat * (Math.PI / 180); // Đổi từ độ sang radian
    const lon1 = lon * (Math.PI / 180); // Đổi từ độ sang radian

    const lat2 = Math.asin(
      Math.sin(lat1) * Math.cos(distance / earthRadius) +
      Math.cos(lat1) * Math.sin(distance / earthRadius) * Math.cos(bearing)
    );

    const lon2 =
      lon1 +
      Math.atan2(
        Math.sin(bearing) * Math.sin(distance / earthRadius) * Math.cos(lat1),
        Math.cos(distance / earthRadius) - Math.sin(lat1) * Math.sin(lat2)
      );

    const newLat = lat2 * (180 / Math.PI); // Đổi từ radian sang độ
    const newLon = lon2 * (180 / Math.PI); // Đổi từ radian sang độ

    return [newLat, newLon];
  };

  const formatTime = (milliseconds) => {
    if (milliseconds == null) return '';
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div>
      <h1>Distance Tracker</h1>
      <p>Estimated Time to Destination: {formatTime(estimatedTime)}</p>
      <p>Distance to Destination: {distanceToDestination?.toFixed(2)} km</p>
      <button onClick={handleStart} disabled={tracking}>Start</button>
      <button onClick={handleStop} disabled={!tracking}>Stop</button>
      <button onClick={handleReset}>Reset</button>
      <div id="map" style={{ width: '100%', height: '400px' }}></div>
    </div>
  );
}

export default DistanceTracker;

import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-sdk/services/directions';
import axios, { Axios } from 'axios';

mapboxgl.accessToken = 'pk.eyJ1IjoienVrYWhtMms1IiwiYSI6ImNtMGNvb2wwZzAwdTcybHM2ODFpZ3p3Z3MifQ.UPYPfCuIQeqUWDyt1SspVQ';

function DistanceTracker() {
  // State variables
  const [positions, setPositions] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [tracking, setTracking] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [initialPosition, setInitialPosition] = useState(null);
  const [destination, setDestination] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [distanceToDestination, setDistanceToDestination] = useState(null);

  const [isSimulating, setIsSimulating] = useState(false);

  // Refs
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const trackingRef = useRef(tracking); // Create a ref to store the tracking state
  const watchIdRef = useRef(null); // Create a ref to store the watchId
  let simulationInterval;  // Declare simulationInterval here


  const directionsService = MapboxDirections({ accessToken: mapboxgl.accessToken });

  useEffect(() => {
    trackingRef.current = tracking;  // Update the ref whenever tracking state changes
  }, [tracking]);

  useEffect(() => {
    if (isSimulating) {
      // Bắt đầu mô phỏng
      simulationInterval = setInterval(() => {
        // Logic mô phỏng
      }, 1000);
    } else {
      // Ngừng mô phỏng khi không còn mô phỏng
      if (simulationInterval) {
        clearInterval(simulationInterval);
      }
    }
  
    // Dọn dẹp khi component unmounts hoặc khi isSimulating thay đổi
    return () => {
      if (simulationInterval) {
        clearInterval(simulationInterval);
      }
    };
  }, [isSimulating]);
  

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [105.83416, 21.027764],
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

          const fixedMarker = new mapboxgl.Marker({ color: 'blue' })
            .setLngLat([lon, lat])
            .addTo(map);

          fixedMarker.current = fixedMarker;
        },
        (error) => console.error('Error retrieving initial position:', error),
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      alert("This browser does not support Geolocation.");
    }
  }, []);

  useEffect(() => {
    if (tracking && initialPosition) {
      watchIdRef.current = navigator.geolocation.watchPosition(trackPosition, handleError, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      });
    }

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [tracking, initialPosition]);

  


  useEffect(() => {
    let timerInterval;

    if (tracking) {
      setStartTime(Date.now());

      timerInterval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [tracking, startTime]);

  const trackPosition = (position) => {
    if (!trackingRef.current) return;  // Use the ref value

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const newPosition = [lon, lat];

    setPositions((prevPositions) => {
      if (prevPositions.length > 0) {
        const lastPosition = prevPositions[prevPositions.length - 1];
        const distance = calculateDistance(lastPosition, newPosition);

        if (distance > 0.2) {
          console.warn('Khoảng cách giữa hai điểm quá lớn, xóa điểm cuối và bỏ qua vị trí mới.');
          return prevPositions.slice(0, -1);
        }

        setTotalDistance((prevTotal) => prevTotal + distance);
      }

      const updatedPositions = [...prevPositions, newPosition];

      if (mapRef.current) {
        if (mapRef.current.getSource('track')) {
          mapRef.current.getSource('track').setData({
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: updatedPositions,
              },
            }],
          });
        } else {
          mapRef.current.addSource('track', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [{
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: updatedPositions,
                },
              }],
            },
          });

          mapRef.current.addLayer({
            id: 'track',
            type: 'line',
            source: 'track',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': 'blue',
              'line-width': 3,
            },
          });
        }

        mapRef.current.flyTo({
          center: newPosition,
          essential: true,
          zoom: 17,
        });

        if (markerRef.current) {
          markerRef.current.setLngLat(newPosition);
        } else {
          const newMarker = new mapboxgl.Marker({
            color: 'red',
          })
            .setLngLat(newPosition)
            .addTo(mapRef.current);
          markerRef.current = newMarker;
        }
      }

      return updatedPositions;
    });
  };

  const calculateDistance = (coord1, coord2) => {
    const R = 6371;
    const dLat = deg2rad(coord2[0] - coord1[0]);
    const dLon = deg2rad(coord2[1] - coord1[1]);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(coord1[0])) * Math.cos(deg2rad(coord2[0])) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  const simulateMovement = (route, duration) => {
    setIsSimulating(true);

    const routeCoordinates = route.coordinates;
    const totalPoints = routeCoordinates.length;

    let currentPointIndex = 0;
    const startTime = Date.now();
    const frameRate = 60;
    const updateInterval = 1000 / frameRate;

    const speedMultiplier = 3;
    const adjustedDuration = duration / speedMultiplier;

    simulationInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const progress = elapsedTime / adjustedDuration;

        if (progress >= 1 || currentPointIndex >= totalPoints - 1) {
            clearInterval(simulationInterval);
            setIsSimulating(false);
            return;
        }

        const start = routeCoordinates[currentPointIndex];
        const end = routeCoordinates[currentPointIndex + 1];
        const segmentProgress = progress * (totalPoints - 1) - currentPointIndex;

        const currentLat = start[1] + (end[1] - start[1]) * segmentProgress;
        const currentLon = start[0] + (end[0] - start[0]) * segmentProgress;

        trackPosition({
            coords: {
                latitude: currentLat,
                longitude: currentLon,
            },
        });

        if (segmentProgress >= 1) {
            currentPointIndex += 1;
        }
    }, updateInterval);
};


  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };
  

  const handleError = (error) => {
    console.error("Lỗi khi lấy vị trí:", error);
  };

// Function to generate a random destination point within a given range
const getRandomDestination = (startLat, startLon, range = 0.01) => {
  const randomLatOffset = (Math.random() - 0.5) * range;
  const randomLonOffset = (Math.random() - 0.5) * range;

  const destinationLat = startLat + randomLatOffset;
  const destinationLon = startLon + randomLonOffset;

  return [destinationLat, destinationLon];
};

const handleStart = async () => {
  if (!tracking) {
    setTracking(true);
    setStartTime(Date.now());
  }

  if (initialPosition) {
    const [startLat, startLon] = initialPosition;

    if (mapRef.current) {
      // Move to the user's current position
      mapRef.current.flyTo({
        center: [startLon, startLat],
        essential: true,
        zoom: 17,
      });

      // Ensure 'start-point' source and layer are not added multiple times
      if (mapRef.current.getLayer('start-point-icon')) {
        mapRef.current.removeLayer('start-point-icon');
      }
      if (mapRef.current.getSource('start-point')) {
        mapRef.current.removeSource('start-point');
      }

      // Add 'start-point' source and layer
      mapRef.current.addSource('start-point', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [startLon, startLat],
            },
            properties: {
              icon: 'star',
            },
          }],
        },
      });

      mapRef.current.addLayer({
        id: 'start-point-icon',
        type: 'symbol',
        source: 'start-point',
        layout: {
          'icon-image': 'star-15',
          'icon-size': 1.5,
        },
      });

      // Generate a random destination point
      const [destinationLat, destinationLon] = getRandomDestination(startLat, startLon);

      const directions = await directionsService.getDirections({
        profile: 'cycling',
        waypoints: [
          { coordinates: [startLon, startLat] },
          { coordinates: [destinationLon, destinationLat] }
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
            data: route,
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': 'none',
            'line-width': 5
          }
        });
      }

      setPositions([initialPosition]);
      setTotalDistance(0);
      setElapsedTime(0);

      const distanceToDest = calculateDistance([startLon, startLat], [destinationLon, destinationLat]);
      setDistanceToDestination(distanceToDest);

      const speed = 5;
      const timeToDestination = (distanceToDest / speed) * 3600000;
      setEstimatedTime(timeToDestination);
      simulateMovement(route, timeToDestination);
    }
  }
};

  
  const handleStop = () => {
    setTracking(false);
    setIsSimulating(false);

    if (simulationInterval) {
      clearInterval(simulationInterval);
      simulationInterval = null;
    }

    setPositions((prevPositions) => {
      if (prevPositions.length > 0) {
        const lastPosition = prevPositions[prevPositions.length - 1];

        if (mapRef.current && markerRef.current) {
          markerRef.current.setLngLat(lastPosition);
        }

        if (isSimulating) {
          const newDistance = calculateDistance(
            prevPositions[prevPositions.length - 2],
            lastPosition
          );
          setTotalDistance((prevTotal) => prevTotal + newDistance);
        }

        return prevPositions;
      }
      return prevPositions;
    });

    const km = totalDistance.toFixed(2)
    const time =  (elapsedTime / 10000).toFixed(2);

    const token = localStorage.getItem("token");

    const user = JSON.parse(atob(token.split('.')[1]));
    const userId = user.userId;

    const postData = {
      userInfo: {
        id: userId
      },
      weight: 55,
      distance: km,
      time: time
    };

  

axios.post('http://localhost:8080/api/v1/calorie-consumption', postData,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
)
  .then(response => {
    console.log('POST Response:', response.data);
  })
  };



  const resetMap = () => {
    setTracking(false);
    setIsSimulating(false);
  
    // Reset all states to initial values
    setTotalDistance(0);
    setElapsedTime(0);
    setPositions([]);
    setDestination(null);
    setEstimatedTime(null);
    setDistanceToDestination(null);
    setInitialPosition(null);
  
    if (mapRef.current) {
      // Remove old layers and sources
      ['start-point-icon', 'route', 'track'].forEach((layer) => {
        if (mapRef.current.getLayer(layer)) {
          mapRef.current.removeLayer(layer);
        }
        if (mapRef.current.getSource(layer)) {
          mapRef.current.removeSource(layer);
        }
      });
  
      // Remove existing marker
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
  
      // Re-center the map at the user's current position
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
  
            // Reset initial position with current coordinates
            setInitialPosition([lat, lon]);
  
            mapRef.current.flyTo({
              center: [lon, lat],
              zoom: 17,
            });
  
            // Add a new marker at the user's current location
            const newMarker = new mapboxgl.Marker({ color: 'blue' })
              .setLngLat([lon, lat])
              .addTo(mapRef.current);
            markerRef.current = newMarker;
          },
          (error) => {
            console.error('Error getting current location:', error);
            alert('Could not retrieve your location. Please try again.');
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
        );
      } else {
        alert('Your browser does not support geolocation.');
      }
    }
    window.location.reload();
  };
  

  return (
    <div>
      <div id="map" style={{ width: '100%', height: '700px' }} />
      <div style={{ marginTop: '20px' }}>
        <button onClick={handleStart} disabled={tracking}>Start</button>
        <button onClick={handleStop} disabled={!tracking}>Stop</button>
        <button onClick={resetMap}>Reset</button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <p>Total Distance: {totalDistance.toFixed(2)} km</p>
        <p>Elapsed Time: {(elapsedTime / 10000).toFixed(2)} minutes</p>
        {destination && (
          <>
            <p>Estimated Time to Destination: {(estimatedTime / 60000).toFixed(2)} minutes</p>
            <p>Distance to Destination: {distanceToDestination?.toFixed(2)} km</p>
          </>
        )}
      </div>
      
    </div>
  );
}

export default DistanceTracker;

import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-sdk/services/directions';
import axios from 'axios';
import polyline from '@mapbox/polyline';
import { Link, useNavigate } from 'react-router-dom';
import './mapComponent.scss';



mapboxgl.accessToken = 'pk.eyJ1IjoienVrYWhtMms1IiwiYSI6ImNtMGNvb2wwZzAwdTcybHM2ODFpZ3p3Z3MifQ.UPYPfCuIQeqUWDyt1SspVQ';

const fixedLat = 21.028412;  // Vĩ độ cố định (Hà Nội)
const fixedLon = 105.782295;  // Kinh độ cố định (Hà Nội)


function DistanceTracker() {
  const [screenshotUrl, setScreenshotUrl] = useState(null);  // Đảm bảo các hook như thế này được gọi bên trong các thành phần
  const navigate = useNavigate();
  // Biến trạng thái
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
  const trackingRef = useRef(tracking); // Tạo một tham chiếu để lưu trữ trạng thái theo dõi
  const watchIdRef = useRef(null); // Tạo một ref để lưu trữ ID đồng hồ
  let simulationInterval;  //Khai báo khoảng thời gian mô phỏng ở đây


  const directionsService = MapboxDirections({ accessToken: mapboxgl.accessToken });

  useEffect(() => {
    trackingRef.current = tracking;  //Cập nhật tham chiếu bất cứ khi nào trạng thái theo dõi thay đổi
  }, [tracking]);

  //Mô Phỏng Chuyển Động
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
    // Khởi tạo bản đồ
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [fixedLon, fixedLat],  // Sử dụng tọa độ cố định
      zoom: 17,
    });

    mapRef.current = map;

    // Đợi bản đồ tải xong
    map.on('load', () => {
      // Sử dụng tọa độ cố định
      setInitialPosition([fixedLat, fixedLon]);

      // Di chuyển bản đồ đến vị trí cố định
      map.flyTo({
        center: [fixedLon, fixedLat],
        zoom: 17,
      });
      // Thêm các nút điều khiển phóng to và xoay bản đồ
      const nav = new mapboxgl.NavigationControl({
        visualizePitch: true // Tùy chọn hiển thị góc nghiêng (nếu cần)
      });

      map.addControl(nav, 'top-left'); // Bạn có thể chọn vị trí (top-left, top-right, v.v.)

      // Thêm đánh dấu vào vị trí cố định
      const fixedMarker = new mapboxgl.Marker({ color: 'blue' })
        .setLngLat([fixedLon, fixedLat])
        .addTo(map);

      fixedMarker.current = fixedMarker;
    });

    // Dọn dẹp bản đồ khi component unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);


  // Theo Dõi Vị Trí
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
    if (!trackingRef.current) return;  // Sử dụng giá trị tham chiếu

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const newPosition = [lon, lat];

    setPositions((prevPositions) => {

      if (prevPositions.length > 0) {
        const lastPosition = prevPositions[prevPositions.length - 1];
        const distance = calculateDistance(lastPosition, newPosition);

        if (distance > 0.05) {
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
              'line-width': 5,
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

    const routeCoordinates = route.coordinates;  // Lấy danh sách các tọa độ trên tuyến đường
    const totalPoints = routeCoordinates.length; // Tổng số điểm trên tuyến đường

    let currentPointIndex = 0; // Điểm bắt đầu từ chỉ số 0
    const startTime = Date.now(); // Thời gian bắt đầu
    const frameRate = 60; // Số lần cập nhật mỗi giây
    const updateInterval = 1000 / frameRate; // Khoảng thời gian giữa các lần cập nhật

    const speedMultiplier = 1; // Hệ số tốc độ di chuyển
    const adjustedDuration = duration / speedMultiplier; // Điều chỉnh thời gian di chuyển

    simulationInterval = setInterval(() => {
      const elapsedTime = Date.now() - startTime; // Tính thời gian đã trôi qua
      const progress = elapsedTime / adjustedDuration; // Tiến trình di chuyển theo thời gian

      // Dừng mô phỏng nếu hoàn thành tuyến đường hoặc đã đi hết thời gian
      if (progress >= 1 || currentPointIndex >= totalPoints - 1) {
        clearInterval(simulationInterval);
        setIsSimulating(false);
        return;
      }

      // Tính toán vị trí hiện tại giữa hai điểm của tuyến đường
      const start = routeCoordinates[currentPointIndex];
      const end = routeCoordinates[currentPointIndex + 1];
      const segmentProgress = progress * (totalPoints - 1) - currentPointIndex;

      const currentLat = start[1] + (end[1] - start[1]) * segmentProgress;
      const currentLon = start[0] + (end[0] - start[0]) * segmentProgress;

      // Gọi hàm trackPosition để cập nhật vị trí trên bản đồ
      trackPosition({
        coords: {
          latitude: currentLat,
          longitude: currentLon,
        },
      });

      // Tăng chỉ số khi hoàn thành di chuyển đến điểm tiếp theo
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

  //Hàm tạo điểm đích ngẫu nhiên trong phạm vi nhất định
  const getRandomDestination = (startLat, startLon, range = 0.01) => {
    const randomLatOffset = (Math.random() - 0.5) * range;
    const randomLonOffset = (Math.random() - 0.5) * range;

    const destinationLat = startLat + randomLatOffset;
    const destinationLon = startLon + randomLonOffset;

    return [destinationLat, destinationLon];
  };

  
  const takeMapScreenshot = async () => {
    if (!initialPosition || !destination) {
      alert("No end point");
      return;
    }
  
    const [startLat, startLon] = initialPosition;
    const [destLat, destLon] = destination;
    const width = 900;
    const height = 700;
    const pathColor = '0000FF';
    const pathWidth = 7;
  
    try {
      const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${startLon},${startLat};${destLon},${destLat}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
      const response = await fetch(directionsUrl);
      const data = await response.json();
  
      if (!data.routes || data.routes.length === 0) {
        console.error("No route found");
        return;
      }
  
      const route = data.routes[0];
      const routeCoordinates = route.geometry.coordinates;
  
      const distanceInKm = totalDistance.toFixed(2);
      const weight = 55;
    
      const getMet = (distanceInKm) => {
        if (distanceInKm < 8) return 6.0;
        if (distanceInKm < 10) return 8.0;
        if (distanceInKm < 12) return 10.0;
        return 12.0;
      };
    
      const durationInMinutes = (elapsedTime / 10000).toFixed(1);
      const time = (durationInMinutes / 60);
      const speed = distanceInKm / time;
      const calo = (weight * getMet(speed) * time * 1.05).toFixed(3);
  
      const encodedPath = polyline.encode(routeCoordinates.map(coord => [coord[1], coord[0]]));
  
      const mapboxImageUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-l-a+0000FF(${startLon},${startLat}),pin-l-b+FF0000(${destLon},${destLat}),path-${pathWidth}+${pathColor}-0.5(${encodedPath})/auto/${width}x${height}?access_token=${mapboxgl.accessToken}`;
  
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = mapboxImageUrl;
  
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
  
        ctx.drawImage(img, 0, 0, width, height);
  
        ctx.font = "bold 16px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(`Distance traveled: ${distanceInKm} km`, 10, 50);
        ctx.fillText(`Travel time: ${durationInMinutes} phút`, 10, 80);
        ctx.fillText(`Calories burned: ${calo}`, 10, 110);
  
        // Tạo base64 từ canvas
        const imageUrl = canvas.toDataURL('image/png');
  
        if (imageUrl) {
          setScreenshotUrl(imageUrl); 
          navigate('/screenshot', { state: { screenshotUrl: imageUrl } });
        }
      };
  
      img.onerror = () => {
        console.error("Error loading image from Mapbox URL");
      };
  
    } catch (error) {
      console.error("Error fetching directions or creating map image:", error);
    }
  };
  



  const handleStart = async () => {
    if (!tracking) {
      setTracking(true);
      setStartTime(Date.now());
    }

    if (initialPosition) {
      const startLat = fixedLat;  // Tọa độ bắt đầu cố định
      const startLon = fixedLon;  // Tọa độ bắt đầu cố định

      if (mapRef.current) {
        // Di chuyển bản đồ đến vị trí bắt đầu cố định
        mapRef.current.flyTo({
          center: [startLon, startLat],
          essential: true,
          zoom: 17,
        });

        // Xóa lớp và nguồn 'start-point' nếu đã tồn tại
        if (mapRef.current.getLayer('start-point-icon')) {
          mapRef.current.removeLayer('start-point-icon');
        }
        if (mapRef.current.getSource('start-point')) {
          mapRef.current.removeSource('start-point');
        }

        // Thêm điểm bắt đầu
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

        // Tạo điểm đến ngẫu nhiên
        const [destinationLat, destinationLon] = getRandomDestination(startLat, startLon);

        // Lấy tuyến đường từ Mapbox Directions API
        const directions = await directionsService.getDirections({
          profile: 'driving',
          waypoints: [
            { coordinates: [startLon, startLat] },
            { coordinates: [destinationLon, destinationLat] }
          ],
          geometries: 'geojson'
        }).send();

        const route = directions.body.routes[0].geometry;

        // Thêm tuyến đường lên bản đồ
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
              'line-color': 'none',  // Màu tuyến đường
              'line-width': 5
            }
          });
        }

        // Tính toán khoảng cách và thời gian di chuyển
        const distanceToDest = calculateDistance([startLon, startLat], [destinationLon, destinationLat]);
        setDistanceToDestination(distanceToDest);

        const speed = 5;  // Tốc độ di chuyển giả lập
        const timeToDestination = (distanceToDest / speed) * 3600000;  // Tính thời gian đến đích
        setEstimatedTime(timeToDestination);

        // Bắt đầu mô phỏng di chuyển
        simulateMovement(route, timeToDestination);
      }
    }
  };


  const handleStop = async () => {
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

        if (isSimulating && prevPositions.length > 1) {
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

    // Cập nhật destination với vị trí cuối cùng
    if (positions.length > 0) {
      const lastPosition = positions[positions.length - 1];
      const swappedPosition = [lastPosition[1], lastPosition[0]];
      setDestination(swappedPosition);
      // Thêm chỉ đường đến đích
      if (initialPosition) {
        const [startLat, startLon] = initialPosition;
        const [destLat, destLon] = swappedPosition;

        try {
          // Gọi Directions API để lấy tuyến đường
          const directions = await directionsService.getDirections({
            profile: 'driving',
            waypoints: [
              { coordinates: [startLon, startLat] },
              { coordinates: [destLon, destLat] }
            ],
            geometries: 'geojson'
          }).send();

          const route = directions.body.routes[0].geometry;

          // Vẽ đường chỉ dẫn trên bản đồ
          if (mapRef.current.getSource('route')) {
            mapRef.current.getSource('route').setData(route);
          } else {
            mapRef.current.addSource('route', {
              type: 'geojson',
              data: route,
            });

            mapRef.current.addLayer({
              id: 'route',
              type: 'line',
              source: 'route',
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': '#0000ff',
                'line-width': 5
              }
            });
          }
        } catch (error) {
          console.error("Error fetching directions:", error);
        }
      }
    }

    const km = totalDistance.toFixed(2);
    const time = (elapsedTime / 10000).toFixed(2);

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

    axios.post('http://localhost:8080/api/v1/calorie-consumption', postData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        console.log('POST Response:', response.data);
      })
      .catch(error => {
        console.error('POST Error:', error);
      });
  };
  return (
    <div className="map-container">
      <div id="map" />
      <div className="button-container">
        <button onClick={handleStart} disabled={tracking}>Start</button>
        <button onClick={handleStop} disabled={!tracking}>Stop</button>
        <button onClick={takeMapScreenshot}>Screenshot</button>
        <button ><Link to='/calo' style={{color:'white'}}>Calories burned</Link></button>
      </div>
      <div className="info-text">
        <p>Total Distance: {totalDistance.toFixed(2)} km</p>
        <p>Elapsed Time: {(elapsedTime / 9000).toFixed(2)} minutes</p>
      </div>
    </div>

  );
}

export default DistanceTracker;
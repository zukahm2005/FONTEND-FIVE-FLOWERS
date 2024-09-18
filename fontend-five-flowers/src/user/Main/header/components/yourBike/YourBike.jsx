import React, { useState, useEffect } from "react";
import axios from "axios";
import Map, {
  Marker, // Thêm Marker trên bản đồ để hiển thị vị trí của người dùng và xe đạp
  Source, // Dùng để truyền dữ liệu vào các layer trên bản đồ
  Layer, // Hiển thị các tuyến đường trên bản đồ
  Popup, // Hiển thị thông tin về xe đạp hoặc vị trí khi hover chuột
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { IoLocation, IoCloseCircleOutline } from "react-icons/io5"; // Icon để biểu thị vị trí của người dùng và xe đạp
import mapboxSdk from "@mapbox/mapbox-sdk/services/directions"; // SDK Mapbox để tính toán hướng đi
import mapboxgl from "mapbox-gl"; // Thêm thư viện mapbox
import moment from 'moment';
import "./yourBike.scss"; // Import file CSS cho component
import BikeInfoPopup from "./bikeInfo/BikeInfoPopup"; // Component hiển thị thông tin của xe đạp khi hover vào vị trí của nó

const mapboxToken =
  "pk.eyJ1IjoiYm9pZGVwdHJhaSIsImEiOiJjbTBxY2RwOTEwODVvMmxwbHBzOHN4aXdsIn0.k8BEQC40NN144dVoYENrRQ"; // Token Mapbox để sử dụng API Mapbox
const directionsClient = mapboxSdk({ accessToken: mapboxToken }); // Khởi tạo client để gọi API directions của Mapbox

const YourBike = () => {
  // Trạng thái của bản đồ, quản lý vị trí và mức zoom
  const [viewState, setViewState] = useState({
    longitude: 105.782098,
    latitude: 21.028511,
    zoom: 13,
  });

  // Trạng thái lưu danh sách các xe đạp và vị trí của người dùng
  const [bikes, setBikes] = useState([]);
  const [userLocation, setUserLocation] = useState({
    longitude: 105.782098,
    latitude: 21.028511,
  });

  // Trạng thái lưu thông tin về lộ trình và các dấu chấm trên lộ trình
  const [route, setRoute] = useState(null);
  const [routeDots, setRouteDots] = useState([]);

  // Trạng thái để quản lý hiển thị danh sách xe đạp và các thông tin liên quan
  const [showBikeList, setShowBikeList] = useState(false);
  const [selectedBikeLocation, setSelectedBikeLocation] = useState(null);
  const [hoveredBike, setHoveredBike] = useState(null);
  const [hoveredCoordinates, setHoveredCoordinates] = useState(null);
  const [userMarkerClicked, setUserMarkerClicked] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [history, setHistory] = useState([]); // Lưu lịch sử hành trình
  const [historyWithAddresses, setHistoryWithAddresses] = useState([]); // Lưu lịch sử hành trình với địa chỉ đã giải mã
  const [showHistory, setShowHistory] = useState(false); // Trạng thái hiển thị lịch sử hành trình

  // Hàm lấy danh sách các xe đạp của người dùng từ server khi component được load lần đầu
  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:8080/api/v1/user/bikes", {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token JWT để xác thực
        },
      })
      .then((response) => {
        const updatedBikes = response.data.map((bike) => {
          const randomPosition = getRandomPosition(userLocation); // Lấy vị trí ngẫu nhiên cho xe đạp
          return {
            ...bike,
            longitude: randomPosition.longitude,
            latitude: randomPosition.latitude,
          };
        });
        setBikes(updatedBikes); // Cập nhật danh sách xe đạp
      })
      .catch((error) => {
        console.error("Error fetching bikes:", error);
      });
  }, []);

  // Hàm lấy lịch sử hành trình từ server khi component được load lần đầu
  useEffect(() => {
    fetchHistory();
  }, []);

  // Hàm fetch lịch sử hành trình từ server và lưu vào state
  const fetchHistory = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:8080/api/v1/routes/get-route", {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token JWT để xác thực
        },
      });
      const historyData = response.data;
      setHistory(historyData); // Lưu lịch sử hành trình vào state

      // Giải mã địa chỉ của vị trí bắt đầu và kết thúc của mỗi hành trình
      const updatedHistory = await Promise.all(
        historyData.map(async (entry) => {
          const startAddress = await getGeocodedAddress(
            entry.startLocation.latitude,
            entry.startLocation.longitude
          );
          const endAddress = await getGeocodedAddress(
            entry.endLocation.latitude,
            entry.endLocation.longitude
          );
          return {
            ...entry,
            startAddress,
            endAddress,
          };
        })
      );

      setHistoryWithAddresses(updatedHistory); // Cập nhật lịch sử hành trình với địa chỉ
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  // Hàm lấy địa chỉ dựa trên tọa độ latitude và longitude, dùng dịch vụ Nominatim của OpenStreetMap
  const getGeocodedAddress = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/reverse",
        {
          params: {
            lat: latitude,
            lon: longitude,
            format: "json",
          },
        }
      );

      return response.data.display_name || "Unknown location"; // Trả về tên địa chỉ hoặc "Unknown location" nếu không tìm thấy
    } catch (error) {
      console.error("Error getting geocoded address:", error);
      return "Unknown location";
    }
  };

  // Hàm để tạo ra vị trí ngẫu nhiên cho xe đạp xung quanh vị trí người dùng
  const getRandomPosition = (userLocation) => {
    const R = 6371; // Bán kính Trái Đất tính bằng km
    const maxDist = 3; // Khoảng cách tối đa từ vị trí người dùng (km)
    const distance = Math.random() * maxDist;
    const bearing = Math.random() * 2 * Math.PI;

    const userLatRad = (userLocation.latitude * Math.PI) / 180;
    const userLngRad = (userLocation.longitude * Math.PI) / 180;

    const newLatRad = Math.asin(
      Math.sin(userLatRad) * Math.cos(distance / R) +
        Math.cos(userLatRad) * Math.sin(distance / R) * Math.cos(bearing)
    );
    const newLngRad =
      userLngRad +
      Math.atan2(
        Math.sin(bearing) * Math.sin(distance / R) * Math.cos(userLatRad),
        Math.cos(distance / R) - Math.sin(userLatRad) * Math.sin(newLatRad)
      );

    return {
      latitude: (newLatRad * 180) / Math.PI,
      longitude: (newLngRad * 180) / Math.PI,
    };
  };

  // Hàm xử lý khi người dùng nhấn vào Marker của xe đạp hoặc người dùng
  const handleMarkerClick = (location) => {
    if (location === "user") {
      const isClickedAgain = !userMarkerClicked;
      setUserMarkerClicked(isClickedAgain);

      if (isClickedAgain) {
        const bounds = new mapboxgl.LngLatBounds();

        bounds.extend([userLocation.longitude, userLocation.latitude]);

        bikes.forEach((bike) => {
          bounds.extend([bike.longitude, bike.latitude]);
        });

        setViewState({
          ...viewState,
          longitude: userLocation.longitude,
          latitude: userLocation.latitude,
          zoom: 13,
        });
        setShowBikeList(false);
      } else {
        setShowBikeList(true);
      }
    } else {
      const bikeLocation = location;
      if (selectedBikeLocation && selectedBikeLocation.id === bikeLocation.id) {
        setShowBikeList(!showBikeList);
      } else {
        setSelectedBikeLocation(bikeLocation);

        const sortedBikes = [
          bikeLocation,
          ...bikes.filter((bike) => bike.id !== bikeLocation.id),
        ];

        setBikes(sortedBikes);

        setShowBikeList(true);

        setViewState({
          longitude: bikeLocation.longitude,
          latitude: bikeLocation.latitude,
          zoom: 15,
        });
      }
    }
  };

  // Hàm xử lý khi người dùng nhấn vào nút Directions để tính toán hướng đi từ vị trí người dùng đến vị trí xe đạp
  const handleDirectionClick = (bikeLocation) => {
    if (userLocation && bikeLocation) {
      directionsClient
        .getDirections({
          profile: "walking", 
          geometries: "geojson", // Hình dạng tuyến đường dưới dạng GeoJSON
          waypoints: [
            {
              coordinates: [userLocation.longitude, userLocation.latitude], // Tọa độ của người dùng
            },
            {
              coordinates: [bikeLocation.longitude, bikeLocation.latitude], // Tọa độ của xe đạp
            },
          ],
        })
        .send()
        .then((response) => {
          const directions = response.body.routes[0];
          setRoute(directions.geometry); // Cập nhật lộ trình trên bản đồ

          setSelectedBikeLocation(bikeLocation);

          const sortedBikes = [
            bikeLocation,
            ...bikes.filter((bike) => bike.id !== bikeLocation.id),
          ];

          setBikes(sortedBikes);

          const coords = directions.geometry.coordinates;
          const dots = coords.filter((coord, index) => index % 3 === 0); // Chia lộ trình thành các chấm nhỏ
          setRouteDots(dots);

          const midPoint = {
            longitude: (userLocation.longitude + bikeLocation.longitude) / 2,
            latitude: (userLocation.latitude + bikeLocation.latitude) / 2,
          };

          setViewState({
            longitude: midPoint.longitude,
            latitude: midPoint.latitude,
            zoom: 13,
          });

          console.log("Route:", directions.geometry);
        })
        .catch((error) => {
          console.error("Error fetching directions:", error);
        });
    } else {
      console.error("User location or bike location is missing");
    }
  };

  // Hàm tính khoảng cách giữa hai điểm tọa độ (longitude, latitude)
  const getDistance = (start, end) => {
    const [lng1, lat1] = start;
    const [lng2, lat2] = end;

    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  };

  // Hàm bắt đầu mô phỏng chuyển động từ vị trí người dùng đến vị trí xe đạp
  const handleStartNavigation = async () => {
    if (!selectedBikeLocation || !userLocation) {
      console.log("Missing selectedBikeLocation or userLocation");
      return;
    }

    const directions = await directionsClient
      .getDirections({
        profile: "walking",// Chế độ di chuyển là đi xe đạp
        waypoints: [
          { coordinates: [userLocation.longitude, userLocation.latitude] },
          {
            coordinates: [
              selectedBikeLocation.longitude,
              selectedBikeLocation.latitude,
            ],
          },
        ],
        geometries: "geojson",
      })
      .send();

    const route = directions.body.routes[0].geometry;
    setRoute(route);

    const currentDate = new Date();

    simulateMovement(route, 30000, async () => {
      await saveRouteToDatabase(
        userLocation,
        selectedBikeLocation,
        currentDate
      );
      fetchHistory();
    });
  };

  // Hàm mô phỏng chuyển động của người dùng dọc theo tuyến đường đã tính toán
  const simulateMovement = (route, duration, onComplete) => {
    const routeCoordinates = route.coordinates;
    const totalPoints = routeCoordinates.length;

    let currentPointIndex = 0;
    const totalDistance = routeCoordinates.reduce((acc, coord, index) => {
      if (index < totalPoints - 1) {
        return acc + getDistance(coord, routeCoordinates[index + 1]);
      }
      return acc;
    }, 0);

    const speed = totalDistance / (duration / 1000); // Tính tốc độ di chuyển
    const startTime = Date.now();
    const frameRate = 60;
    const updateInterval = 1000 / frameRate;

    clearInterval(intervalId);
    const newIntervalId = setInterval(() => {
      const elapsedTime = (Date.now() - startTime) / 1000;
      const traveledDistance = speed * elapsedTime;

      let accumulatedDistance = 0;
      for (let i = 0; i < totalPoints - 1; i++) {
        const segmentDistance = getDistance(
          routeCoordinates[i],
          routeCoordinates[i + 1]
        );
        accumulatedDistance += segmentDistance;

        if (accumulatedDistance >= traveledDistance) {
          const previousPoint = routeCoordinates[i];
          const nextPoint = routeCoordinates[i + 1];
          const segmentTraveled =
            traveledDistance - (accumulatedDistance - segmentDistance);
          const segmentProgress = segmentTraveled / segmentDistance;

          const currentLat =
            previousPoint[1] +
            (nextPoint[1] - previousPoint[1]) * segmentProgress;
          const currentLon =
            previousPoint[0] +
            (nextPoint[0] - previousPoint[0]) * segmentProgress;

          setUserLocation({
            latitude: currentLat,
            longitude: currentLon,
          });

          setViewState((prevState) => ({
            ...prevState,
            latitude: currentLat,
            longitude: currentLon,
            zoom: 17,
            pitch: 45,
            transitionDuration: updateInterval,
          }));
          break;
        }
      }

      if (traveledDistance >= totalDistance) {
        clearInterval(newIntervalId);
        setIntervalId(null);
        if (onComplete) onComplete(); // Gọi onComplete khi hoàn thành hành trình
        return;
      }
    }, updateInterval);

    setIntervalId(newIntervalId);
  };

  // Hàm lưu thông tin lộ trình vào database
const saveRouteToDatabase = async (
    startLocation,
    endLocation,
    journeyDate
) => {
    try {
        const token = localStorage.getItem("token");
        const postData = {
            startLocation: {
                latitude: startLocation.latitude,
                longitude: startLocation.longitude,
            },
            endLocation: {
                latitude: endLocation.latitude,
                longitude: endLocation.longitude,
            },
            journeyDate: moment(journeyDate).format('YYYY-MM-DD HH:mm:ss'), // Định dạng ngày tháng thành chuỗi "yyyy-MM-dd HH:mm:ss"
        };

        console.log("Saving route with data:", postData);

        const response = await axios.post(
            "http://localhost:8080/api/v1/routes/post-route",
            postData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log("Route saved successfully: ", response.data);
    } catch (error) {
        console.error("Error saving route:", error);
    }
};


  // Hàm đóng lại thông tin chỉ đường
  const handleCloseDirectionClick = () => {
    setRoute(null);
    setRouteDots([]);
    setSelectedBikeLocation(null);
    clearInterval(intervalId);
  };

  // Hàm hiển thị lịch sử hành trình
  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <div
      className={`your-bike-container ${
        showBikeList ? "small-map-container" : ""
      }`}
    >
      {showBikeList && (
        <div className="bike-list">
          {bikes.length > 0 ? (
            bikes.map((bike) => (
              <div key={bike.id} className="bike-item">
  <img
    src={`http://localhost:8080/api/v1/images/${bike.imageUrl}`}
    alt={bike.name}
    className="bike-image"
  />
  <div className="bike-info">
    <h3>{bike.name}</h3>
    {bike.longitude && bike.latitude ? (
      <div className="button-container">
        {route &&
        selectedBikeLocation &&
        selectedBikeLocation.id === bike.id ? (
          <>
            <button onClick={handleStartNavigation}>Start</button>
            <button
              className="close-directions-button"
              onClick={handleCloseDirectionClick}
            >
              <IoCloseCircleOutline size={24} />
            </button>
          </>
        ) : (
          <button onClick={() => handleDirectionClick(bike)}>
            Directions
          </button>
        )}
      </div>
    ) : (
      <p>Location not available</p>
    )}
  </div>
</div>
            ))
          ) : (
            <p>No bikes found.</p>
          )}
        </div>
      )}
      <div className="map-container">
      <Map
  {...viewState}
  style={{ width: "100%", height: "75vh" }}
  mapStyle="mapbox://styles/mapbox/streets-v12"
  onMove={(evt) => setViewState(evt.viewState)}
  mapboxAccessToken={mapboxToken}
>
  {/* Marker của người dùng */}
  {userLocation && (
    <Marker
      longitude={userLocation.longitude}
      latitude={userLocation.latitude}
      color="blue"
      onClick={() => handleMarkerClick("user")}
    >
      <div className="custom-user-icon">
        <IoLocation />
      </div>
    </Marker>
  )}

  {/* Marker của các xe đạp */}
  {bikes.map(bike => (
  bike.longitude && bike.latitude && (
    <div 
      key={bike.id}
      onMouseEnter={() => {
        setHoveredBike(bike);
        setHoveredCoordinates({
          longitude: bike.longitude,
          latitude: bike.latitude,
        });
      }}
      onMouseLeave={() => {
        setHoveredBike(null); // Xóa hover khi chuột rời khỏi
        setHoveredCoordinates(null);
      }}
    >
      <Marker
        longitude={bike.longitude}
        latitude={bike.latitude}
      >
        <div
          className="custom-bike-icon"
          onClick={() => handleMarkerClick(bike)}
        >
          <IoLocation />
        </div>
      </Marker>
    </div>
  )
))}


  {/* Hiển thị Popup khi hover vào xe đạp */}
  {hoveredBike && hoveredCoordinates && (
  <Popup
    longitude={hoveredCoordinates.longitude}
    latitude={hoveredCoordinates.latitude}
    closeButton={false}
    offsetTop={-10}
  >
    <BikeInfoPopup
      bike={hoveredBike}
      coordinates={hoveredCoordinates}
    />
  </Popup>
)}


  {/* Hiển thị lộ trình nếu tồn tại */}
  {route && (
    <>
      <Source id="route" type="geojson" data={route}>
        <Layer
          id="routeLayer"
          type="line"
          layout={{ "line-join": "round", "line-cap": "round" }}
          paint={{ "line-color": "#f28b50", "line-width": 8 }}
        />
      </Source>
      <Source
        id="dots"
        type="geojson"
        data={{
          type: "FeatureCollection",
          features: routeDots.map(dot => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: dot,
            },
          })),
        }}
      >
        <Layer
          id="dotLayer"
          type="circle"
          paint={{
            "circle-radius": 5,
            "circle-color": "#FFFFFF",
            "circle-stroke-width": 2,
            "circle-stroke-color": "#de7345",
          }}
        />
      </Source>
    </>
  )}
</Map>

      </div>

      {/* Nút để hiển thị lịch sử hành trình */}
      <button className="history-button" onClick={toggleHistory}>
        {showHistory ? "Hide History" : "Show History"}
      </button>

      {/* Phần hiển thị lịch sử nếu showHistory == true */}
      {showHistory && (
        <div className="history-container">
          <h3>History of Your Journeys</h3>
          <ul>
            {historyWithAddresses.map((entry, index) => (
              <li key={index}>
                Start: {entry.startAddress} - <br />
                End: {entry.endAddress} <br />
                Date: {new Date(entry.journeyDate).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default YourBike;

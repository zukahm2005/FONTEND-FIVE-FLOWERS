import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Map, { Marker, NavigationControl, Source, Layer, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { IoLocation, IoCloseCircleOutline } from "react-icons/io5";
import mapboxSdk from '@mapbox/mapbox-sdk/services/directions';
import mapboxgl from 'mapbox-gl';
import "./yourBike.scss";
import BikeInfoPopup from './bikeInfo/BikeInfoPopup';

const mapboxToken = 'pk.eyJ1IjoienVrYWhtMms1IiwiYSI6ImNtMGNvb2wwZzAwdTcybHM2ODFpZ3p3Z3MifQ.UPYPfCuIQeqUWDyt1SspVQ';
const directionsClient = mapboxSdk({ accessToken: mapboxToken });

const YourBike = () => {
  const [viewState, setViewState] = useState({
    longitude: 105.782098,
    latitude: 21.028511,
    zoom: 13
  });
  const [bikes, setBikes] = useState([]);
  const [userLocation, setUserLocation] = useState({
    longitude: 105.782098,
    latitude: 21.028511,
  });
  const [route, setRoute] = useState(null);
  const [routeDots, setRouteDots] = useState([]);
  const [showBikeList, setShowBikeList] = useState(false);
  const [selectedBikeLocation, setSelectedBikeLocation] = useState(null);
  const [hoveredBike, setHoveredBike] = useState(null);
  const [hoveredCoordinates, setHoveredCoordinates] = useState(null);
  const [userMarkerClicked, setUserMarkerClicked] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [history, setHistory] = useState([]); // State để lưu lịch sử hành trình
  const [showHistory, setShowHistory] = useState(false); // State để hiển thị lịch sử

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('/api/v1/user/bikes', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      const updatedBikes = response.data.map(bike => {
        const randomPosition = getRandomPosition(userLocation);
        return {
          ...bike,
          longitude: randomPosition.longitude,
          latitude: randomPosition.latitude
        };
      });
      setBikes(updatedBikes);
    })  
    .catch(error => {
      console.error('Error fetching bikes:', error);
    });
  }, []);

  useEffect(() => {
    fetchHistory(); // Fetch history on component mount
  }, []);

  const fetchHistory = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:8080/api/v1/routes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const getRandomPosition = (userLocation) => {
    const R = 6371; // Earth's radius in km
    const maxDist = 4; // Max distance in km
    const distance = Math.random() * maxDist;
    const bearing = Math.random() * 2 * Math.PI;

    const userLatRad = userLocation.latitude * Math.PI / 180;
    const userLngRad = userLocation.longitude * Math.PI / 180;

    const newLatRad = Math.asin(Math.sin(userLatRad) * Math.cos(distance / R) +
      Math.cos(userLatRad) * Math.sin(distance / R) * Math.cos(bearing));
    const newLngRad = userLngRad + Math.atan2(Math.sin(bearing) * Math.sin(distance / R) * Math.cos(userLatRad),
      Math.cos(distance / R) - Math.sin(userLatRad) * Math.sin(newLatRad));

    return {
      latitude: newLatRad * 180 / Math.PI,
      longitude: newLngRad * 180 / Math.PI
    };
  };

  const handleMarkerClick = (location) => {
    if (location === 'user') {
      const isClickedAgain = !userMarkerClicked;
      setUserMarkerClicked(isClickedAgain);

      if (isClickedAgain) {
        const bounds = new mapboxgl.LngLatBounds();

        bounds.extend([userLocation.longitude, userLocation.latitude]);

        bikes.forEach(bike => {
          bounds.extend([bike.longitude, bike.latitude]);
        });

        setViewState({
          ...viewState,
          longitude: userLocation.longitude,
          latitude: userLocation.latitude,
          zoom: 13
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

        const sortedBikes = [bikeLocation, ...bikes.filter(bike => bike.id !== bikeLocation.id)];

        setBikes(sortedBikes);

        setShowBikeList(true);

        setViewState({
          longitude: bikeLocation.longitude,
          latitude: bikeLocation.latitude,
          zoom: 15
        });
      }
    }
  };

  const handleDirectionClick = (bikeLocation) => {
    if (userLocation && bikeLocation) {
      directionsClient.getDirections({
        profile: 'driving',
        geometries: 'geojson',
        waypoints: [
          {
            coordinates: [userLocation.longitude, userLocation.latitude]
          },
          {
            coordinates: [bikeLocation.longitude, bikeLocation.latitude]
          }
        ]
      })
      .send()
      .then(response => {
        const directions = response.body.routes[0];
        setRoute(directions.geometry);

        setSelectedBikeLocation(bikeLocation);

        const sortedBikes = [bikeLocation, ...bikes.filter(bike => bike.id !== bikeLocation.id)];

        setBikes(sortedBikes);

        const coords = directions.geometry.coordinates;
        const dots = coords.filter((coord, index) => index % 3 === 0);
        setRouteDots(dots);

        const midPoint = {
          longitude: (userLocation.longitude + bikeLocation.longitude) / 2,
          latitude: (userLocation.latitude + bikeLocation.latitude) / 2,
        };

        setViewState({
          longitude: midPoint.longitude,
          latitude: midPoint.latitude,
          zoom: 13
        });

        console.log('Route:', directions.geometry);

      })
      .catch(error => {
        console.error('Error fetching directions:', error);
      });
    } else {
      console.error('User location or bike location is missing');
    }
  };

  const getDistance = (start, end) => {
    const [lng1, lat1] = start;
    const [lng2, lat2] = end;

    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;

    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    return distance;
  };

  const handleStartNavigation = async () => {
    console.log('Starting navigation...');
    
    if (!selectedBikeLocation || !userLocation) {
        console.log('Missing selectedBikeLocation or userLocation');
        return;
    }

    const directions = await directionsClient.getDirections({
        profile: 'cycling',
        waypoints: [
            { coordinates: [userLocation.longitude, userLocation.latitude] },
            { coordinates: [selectedBikeLocation.longitude, selectedBikeLocation.latitude] }
        ],
        geometries: 'geojson'
    }).send();

    const route = directions.body.routes[0].geometry;
    setRoute(route);

    const currentDate = new Date(); // Lấy ngày giờ hiện tại

    // Bắt đầu di chuyển và lưu sau khi hoàn thành
    simulateMovement(route, 30000, async () => {
        await saveRouteToDatabase(userLocation, selectedBikeLocation, currentDate);
        fetchHistory(); // Fetch history after saving new route
    });
  };

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

    const speed = totalDistance / (duration / 1000);
    const startTime = Date.now();
    const frameRate = 60;
    const updateInterval = 1000 / frameRate;

    clearInterval(intervalId);
    const newIntervalId = setInterval(() => {
        const elapsedTime = (Date.now() - startTime) / 1000;
        const traveledDistance = speed * elapsedTime;

        let accumulatedDistance = 0;
        for (let i = 0; i < totalPoints - 1; i++) {
            const segmentDistance = getDistance(routeCoordinates[i], routeCoordinates[i + 1]);
            accumulatedDistance += segmentDistance;

            if (accumulatedDistance >= traveledDistance) {
                const previousPoint = routeCoordinates[i];
                const nextPoint = routeCoordinates[i + 1];
                const segmentTraveled = traveledDistance - (accumulatedDistance - segmentDistance);
                const segmentProgress = segmentTraveled / segmentDistance;

                const currentLat = previousPoint[1] + (nextPoint[1] - previousPoint[1]) * segmentProgress;
                const currentLon = previousPoint[0] + (nextPoint[0] - previousPoint[0]) * segmentProgress;

                setUserLocation({
                    latitude: currentLat,
                    longitude: currentLon
                });

                setViewState(prevState => ({
                    ...prevState,
                    latitude: currentLat,
                    longitude: currentLon,
                    zoom: 17,
                    pitch: 45,
                    transitionDuration: updateInterval
                }));
                break;
            }
        }

        if (traveledDistance >= totalDistance) {
            clearInterval(newIntervalId);
            setIntervalId(null);
            if (onComplete) onComplete(); // Gọi onComplete khi hoàn thành
            return;
        }
    }, updateInterval);

    setIntervalId(newIntervalId);
  };

  const saveRouteToDatabase = async (startLocation, endLocation, journeyDate) => {
    try {
        const token = localStorage.getItem('token');
        const postData = {
            startLocation: {
                latitude: startLocation.latitude,
                longitude: startLocation.longitude
            },
            endLocation: {
                latitude: endLocation.latitude,
                longitude: endLocation.longitude
            },
            journeyDate: journeyDate.toISOString() // Chuyển thành định dạng ISO
        };

        const response = await axios.post('http://localhost:8080/api/v1/routes', postData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Route saved successfully:', response.data);
    } catch (error) {
        console.error('Error saving route:', error);
    }
  };

  const handleCloseDirectionClick = () => {
    setRoute(null);
    setRouteDots([]);
    setSelectedBikeLocation(null);
    clearInterval(intervalId);
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory); // Toggle visibility of history
  };

  return (
    <div className={`your-bike-container ${showBikeList ? 'small-map-container' : ''}`}>
      {showBikeList && (
        <div className="bike-list">
          {bikes.length > 0 ? (
            bikes.map(bike => (
              <div key={bike.id} className="bike-item">
                <h3>{bike.name}</h3>
                <img
                  src={`http://localhost:8080/api/v1/images/${bike.imageUrl}`}
                  alt={bike.name}
                  className="bike-image"
                />
                {bike.longitude && bike.latitude ? (
                  <div className="button-container">
                    {route && selectedBikeLocation && selectedBikeLocation.id === bike.id ? (
                      <>
                        <button onClick={handleStartNavigation}>Start</button>
                        <button className="close-directions-button" onClick={handleCloseDirectionClick}>
                          <IoCloseCircleOutline size={24} />
                        </button>
                      </>
                    ) : (
                      <button onClick={() => handleDirectionClick(bike)}>Directions</button>
                    )}
                  </div>
                ) : (
                  <p>Location not available</p>
                )}
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
          style={{ width: '100%', height: '75vh' }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          onMove={evt => setViewState(evt.viewState)}
          mapboxAccessToken={mapboxToken}
        >
          {userLocation && (
            <Marker longitude={userLocation.longitude} latitude={userLocation.latitude} color="blue" onClick={() => handleMarkerClick('user')}>
              <div className="custom-user-icon"><IoLocation /></div>
            </Marker>
          )}
          {bikes.map(bike => (
            bike.longitude && bike.latitude && (
              <Marker 
                key={bike.id} 
                longitude={bike.longitude} 
                latitude={bike.latitude}
                onMouseEnter={() => { setHoveredBike(bike); setHoveredCoordinates({ longitude: bike.longitude, latitude: bike.latitude }); }}
                onMouseLeave={() => { setHoveredBike(null); setHoveredCoordinates(null); }}
              >
                <div className="custom-bike-icon" onClick={() => handleMarkerClick(bike)}><IoLocation /></div>
              </Marker>
            )
          ))}
          {route && (
            <>
              <Source id="route" type="geojson" data={route}>
                <Layer
                  id="routeLayer"
                  type="line"
                  layout={{ "line-join": "round", "line-cap": "round" }}
                  paint={{ "line-color": "#4058f5", "line-width": 8 }}
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
                    "circle-stroke-color": "#4058f5",
                  }}
                />
              </Source>
            </>
          )}
          {hoveredBike && hoveredCoordinates && (
            <Popup
              longitude={hoveredCoordinates.longitude}
              latitude={hoveredCoordinates.latitude}
              closeButton={false}
              offsetTop={-10}
            >
              <BikeInfoPopup bike={hoveredBike} coordinates={hoveredCoordinates} />
            </Popup>
          )}
          <NavigationControl position="top-left" />
        </Map>
      </div>

      {/* Nút để hiển thị lịch sử hành trình */}
      <button className="history-button" onClick={toggleHistory}>
        {showHistory ? 'Hide History' : 'Show History'}
      </button>

      {/* Phần hiển thị lịch sử nếu showHistory == true */}
      {showHistory && (
        <div className="history-container">
          <h3>History of Your Journeys</h3>
          <ul>
            {history.map((entry, index) => (
              <li key={index}>
                Start: ({entry.startLocation.latitude}, {entry.startLocation.longitude}) <br />
                End: ({entry.endLocation.latitude}, {entry.endLocation.longitude}) <br />
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

import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import "./conTact.scss";

const Contact = () => {
  const mapContainerRef = useRef(null);

  // Set up Mapbox access token
  mapboxgl.accessToken = 'pk.eyJ1IjoienVrYWhtMms1IiwiYSI6ImNtMGNvb2wwZzAwdTcybHM2ODFpZ3p3Z3MifQ.UPYPfCuIQeqUWDyt1SspVQ';

  useEffect(() => {
    // Create a map instance
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11', // Sử dụng kiểu bản đồ Google Maps
      center: [105.83416, 21.027763], // Tọa độ Hà Nội
      zoom: 12, // Mức độ phóng to
    });

    // Create a marker for the store's location (modify this with your store's coordinates)
    const storeCoordinates = [105.804817, 21.028511]; // Example store location in Hanoi
    new mapboxgl.Marker({ color: 'red' })
      .setLngLat(storeCoordinates)
      .addTo(map);

    // Clean up on unmount
    return () => map.remove();
  }, []);

  return (
    <div className="contact-wrapper">
      <div className="contact-background"></div>

      <div className="contact-container">
        <div className="top-contact-container">
          <div className="name-top-contact-container">
            <h1>CONTACT</h1>
          </div>
          <div className="name-bottom-contact-container">
            <div className="home-contact">
              <p>Home</p>
            </div>
            <span className="contact-sep">
              <p>/</p>
            </span>
            <p>Contact</p>
          </div>
        </div>
      </div>

      {/* Bản đồ Mapbox */}
      <div className="map-container" ref={mapContainerRef}></div>

      {/* Phần Thông tin liên hệ */}
      <div className="contact-info">
        <div className="contact-info-card">
          <FaPhoneAlt size={30} color="#f54c4c" />
          <h3>Phone</h3>
          <p><strong>Toll-Free:</strong> 0000-123-456789</p>
          <p><strong>Fax:</strong> 0000-123-456789</p>
        </div>
        <div className="contact-info-card">
          <FaEnvelope size={30} color="#f54c4c" />
          <h3>Email</h3>
          <p>mail@example.com</p>
          <p>support@example.com</p>
        </div>
        <div className="contact-info-card">
          <FaMapMarkerAlt size={30} color="#f54c4c" />
          <h3>Address</h3>
          <p>No: 58 A, East Madision Street,</p>
          <p>Baltimore, MD, USA 4508</p>
        </div>
      </div>

      {/* Phần Form Liên hệ */}
      <div className="contact-form">
        <h2>Contact Form</h2>
        <form>
          <div className="form-group">
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <input type="tel" placeholder="Phone" />
          </div>
          <div className="form-group">
            <textarea placeholder="Message"></textarea>
          </div>
          <button type="submit" className="send-button-contact">SEND</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;

import React, { useRef, useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";
import "./conTact.scss";

const Contact = () => {
  const mapContainerRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

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

    // Create a marker for the store's location
    const storeCoordinates = [105.804817, 21.028511]; // Example store location in Hanoi
    new mapboxgl.Marker({ color: 'red' })
      .setLngLat(storeCoordinates)
      .addTo(map);

    // Clean up on unmount
    return () => map.remove();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/api/v1/contact/submit", formData);
      alert("Message sent successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: ""
      }); // Reset form after submission
    } catch (error) {
      console.error("There was an error sending the message!", error);
    }
  };

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
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button type="submit" className="send-button-contact">
            SEND
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;

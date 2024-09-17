import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaTwitter,
} from "react-icons/fa";
import "./footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="logo">
          <img
            src="/logocam01.png"
            alt="Bike Club Logo"
          />
        </div>
        <h2 className="subscribe-title">Subscribe Our Newsletter</h2>
        <div className="subscribe-form">
         <div className='subscribe-group'> 
          <input type="email" placeholder="Your email address"/>
         <button>Subscribe</button></div>
        </div>
        <div className="social-links">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://pinterest.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaPinterestP />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram />
          </a>
        </div>
        <div className="footer-links">
          <a>Terms & Conditions</a>
          <a>Privacy Policy</a>
          <a>Press Release</a>
          <a>Contact</a>
        </div>
        <div className="horizontal-line"></div>
        <div className="copyright">
          © 2024 Bikex Club (password: buddha) Design Themes
        </div>
      </div>
     
     
    </footer>
  );
};

export default Footer;

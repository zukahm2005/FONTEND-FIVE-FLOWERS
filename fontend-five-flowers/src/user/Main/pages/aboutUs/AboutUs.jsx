import React from "react";
import "./AboutUs.scss";
import { FaFacebookF, FaTwitter, FaPinterest, FaYoutube } from "react-icons/fa";

const AboutUs = () => {
  return (
    <div className="aboutus-wrapper">
      {/* Div chứa background image */}
      <div className="aboutus-background"></div>

      <div className="aboutus-container">
        <div className="top-aboutus-container">
          <div className="name-top-aboutus-container">
            <h1>ABOUT US</h1>
          </div>
          <div className="name-bottom-aboutus-container">
            <div className="home-aboutus">
              <p>Home</p>
            </div>
            <span className="aboutus-sep">
              <p>/</p>
            </span>
            <p>About Us</p>
          </div>
        </div>

        {/* Div chứa hình ảnh */}
        <div className="aboutus-images">
          <div className="image-container">
            <img
              src="https://bikex-club.myshopify.com/cdn/shop/files/about-new-1.jpg?v=1631946007"
              alt="Comfort Bikes"
            />
            <div className="image-overlay">
              <h2>Comfort Bikes</h2>
              <h3>Road Bike</h3>
              <div className="underline"></div>
              <p>
                Morbi in risus in nisi eleifend convallis. Etiam utriumered
                pretium varius in aliquam.
              </p>
            </div>
          </div>
          <div className="image-container">
            <img
              src="https://bikex-club.myshopify.com/cdn/shop/files/about-new-2.jpg?v=1631946051"
              alt="Electric Bikes"
            />
            <div className="image-overlay">
              <h2>Electric Bikes</h2>
              <h3>Pedelec</h3>
              <div className="underline"></div>
              <p>
                Sed semper ante sapien tincidunt, commodo odiodumter pretium.
                Fusce posuere.
              </p>
            </div>
          </div>
          <div className="image-container">
            <img
              src="https://bikex-club.myshopify.com/cdn/shop/files/about-new-3.jpg?v=1631946080"
              alt="Hybrid Bicycles"
            />
            <div className="image-overlay">
              <h2>Hybrid Bicycles</h2>
              <h3>City Bike</h3>
              <div className="underline"></div>
              <p>
                Cras sagittis sapien tellus, lacinia nunciu mumereumred tumes
                suscipit vitae.
              </p>
            </div>
          </div>
        </div>

        {/* Phần Subtitle và tiêu đề */}
        <div className="suspension-container">
          <div className="underline-red"></div>
          <h2 className="title-main">Suspension Components</h2>
          <div className="title-background">SUBTITLE</div>
        </div>

        {/* Danh sách các icon */}
        <div className="components-list">
          <div className="component-item">
            <div className="icon-wrapper">
              <img
                src="https://bikex-club.myshopify.com/cdn/shop/files/about-icon-1.png?v=1631946105"
                alt="Head Protectors"
              />
            </div>
            <h3>Head Protectors</h3>
            <p>Donec sed lorem dapibus, posuere dui eget.</p>
          </div>
          <div className="component-item">
            <div className="icon-wrapper">
              <img
                src="https://bikex-club.myshopify.com/cdn/shop/files/about-icon-2.png?v=1631946118"
                alt="Freewheels"
              />
            </div>
            <h3>Freewheels</h3>
            <p>Curabitur vitae molestie urna duis accumsan.</p>
          </div>
          <div className="component-item">
            <div className="icon-wrapper">
              <img
                src="https://bikex-club.myshopify.com/cdn/shop/files/about-icon-3.png?v=1631946133"
                alt="Head Lights"
              />
            </div>
            <h3>Head Lights</h3>
            <p>Fusce ullamcorper pulvinar enim ac elementum.</p>
          </div>
          <div className="component-item">
            <div className="icon-wrapper">
              <img
                src="https://bikex-club.myshopify.com/cdn/shop/files/about-icon-4.png?v=1631946147"
                alt="Brake Parts"
              />
            </div>
            <h3>Brake Parts</h3>
            <p>Aliquam quam diam, ornare at luctus quis ligula.</p>
          </div>
          <div className="component-item">
            <div className="icon-wrapper">
              <img
                src="https://bikex-club.myshopify.com/cdn/shop/files/about-icon-5.png?v=1631946162"
                alt="Chain"
              />
            </div>
            <h3>Chain</h3>
            <p>Pellentesque habitant mor tristique amet senectus.</p>
          </div>
        </div>

        {/* Phần Join Us */}
        <div className="join-us-section">
          <div className="join-us-content">
            <div className="text-content">
              <h2 className="join-us-title">
                <span className="highlight">JOIN US:</span> GET A BIKE, GET A
                LIFE.
              </h2>
              <p className="join-us-description">
                Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed
                fringilla mauris sit amet nibh. Donec sodales sagittis magna.
                Sed consequat, leo eget bibendum sodales, augue velit cursus
                nunc.
              </p>
            </div>
            <div className="button-wrapper">
              <button className="shop-now-button">SHOP NOW</button>
            </div>
          </div>
        </div>

        {/* Four Bicycle Cards Section (Phần Thêm) */}
        <div className="bicycle-section">
          <div className="bicycle-top">
        <div className="underline-red"></div>
        <h1 className="section-title">KING OF BICYCLES</h1>
        <div className="background-text">DUIS LEO</div>
        </div>
          <div className="bicycle-grid">
            {/* Your bicycle cards */}
            <div className="bicycle-card">
              <img
                src="https://bikex-club.myshopify.com/cdn/shop/files/about-new-6_600x.jpg?v=1631946191"
                alt="Single Speed Bike"
                className="bicycle-image"
              />
              <div className="bicycle-info">
                <div className="content-card">
                  <h2 className="bicycle-title">Single Speed</h2>
                  <p className="bicycle-description">
                    Vestibulum enim nulla, sollicitudin ac hendrerit nec, tempor
                    quis nisl. Sed vestibulum nulla elementum auctor tincidunt.
                    Aliquam sit amet cursus mauris. Sed vitae mattis ipsum.
                  </p>
                  <span className="bicycle-price">$10.99</span>
                </div>
              </div>
            </div>
            <div className="bicycle-card">
              <img
                src="https://bikex-club.myshopify.com/cdn/shop/files/about-new-5_600x.jpg?v=1631946443"
                alt="Fixed Gears Bike"
                className="bicycle-image"
              />
              <div className="bicycle-info">
                <div className="content-card">
                  <h2 className="bicycle-title">Fixed Gears</h2>
                  <p className="bicycle-description">
                    Vestibulum enim nulla, sollicitudin ac hendrerit nec, tempor
                    quis nisl. Sed vestibulum nulla elementum auctor tincidunt.
                    Aliquam sit amet cursus mauris. Sed vitae mattis ipsum.
                  </p>
                  <span className="bicycle-price">$12.99</span>
                </div>
              </div>
            </div>
            <div className="bicycle-card">
              <img
                src="https://bikex-club.myshopify.com/cdn/shop/files/about-new-4_600x.jpg?v=1631946463"
                alt="Hub Gears Bike"
                className="bicycle-image"
              />
              <div className="bicycle-info-bottom">
                <div className="content-card">
                  <h2 className="bicycle-title">Hub Gears</h2>
                  <p className="bicycle-description">
                    Vestibulum enim nulla, sollicitudin ac hendrerit nec, tempor
                    quis nisl. Vestibulum nulla elementum auctor tincidunt.
                    Aliquam sit amet cursus mauris. Sed vitae mattis ipsum.
                  </p>
                  <span className="bicycle-price">$9.99</span>
                </div>
              </div>
            </div>
            <div className="bicycle-card">
              <img
                src="https://bikex-club.myshopify.com/cdn/shop/files/about-new-7_600x.jpg?v=1631946498"
                alt="Derailleur Gears Bike"
                className="bicycle-image"
              />
              <div className="bicycle-info-bottom">
                <div className="content-card">
                  <h2 className="bicycle-title">Derailleur Gears</h2>
                  <p className="bicycle-description">
                    Sed vestibulum nulla elementum auctor tincidunt. Aliquam sit
                    amet cursus mauris. Sed vitae mattis ipsum. Vestibulum enim
                    nulla, sollicitudin ac hendrerit nec, tempor quis nisl
                  </p>
                  <span className="bicycle-price">$15.99</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Our Team Section */}
        <div className="our-team-section">
          <div className="team-header">
            <div className="underline-red"></div>
            <h1 className="section-title">Meet Our Support Members</h1>
            <div className="background-text">OUR TEAM</div>
          </div>

          <div className="team-grid">
            <div className="team-member">
              <div className="team-image-container">
                <img
                  src="https://bikex-club.myshopify.com/cdn/shop/files/about-new-11_800x.jpg?v=1631946572"
                  alt="Regina Carter"
                />
                <div className="team-overlay">
                  <a href="#">
                    <FaFacebookF />
                  </a>
                  <a href="#">
                    <FaTwitter />
                  </a>
                  <a href="#">
                    <FaPinterest />
                  </a>
                  <a href="#">
                    <FaYoutube />
                  </a>
                </div>
              </div>
              <h3>Regina Carter</h3>
              <p>Store Manager</p>
            </div>

            <div className="team-member">
              <div className="team-image-container">
                <img
                  src="https://bikex-club.myshopify.com/cdn/shop/files/about-new-10_800x.jpg?v=1631946595"
                  alt="Andy Harris"
                />
                <div className="team-overlay">
                  <a href="#">
                    <FaFacebookF />
                  </a>
                  <a href="#">
                    <FaTwitter />
                  </a>
                  <a href="#">
                    <FaPinterest />
                  </a>
                  <a href="#">
                    <FaYoutube />
                  </a>
                </div>
              </div>
              <h3>Andy Harris</h3>
              <p>Sales Associate</p>
            </div>

            <div className="team-member">
              <div className="team-image-container">
                <img
                  src="https://bikex-club.myshopify.com/cdn/shop/files/about-new-9_800x.jpg?v=1631946609"
                  alt="Sonya Gilbert"
                />
                <div className="team-overlay">
                  <a href="#">
                    <FaFacebookF />
                  </a>
                  <a href="#">
                    <FaTwitter />
                  </a>
                  <a href="#">
                    <FaPinterest />
                  </a>
                  <a href="#">
                    <FaYoutube />
                  </a>
                </div>
              </div>
              <h3>Sonya Gilbert</h3>
              <p>Customer Support</p>
            </div>

            <div className="team-member">
              <div className="team-image-container">
                <img
                  src="https://bikex-club.myshopify.com/cdn/shop/files/about-new-8_800x.jpg?v=1631946627"
                  alt="Lena Robertson"
                />
                <div className="team-overlay">
                  <a href="#">
                    <FaFacebookF />
                  </a>
                  <a href="#">
                    <FaTwitter />
                  </a>
                  <a href="#">
                    <FaPinterest />
                  </a>
                  <a href="#">
                    <FaYoutube />
                  </a>
                </div>
              </div>
              <h3>Lena Robertson</h3>
              <p>Production Manager</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

import React from "react";
import "./AboutUs.scss";

const AboutUs = () => {
  return (
    <div className="aboutus-container">
      <div className="aboutus-header-container">
        <header className="aboutus-header">
          <h1>ABOUT US</h1>
          <nav>
            <a href="/">Home</a> <span>/</span> <span>About Us</span>
          </nav>
        </header>
      </div>

      <section className="aboutus-images">
        <div className="aboutus-section-container">
          <div className="aboutus-images-containe">
            <div className="aboutus-images-container-content">
              <h6 className="dt-sc-sub-title">Comfort Bikes</h6>
              <h4 className="dt-sc-main-title">Road Bike</h4>
              <p>
                Morbi in risus in nisi eleifend convallis. Etiam utriumered
                pretium varius in aliquam.
              </p>
              <div className="underline"></div>
            </div>
            <img
              src="https://bikex-club.myshopify.com/cdn/shop/files/about-new-1.jpg?v=1631946007"
              alt="Image 1"
            />
          </div>

          <div className="aboutus-images-containe">
            <div className="aboutus-images-container-content">
              <h6 className="dt-sc-sub-title">Electric Bikes</h6>
              <h4 className="dt-sc-main-title">Pedelec</h4>
              <p>
                Sed semper ante sapien tincidunt, commodo odiodumter pretium.
                Fusce posuere
              </p>
              <div className="underline"></div>
            </div>
            <img
              src="https://bikex-club.myshopify.com/cdn/shop/files/about-new-2.jpg?v=1631946051"
              alt="Image 2"
            />
          </div>
          <div className="aboutus-images-containe">
            <div className="aboutus-images-container-content">
              <h6 className="dt-sc-sub-title">Hybrid Bicycles</h6>
              <h4 className="dt-sc-main-title">City Bike</h4>
              <p>
                Cras sagittis sapien tellus, lacinia nunciu mumeriumered tumes
                suscipit vitae.
              </p>
              <div className="underline"></div>
            </div>
            <img
              src="https://bikex-club.myshopify.com/cdn/shop/files/about-new-3.jpg?v=1631946080"
              alt="Image 3"
            />
          </div>
        </div>
      </section>

      <section className="aboutus-components">
      <div className="aboutus-section-container-subh2">
            <p>SUSPENSION</p>
          </div>
        <div className="aboutus-section-container">
          <div className="aboutus-section-container-subh2">
            <p>SUSPENSION</p>
          </div>
          <h2>Suspension Components</h2>
          <div className="aboutus-component-list">
            <div className="aboutus-component">
              <img
                src="https://bikex-club.myshopify.com/cdn/shop/files/about-icon-1.png?v=1631946105"
                alt="Head Protectors"
              />
              <h3>Head Protectors</h3>
              <p>Donec sed lorem dapibus, posuere dui eget.</p>
            </div>
            <div className="aboutus-component">
              <img
                src="https://bikex-club.myshopify.com/cdn/shop/files/about-icon-2.png?v=1631946118"
                alt="Freewheels"
              />
              <h3>Freewheels</h3>
              <p>Curabitur vitae molestie urna duis accumsan.</p>
            </div>
            <div className="aboutus-component">
              <img
                src="https://bikex-club.myshopify.com/cdn/shop/files/about-icon-3.png?v=1631946133"
                alt="Head Lights"
              />
              <h3>Head Lights</h3>
              <p>Fusce ullamcorper pulvinar enim ac elementum.</p>
            </div>
            <div className="aboutus-component">
              <img
                src="https://bikex-club.myshopify.com/cdn/shop/files/about-icon-4.png?v=1631946147"
                alt="Brake Parts"
              />
              <h3>Brake Parts</h3>
              <p>Aliquam quam diam, ornare at luctus quis ligula.</p>
            </div>
            <div className="aboutus-component">
              <img
                src="https://bikex-club.myshopify.com/cdn/shop/files/about-icon-5.png?v=1631946162"
                alt="Chain"
              />
              <h3>Chain</h3>
              <p>Pellentesque habitant morbi tristique amet senectus.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="aboutus-join-us">
        <div className="aboutus-section-container">
          <div className="aboutus-join-content">
            <div className="aboutus-join-text">
              <h2>
                <span className="red-text">JOIN US:</span> GET A BIKE, GET A
                LIFE.
              </h2>
              <p>
                Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed
                fringilla mauris sit amet nibh. Donec sodales sagittis magna.
                Sed consequat, leo eget bibendum sodales, augue velit cursus
                nunc.
              </p>
            </div>
            <div className="aboutus-join-button">
              <button onClick={() => (window.location.href = "#")}>
                SHOP NOW
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="aboutus-king-of-bicycles">
        <div className="aboutus-section-container">
          <h2>KING OF BICYCLES</h2>
          <div className="aboutus-bicycles">
            <div className="aboutus-bicycle">
              <img
                src="https://bikex-club.myshopify.com/cdn/shop/files/about-new-6_1280x.jpg?v=1631946191"
                alt="Single Speed"
              />
              <div className="aboutus-bicycle_content_01">
                <h3>Single Speed</h3>
                <p>
                  Vestibulum enim nulla, sollicitudin ac hendrerit nec, tempor
                  quis nisl.
                </p>
                <button onClick={() => (window.location.href = "#")}>
                  $10.99
                </button>
              </div>
            </div>
            <div className="aboutus-bicycle">
              <img
                src="https://bikex-club.myshopify.com/cdn/shop/files/about-new-5_1280x.jpg?v=1631946443"
                alt="Fixed Gears"
              />
              <div className="aboutus-bicycle_content_02">
                <h3>Fixed Gears</h3>
                <p>
                  Zed vestibulum nulla elementum auctor tincidunt. Aliquam sit
                  amet cursus mauris.
                </p>
                <button onClick={() => (window.location.href = "#")}>
                  $12.99
                </button>
              </div>
            </div>
            <div className="aboutus-bicycle">
              <img
                src="https://bikex-club.myshopify.com/cdn/shop/files/about-new-4_1280x.jpg?v=1631946463"
                alt="Hub Gears"
              />
              <div className="aboutus-bicycle_content_03">
                <h3>Hub Gears</h3>
                <p>
                  Vestibulum enim nulla, sollicitudin ac hendrerit nec, tempor
                  quis nisl.
                </p>
                <button onClick={() => (window.location.href = "#")}>
                  $9.99
                </button>
              </div>
            </div>
            <div className="aboutus-bicycle">
              <img
                src="https://bikex-club.myshopify.com/cdn/shop/files/about-new-7_1280x.jpg?v=1631946498"
                alt="Derailleur Gears"
              />
              <div className="aboutus-bicycle_content_04">
                <h3>Derailleur Gears</h3>
                <p>
                  Sed vestibulum nulla elementum auctor tincidunt. Sed vitae
                  mattis ipsum.
                </p>
                <button onClick={() => (window.location.href = "#")}>
                  $15.99
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="aboutus-team">
        <div className="aboutus-section-container">
          <h2>Meet Our Support Members</h2>
          <div className="aboutus-team-members">
            <div className="aboutus-member">
              <img
                src="https://bikex-club.myshopify.com/cdn/shop/files/about-new-11_800x.jpg?v=1631946572"
                alt="Regina Carter"
              />
              <h3>Regina Carter</h3>
              <p>Store Manager</p>
            </div>
            <div className="aboutus-member">
              <img
                src="https://bikex-club.myshopify.com/cdn/shop/files/about-new-10_800x.jpg?v=1631946595"
                alt="Andy Harris"
              />
              <h3>Andy Harris</h3>
              <p>Sales Associate</p>
            </div>
            <div className="aboutus-member">
              <img
                src="https://bikex-club.myshopify.com/cdn/shop/files/about-new-9_800x.jpg?v=1631946609"
                alt="Sonya Gilbert"
              />
              <h3>Sonya Gilbert</h3>
              <p>Customer Support</p>
            </div>
            <div className="aboutus-member">
              <img
                src="https://bikex-club.myshopify.com/cdn/shop/files/about-new-8_800x.jpg?v=1631946627"
                alt="Lena Robertson"
              />
              <h3>Lena Robertson</h3>
              <p>Production Manager</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;

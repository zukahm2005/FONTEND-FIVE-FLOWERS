import React from "react";
import "./home.scss";
import InnovatingHome from "./innovatingHome/InnovatingHome";
import SlideProductHome from "./sliderProductHome/SlideProductHome";
import SpecialHome from "./specialHome/SpecialHome";
import SwiperHome from "./swiperHome/SwiperHome";
import VideoHome from "./videoHome/VideoHome";

const Home = ({ cart, setCart }) => {
  return (
    <div className="home-container">
      <div className="home-swiper-main">
        <SwiperHome />
      </div>
      <div className="home-innovating-main">
        <InnovatingHome />
      </div>
      <div className="home-special-main">
        <SpecialHome />
      </div>
      <div className="home-video-main">
        <VideoHome />
      </div>
      <div className="home-slider-product-main">
        <SlideProductHome setCart={setCart} cart={cart} />
      </div>
    </div>
  );
};

export default Home;

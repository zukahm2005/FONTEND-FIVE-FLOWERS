import React, { useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import ApiSwiperHome from "./apiSwiperHome/ApiSwiperHome";
import "./swiperHome.scss";

const SwiperHome = () => {
  const [activeSlide, setActiveSlide] = useState(ApiSwiperHome[0]);

  return (
    <div className="home-swiper-container">
      <div className="main-swiper">
        <div className="image-swiper">
          <img src={activeSlide.imageUrl} alt={activeSlide.nameSwiper} />
        </div>
        <div className="swiper-details">
          <div className="name-swiper-details">
            <p>{activeSlide.nameSwiper}</p>
          </div>
          <div className="desc-swiper-details">
            <p>{activeSlide.descriptionSwiper}</p>
          </div>
          <div className="button-swiper-details">
            <button className="button-swiper">
              <p>BUY NOW</p>
            </button>
          </div>
        </div>
      </div>
      <Swiper
        spaceBetween={10}
        slidesPerView={4}
        onSlideChange={(swiper) =>
          setActiveSlide(ApiSwiperHome[swiper.activeIndex])
        }
      >
        <div className="main-api-swiper">
          {ApiSwiperHome.map((item, index) => (
            <SwiperSlide key={index}>
              <img
                src={item.imageUrlBottom}
                alt={item.nameSwiper}
                onClick={() => setActiveSlide(item)}
                style={{ cursor: "pointer" }}
              />
            </SwiperSlide>
          ))}
        </div>
      </Swiper>
    </div>
  );
};

export default SwiperHome;

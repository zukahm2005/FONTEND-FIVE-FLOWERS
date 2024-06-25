import React, { useState, useEffect } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import ApiSwiperHome from "./apiSwiperHome/ApiSwiperHome";
import "./swiperHome.scss";

const SwiperHome = () => {
  const [activeSlide, setActiveSlide] = useState(ApiSwiperHome[0]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % ApiSwiperHome.length;
        setActiveSlide(ApiSwiperHome[newIndex]);
        return newIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSlideChange = (swiper) => {
    setActiveSlide(ApiSwiperHome[swiper.activeIndex]);
    setActiveIndex(swiper.activeIndex);
  };

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
        spaceBetween={35}
        slidesPerView={4}
        onSlideChange={handleSlideChange}
      >
        <div className="main-api-swiper">
          {ApiSwiperHome.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="swiper-slide-content" onClick={() => { setActiveSlide(item); setActiveIndex(index); }}>
                <img
                  src={item.imageUrlBottom}
                  alt={item.nameSwiper}
                  style={{ cursor: "pointer" }}
                  className={activeIndex !== index ? "blurred" : ""}
                />
                {activeIndex === index && (
                  <motion.div
                    className="underline"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3, ease: "linear" }}
                  />
                )}
              </div>
            </SwiperSlide>
          ))}
        </div>
      </Swiper>
    </div>
  );
};

export default SwiperHome;

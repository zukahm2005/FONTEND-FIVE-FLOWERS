import React from 'react';
import "./home.scss";
import InnovatingHome from './innovatingHome/InnovatingHome';
import SwiperHome from './swiperHome/SwiperHome';
import SpecialHome from './specialHome/SpecialHome';

const Home = () => {
  return (
    <div className='home-container'>
      <div className='home-swiper-main'><SwiperHome /></div>
      <div className='home-innovating-main'><InnovatingHome /></div>
      <div className='home-special-main'><SpecialHome/></div>
    </div>
  );
};

export default Home;

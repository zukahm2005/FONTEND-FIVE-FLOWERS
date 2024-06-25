import React from 'react'
import "./home.scss"
import SwiperHome from './swiperHome/SwiperHome'
const Home = () => {
  return (
    <div className='home-container'>
      <div className='home-swiper-main'><SwiperHome/></div>
    </div>
  )
}

export default Home
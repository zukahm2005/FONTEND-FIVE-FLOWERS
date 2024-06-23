import React from 'react'

import { Link } from 'react-router-dom'
import "./navBar.scss"
const NavBar = () => {
  return (
    <div className='nav-main'>
        <div className='nav-home'>
            <Link to="/home">Home</Link>
        </div>
        <div className='nav-shop'>
            <Link to="/shop">Shop</Link>
        </div>
        <div className='nav-news'>
            <Link to="/news">News</Link>
        </div>
        <div className='nav-aboutUs'>
            <Link to="/aboutUs">About Us</Link>
        </div>
        
        
    </div>
  )
}

export default NavBar
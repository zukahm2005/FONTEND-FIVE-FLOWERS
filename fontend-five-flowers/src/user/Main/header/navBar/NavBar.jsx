import React from 'react'

import { Link } from 'react-router-dom'
import "./navBar.scss"
const NavBar = () => {
  return (
    <div className='nav-main'>
        <div className='nav-home'>
            <Link to="/home"><p>Home</p></Link>
        </div>
        <div className='nav-shop'>
            <Link to="/shop"><p>Shop</p></Link>
        </div>
        <div className='nav-news'>
            <Link to="/news"><p>News</p></Link>
        </div>
        <div className='nav-aboutUs'>
            <Link to="/aboutUs"><p>About Us</p></Link>
        </div>
        
        
    </div>
  )
}

export default NavBar
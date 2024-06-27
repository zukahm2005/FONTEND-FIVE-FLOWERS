import React from 'react'
import "./headerAdmin.scss"
const HeaderAdmin = () => {
  return (
    <div className='header-admin-container'>
      <div className="header-main-admin">
        <div className="logo-header-admin">
          <img
            src="https://bikex-club.myshopify.com/cdn/shop/files/logo_1_300x300.png?v=1629277962"
            alt=""
          />
        </div>
        <div className="profile-header-admin">
          <p>Name admin</p>
        </div>
      </div>
    </div>
  )
}

export default HeaderAdmin
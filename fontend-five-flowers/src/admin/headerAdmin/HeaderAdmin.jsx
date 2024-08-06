import React from 'react'
import "./headerAdmin.scss"
const HeaderAdmin = () => {
  return (
    <div className='header-admin-container'>
      <div className="header-main-admin">
        <div className="logo-header-admin">
          <img
            src="/logocam02.png"
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
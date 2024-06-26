import React from 'react';
import Login from "./login/Login";
import Register from "./register/Register";
import "./profile.scss";
const Profile = () => {
  return (
    <div className='profile-container'>
        <div className="login-profile"><Login/></div>
        <div className="register-profile"><Register/></div>
    </div>
  )
}

export default Profile
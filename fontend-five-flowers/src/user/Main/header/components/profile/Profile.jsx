import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import Login from './login/Login';
import './profile.scss';
import Register from './register/Register';

const Profile = ({cart}) => {
  const [isLogin, setIsLogin] = useState(true);

  const switchToRegister = () => {
    setIsLogin(false);
  };

  const switchToLogin = () => {
    setIsLogin(true);
  };

  return (
    <div className='profile-container'>
      <AnimatePresence mode='wait'>
        {isLogin ? (
          <motion.div
            key="login"
            initial={{ x: -50, opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 50 }}
          >
            <Login switchToRegister={switchToRegister} />
          </motion.div>
        ) : (
          <motion.div
            key="register"
            initial={{ x: 50, opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{  type: 'spring', stiffness: 50 }}
          >
            <Register switchToLogin={switchToLogin} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;

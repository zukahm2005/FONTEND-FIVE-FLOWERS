import { motion } from 'framer-motion';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import "./navBar.scss";

const NavBar = () => {
  const location = useLocation();
  const activePath = location.pathname;

  return (
    <div className='nav-main'>
      {['home', 'shop', 'news', 'aboutUs'].map((item, index) => (
        <div key={index} className={`nav-${item}`}>
          <Link to={`/${item}`}>
            <motion.p
              initial={{ color: '#000' }}
              animate={{ color: activePath === `/${item}` ? '#fa3e33' : '#000' }}
              transition={{ duration: 0.5 }}
            >
              {item.toUpperCase()}
            </motion.p>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default NavBar;

import { motion } from 'framer-motion';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import "./navBar.scss";

const NavBar = () => {
  const location = useLocation();
  const activePath = location.pathname;

  return (
    <div className='nav-main'>
      {['home', 'shop', 'news', 'aboutUs','contact', 'service'].map((item, index) => (
        <div key={index} className={`nav-${item}`}>
          <Link to={`/${item}`}>
            <motion.div
              className="nav-item"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.p
                initial={{ color: '#000' }}
                animate={{ color: activePath === `/${item}` ? '#fa3e33' : '#000' }}
                transition={{ duration: 0.5 }}
              >
                {item.toUpperCase()}
              </motion.p>
              <motion.div
                className="underline"
                initial={{ width: 0 }}
                animate={{
                  width: activePath === `/${item}` ? '100%' : 0,
                  opacity: activePath === `/${item}` ? 1 : 0
                }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default NavBar;

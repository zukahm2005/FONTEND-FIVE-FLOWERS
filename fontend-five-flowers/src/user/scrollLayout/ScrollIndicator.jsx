import React, { useEffect, useState } from 'react';
import { FaArrowUpLong } from "react-icons/fa6";
import './ScrollIndicator.scss';

const ScrollIndicator = () => {
  const [scrollTop, setScrollTop] = useState(0);

  const onScroll = () => {
    const winScroll = document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    setScrollTop(scrolled);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`scroll-indicator-container ${
        scrollTop > 0 ? 'visible' : ''
      }`}
      onClick={scrollToTop}
    >
      <svg className="scroll-svg" viewBox="0 0 36 36">
      <circle
          className="scroll-static"
          cx="18" cy="18" r="17" 
        />
        <path
          className="scroll-bg"
          d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className="scroll-progress"
          d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
          style={{
            strokeDasharray: '100',
            strokeDashoffset: `${100 - scrollTop}`,
            transition: 'none'
          }}
        />
      </svg>
      <FaArrowUpLong className="scroll-icon" />
    </div>
  );
};

export default ScrollIndicator;

import { useEffect } from 'react';
import trackVisit from './trackVisit'; // Sử dụng import mặc định

const usePageTracking = () => {
  useEffect(() => {
    const page = window.location.pathname;
    trackVisit(page);
  }, []);

  return null;
};

export default usePageTracking;

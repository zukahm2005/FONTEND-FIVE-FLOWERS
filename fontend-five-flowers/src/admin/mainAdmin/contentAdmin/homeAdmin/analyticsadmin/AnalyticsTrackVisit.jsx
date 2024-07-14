import React, { useEffect } from 'react';
import axios from 'axios';

const AnalyticsTrackVisit = () => {
    useEffect(() => {
        const trackVisit = async () => {
            try {
                const token = localStorage.getItem('token'); // Lấy token từ localStorage
                await axios.post('/api/analytics/track', {
                    visitTime: new Date().toISOString(),
                    page: window.location.pathname
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } catch (error) {
                console.error('Failed to track visit', error);
            }
        };

        trackVisit();
    }, []);

    return null;
};

export default AnalyticsTrackVisit;

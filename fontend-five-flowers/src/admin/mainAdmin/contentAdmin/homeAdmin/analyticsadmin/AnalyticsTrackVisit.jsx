import React, { useLayoutEffect } from 'react';
import axios from 'axios';
import moment from 'moment-timezone';

let visitTracked = false;

const AnalyticsTrackVisit = () => {
    useLayoutEffect(() => {
        const trackVisit = async () => {
            if (!visitTracked && !localStorage.getItem('visitTracked') && !window.location.pathname.includes('/admin')) {
                try {
                    console.log('Sending visit tracking request...');

                    const visitTime = moment().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DDTHH:mm:ss');
                    console.log('Formatted visit time:', visitTime);

                    await axios.post('/api/analytics/track', {
                        visitTime: visitTime,
                        page: window.location.pathname
                    }, {
                        withCredentials: true
                    });

                    localStorage.setItem('visitTracked', 'true');
                    visitTracked = true;
                    console.log('Visit tracked successfully.');
                } catch (error) {
                    console.error('Failed to track visit', error);
                }
            } else {
                console.log('Visit already tracked or on admin page.');
            }
        };

        trackVisit();

        const handleBeforeUnload = () => {
            localStorage.removeItem('visitTracked');
            visitTracked = false;
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []); // Chỉ chạy một lần khi component được mount

    return null;
};

export default AnalyticsTrackVisit;

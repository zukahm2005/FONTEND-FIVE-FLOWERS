import axios from 'axios';
import { useEffect } from 'react';

const AnalyticsTrackVisit = () => {
    useEffect(() => {
        const trackVisit = async () => {
            try {
                console.log('Checking visit tracking conditions...');
                // Reset visitTracked khi người dùng truy cập trang mới
                sessionStorage.removeItem('visitTracked');
                const visitTracked = sessionStorage.getItem('visitTracked');
                const onAdminPage = window.location.pathname.includes('/admin');
                console.log(`visitTracked: ${visitTracked}`);
                console.log(`onAdminPage: ${onAdminPage}`);

                if (!visitTracked && !onAdminPage) {
                    console.log('Sending visit tracking request...');
                    await axios.post('/api/analytics/track', {
                        visitTime: new Date().toISOString(),
                        page: window.location.pathname
                    }, {
                        withCredentials: true
                    });
                    sessionStorage.setItem('visitTracked', 'true');
                    console.log('Visit tracked successfully.');
                } else {
                    console.log('Visit already tracked or on admin page.');
                }
            } catch (error) {
                console.error('Failed to track visit', error);
            }
        };

        trackVisit();
    }, []);

    return null;
};

export default AnalyticsTrackVisit;

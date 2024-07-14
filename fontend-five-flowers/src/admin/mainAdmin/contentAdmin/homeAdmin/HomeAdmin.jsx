import React from 'react';
import AnalyticsChart from './analyticsadmin/AnalyticsChart';
import AnalyticsTrackVisit from './analyticsadmin/AnalyticsTrackVisit';
const HomeAdmin = () => {
    return (
        <div>
            <h1>Home Admin</h1>
            <AnalyticsTrackVisit />
            <AnalyticsChart />
        </div>
    );
}

export default HomeAdmin;

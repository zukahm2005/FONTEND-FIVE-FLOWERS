import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Admin from './admin/Admin';
import User from './user/User';
import usePageTracking from './usePageTracking';
import ScreenshotPage from './user/Main/header/components/calorieConsumption/ScreenshotPage ';
import Schedule from './user/Main/header/components/practice/calorieConsumption/schedule';

const TrackingComponent = () => {
  usePageTracking();
  return null;
};

const App = () => {
  return (
    <Router>
      <TrackingComponent />
      <Routes>
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/*" element={<User />} />
        <Route path="/screenshot" element={<ScreenshotPage />} />
        <Route path="/screenshot" element={<ScreenshotPage />} />
        <Route path="/shedule" element={<Schedule />} />

      </Routes>
    </Router>
  );
};

export default App;

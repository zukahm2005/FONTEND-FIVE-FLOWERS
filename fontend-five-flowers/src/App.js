import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Admin from './admin/Admin';
import User from './user/User';
import usePageTracking from './usePageTracking';

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
      </Routes>
    </Router>
  );
};

export default App;

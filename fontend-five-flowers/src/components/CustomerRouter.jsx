import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CustomerDashboard from './CustomerDashboard';
// Import các component khác của customer

function CustomerRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CustomerDashboard />} />
      {/* Thêm các route khác cho customer */}
    </Routes>
  );
}

export default CustomerRoutes;

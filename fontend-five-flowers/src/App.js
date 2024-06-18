import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AdminRoutes from './components/AdminRouter';
import CustomerDashboard from './components/CustomerDashboard';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/customer" element={<CustomerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

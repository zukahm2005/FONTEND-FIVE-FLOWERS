import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard'; // Tạo trang Admin Dashboard
import CustomerDashboard from './components/CustomerDashboard'; // Tạo trang Customer Dashboard
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/customer" element={<CustomerDashboard />} />
        {/* Các route khác */}
      </Routes>
    </Router>
  );
}

export default App;

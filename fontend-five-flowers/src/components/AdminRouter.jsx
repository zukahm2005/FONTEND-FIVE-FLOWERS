import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
// Import các component khác của admin

function AdminRoutes() {
  return (
    <div>
      <h1>Admin Router</h1>
      <Link to="dashboard">Admin Dashboard</Link>
      <Routes>
        <Route path="dashboard" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

export default AdminRoutes;

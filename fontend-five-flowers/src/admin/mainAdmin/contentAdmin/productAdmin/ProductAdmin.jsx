import React from "react";
import { Routes, Route } from "react-router-dom";
import AddProductAdmin from "./addProductAdmin/AddProductAdmin";
import GetAllProductAdmin from "./getAllProductAdmin/GetAllProductAdmin";

const ProductAdmin = () => {
  return (
    <div className="product-admin-main-container">
      <Routes>
        <Route index element={<GetAllProductAdmin />} />
        <Route path="add" element={<AddProductAdmin />} />
        <Route path="edit/:id" element={<AddProductAdmin />} /> {/* Thêm route này */}
      </Routes>
    </div>
  );
};

export default ProductAdmin;

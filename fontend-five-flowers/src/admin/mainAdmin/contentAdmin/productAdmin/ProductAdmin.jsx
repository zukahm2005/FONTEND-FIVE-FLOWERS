import React from "react";
import { Route, Routes } from "react-router-dom";
import AddProduct from "./addProductAdmin/AddProductAdmin";
import EditProductAdmin from "./editProductAdmin/EditProductAdmin"; // Import EditProductAdmin component
import GetAllProductAdmin from "./getAllProductAdmin/GetAllProductAdmin";
const ProductAdmin = () => {
  return (
    <div className="product-admin-main-container">
      <Routes>
        <Route index element={<GetAllProductAdmin />} />
        <Route path="add" element={<AddProduct />} /> {/* Route for adding products */}
        <Route path="edit/:id" element={<EditProductAdmin />} /> {/* Route for editing products */}
      </Routes>
    </div>
  );
};

export default ProductAdmin;

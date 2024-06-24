import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import AddProduct from "./addproduct/AddProduct";

export default function ProductAdmin() {
  return (
    <div>
      <Link to="add">Add Product</Link>

      <Routes>
        <Route path="add" element={<AddProduct />} />
      </Routes>
    </div>
  );
}

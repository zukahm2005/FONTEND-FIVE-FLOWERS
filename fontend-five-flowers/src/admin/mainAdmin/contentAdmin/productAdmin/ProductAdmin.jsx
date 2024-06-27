import React from "react";
import { Route, Routes } from "react-router-dom";
import AddProduct from "./addProductAdmin/AddProductAdmin";
import GetAllProductAdmin from "./getAllProductAdmin/GetAllProductAdmin";
export default function ProductAdmin() {
  return (
    <div>
      <h1>Product Admin</h1>
      <Routes>
        <Route index element={<GetAllProductAdmin/>}/>
        <Route path="add" element={<AddProduct />} />
      </Routes>
    </div>
  );
}

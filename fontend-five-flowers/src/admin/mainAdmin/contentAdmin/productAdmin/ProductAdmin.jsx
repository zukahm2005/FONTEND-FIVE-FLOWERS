import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import AddProduct from "./addProductAdmin/AddProductAdmin";
import GetAllProductAdmin from "./getAllProductAdmin/GetAllProductAdmin";
export default function ProductAdmin() {
  return (
    <div>
      <h1>Product Admin</h1>
      <Link to="add">add product</Link>
      <Routes>
        <Route index element={<GetAllProductAdmin/>}/>
        <Route path="add" element={<AddProduct />} />
      </Routes>
    </div>
  );
}

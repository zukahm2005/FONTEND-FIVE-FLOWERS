import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import AddBrandAdmin from "./addBrandAdmin/AddBrandAdmin";
import GetAllBrandAdmin from "./getAllBrandAdmin/GetAllBrandAdmin";
export default function BrandAdmin() {
  return (
    <div>
      <h1>Brand Admin</h1>
      <Link to="add">add brand</Link>
        <Routes>
          <Route index element={<GetAllBrandAdmin/>}/>
        <Route path='add' element={<AddBrandAdmin/>}/>
      </Routes>
      
      
    </div>
  )
}

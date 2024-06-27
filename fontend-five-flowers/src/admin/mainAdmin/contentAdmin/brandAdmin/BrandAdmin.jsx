import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AddBrandAdmin from "./addBrandAdmin/AddBrandAdmin";
import GetAllBrandAdmin from "./getAllBrandAdmin/GetAllBrandAdmin";
export default function BrandAdmin() {
  return (
    <div>
      <h1>Brand Admin</h1>
        <Routes>
          <Route index element={<GetAllBrandAdmin/>}/>
        <Route path='add' element={<AddBrandAdmin/>}/>
      </Routes>
      
      
    </div>
  )
}

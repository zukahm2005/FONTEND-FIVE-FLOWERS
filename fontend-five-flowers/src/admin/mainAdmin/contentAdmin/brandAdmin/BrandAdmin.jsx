import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import AddBrandAdmin from './addBrandAdmin/AddBrandAdmin';
import GetAllBrandAdmin from './getAllBrandAdmin/GetAllBrandAdmin';

const BrandAdmin = () => {
    return (
        <div className='brand-admin-main-container'>
      <Routes>
        <Route index element={<GetAllBrandAdmin />} />
        <Route path="add" element={<AddBrandAdmin />} />
      </Routes>
    </div>
    );
};

export default BrandAdmin;

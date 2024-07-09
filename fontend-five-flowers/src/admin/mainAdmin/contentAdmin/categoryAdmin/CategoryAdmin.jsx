import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import AddCategoryAdmin from './addCategoryAdmin/AddCategoryAdmin';
import GetAllCategoryAdmin from './getAllCategoryAdmin/GetAllCategoryAdmin';
import UpdateCategoryAdmin from './updateCategoryAdmin/UpdateCategoryAdmin';

const CategoryAdmin = () => {
  return (
    <div className='category-admin-main-container'>
      <Routes>
        <Route index element={<GetAllCategoryAdmin />} />
        <Route path="add" element={<AddCategoryAdmin />} />
        <Route path="edit/:categoryId" element={<UpdateCategoryAdmin />} />
      </Routes>
    </div>
  );
};

export default CategoryAdmin;

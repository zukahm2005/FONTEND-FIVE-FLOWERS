import React from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import AddCategoryAdmin from './addCategoryAdmin/AddCategoryAdmin'
import GetAllCategory from './getAllCategoryAdmin/GetAllCategoryAdmin'

const CategoryAdmin = () => {
  return (
    <div className='category-admin-main-container'>
      <Routes>
        <Route index element={<GetAllCategory />} />
        <Route path="add" element={<AddCategoryAdmin />} />
      </Routes>
    </div>
    
  )
}

export default CategoryAdmin
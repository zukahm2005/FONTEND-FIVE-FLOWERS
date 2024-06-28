import React from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import AddCategoryAdmin from './addCategoryAdmin/AddCategoryAdmin'
import GetAllCategory from './getAllCategoryAdmin/GetAllCategoryAdmin'

const CategoryAdmin = () => {
  return (
    <div>
      <h1>Category Admin</h1>
      <Link to="add">add category</Link>
      <Routes>
        <Route index element={<GetAllCategory/>}/>
      <Route path='add' element={<AddCategoryAdmin/>}/>
    </Routes>
    </div>
    
  )
}

export default CategoryAdmin
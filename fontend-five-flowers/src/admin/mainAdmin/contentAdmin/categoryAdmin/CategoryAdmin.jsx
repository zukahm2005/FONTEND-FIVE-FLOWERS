import React from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import AddCategoryAdmin from './addCategoryAdmin/AddCategoryAdmin'
import GetAllCategory from './getAllCategoryAdmin/GetAllCategoryAdmin'
import DeleteCategoryAdmin from './deleteCategoryAdmin/DeleteCategoryAdmin'
import UpdateCategoryAdmin from './updateCategoryAdmin/UpdateCategoryAdmin'

const CategoryAdmin = () => {
  return (
    <div>
      <h1 >Category Admin</h1>
      <Link to={"delete"}>delete</Link>
      <Link to={"update"}>update</Link>
      <Routes>
        <Route index element={<GetAllCategory/>}/>
      <Route path='add' element={<AddCategoryAdmin/>}/>
      <Route path='delete' element={<DeleteCategoryAdmin/>}></Route>
      <Route path='update' element={<UpdateCategoryAdmin/>}></Route>
    </Routes>
    </div>
    
  )
}

export default CategoryAdmin
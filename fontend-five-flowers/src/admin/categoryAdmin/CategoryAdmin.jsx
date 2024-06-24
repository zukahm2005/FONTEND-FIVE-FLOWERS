import React from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import AddCategory from './addCategory/AddCategory'

export default function CategoryAdmin() {
  return (
    <div>
        <Link to="add">Add Category</Link>
      <Routes>
        <Route path='add' element={<AddCategory/>}/>
      </Routes>
    </div>
  )
}

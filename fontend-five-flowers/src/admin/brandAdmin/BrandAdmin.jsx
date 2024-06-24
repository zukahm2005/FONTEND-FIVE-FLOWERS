import React from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import AddBrand from './addBrand/AddBrand'

export default function BrandAdmin() {
  return (
    <div>
        <Link to="add">Add Brand</Link>
      <Routes>
        <Route path='add' element={<AddBrand/>}/>
      </Routes>
    </div>
  )
}

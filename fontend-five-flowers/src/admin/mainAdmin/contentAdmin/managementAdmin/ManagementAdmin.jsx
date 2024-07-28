import React from 'react'
import { Route, Routes } from 'react-router-dom'
import CreateAdmin from './createAdmin/CreateAdmin'
import GetAllAdmin from './getAllAdmin/GetAllAdmin'

const ManagementAdmin = () => {
  return (
    <div className='management-admin-main-container'>
        <Routes>
            <Route index element={<GetAllAdmin/>}/>
            <Route path='add' element={<CreateAdmin/>}/>
        </Routes>
    </div>
  )
}

export default ManagementAdmin
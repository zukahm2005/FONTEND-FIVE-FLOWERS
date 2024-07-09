import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import AddBrandAdmin from './addBrandAdmin/AddBrandAdmin';
import GetAllBrandAdmin from './getAllBrandAdmin/GetAllBrandAdmin';
import UpdateBrandAdmin from './updateBrandAdmin/UpdateBrandAdmin'; // Import UpdateBrandAdmin
import DeleteBrandAdmin from './deleteBrandAdmin/DeleteBrandAdmin'; // Import DeleteBrandAdmin

const BrandAdmin = () => {
    return (
        <div className='brand-admin-main-container'>
            <Routes>
                <Route index element={<GetAllBrandAdmin />} />
                <Route path="add" element={<AddBrandAdmin />} />
                <Route path="edit/:brandId" element={<UpdateBrandAdmin />} /> {/* Route for updating brand */}
                <Route path="delete" element={<DeleteBrandAdmin />} /> {/* Route for deleting brand */}
            </Routes>
        </div>
    );
};

export default BrandAdmin;

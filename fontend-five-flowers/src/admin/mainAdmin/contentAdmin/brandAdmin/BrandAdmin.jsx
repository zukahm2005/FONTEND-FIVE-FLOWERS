import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import AddBrandAdmin from './addBrandAdmin/AddBrandAdmin';
import GetAllBrandAdmin from './getAllBrandAdmin/GetAllBrandAdmin';
import DeleteBrandAdmin from './deleteBrandAdmin/DeleteBrandAdmin';
import UpdateBrandAdmin from './updateBrandAdmin/UpdateBrandAdmin';

const BrandAdmin = () => {
    return (
        <div>
            <h1>Brand Admin</h1>
            <nav>
                <Link to="add">Add Brand</Link> |{' '}
                <Link to="delete">Delete Brand</Link> |{' '}
                <Link to="update">Update Brand</Link> |{' '}
            </nav>
            <Routes>
                <Route path="/" element={<GetAllBrandAdmin />} />
                <Route path="add" element={<AddBrandAdmin />} />
                <Route path="delete" element={<DeleteBrandAdmin />} />
                <Route path="update" element={<UpdateBrandAdmin />} />
            </Routes>
        </div>
    );
};

export default BrandAdmin;

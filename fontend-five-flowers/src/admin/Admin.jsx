import React, { useEffect } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import GetAllAddress from './addressAdmin/getAllAddress/GetAllAdress';
import UpdateAddress from './addressAdmin/updateAddress/UpdateAddress';
import AddBlog from './blogAdmin/addBlog/AddBlog';

const Admin = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        }
    }, [navigate]);

    return (
        <div>
            <Link to="/">Login</Link>
            <h2>Admin Dashboard</h2>
            <nav>
                <ul>
                    <li>
                        <Link to="addresses">View All Addresses</Link>
                    </li>
                    <li><Link to="blog">Add Blog</Link></li>
                </ul>
            </nav>
            <Routes>
                <Route path="addresses" element={<GetAllAddress />} />
                <Route path="update-address/:id" element={<UpdateAddress />} />
                <Route path='blog' element={<AddBlog/>}/>
            </Routes>
        </div>
    );
};

export default Admin;


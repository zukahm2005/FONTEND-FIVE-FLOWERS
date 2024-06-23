import React, { useEffect } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import GetAllAddress from './addressAdmin/getAllAddress/GetAllAdress';
import UpdateAddress from './addressAdmin/updateAddress/UpdateAddress';
import BlogAdmin from './blogAdmin/BlogAdmin';

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
            <Link to="/login">Login</Link>
            <h2>Admin Dashboard</h2>
            <nav>
                <ul>
                    <li>
                        <Link to="addresses">View All Addresses</Link>
                    </li>
                    <li>
                        <Link to="blog">Blog Admin</Link>
                    </li>
                </ul>
            </nav>
            <Routes>
                <Route path="addresses" element={<GetAllAddress />} />
                <Route path="update-address/:id" element={<UpdateAddress />} />
                <Route path="blog/*" element={<BlogAdmin />} />
            </Routes>
        </div>
    );
};

export default Admin;

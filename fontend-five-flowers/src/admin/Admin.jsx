import React, { useEffect } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import GetAllAddress from './addressAdmin/getAllAddress/GetAllAdress';
import UpdateAddress from './addressAdmin/updateAddress/UpdateAddress';

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
                </ul>
            </nav>
            <Routes>
                <Route path="addresses" element={<GetAllAddress />} />
                <Route path="update-address/:id" element={<UpdateAddress />} />
            </Routes>
        </div>
    );
};

export default Admin;


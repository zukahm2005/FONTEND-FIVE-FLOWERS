import React, { useEffect } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import DeleteAddress from './addressAdmin/deleteAddress/DeleteAddress';
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
                <Route path="delete-address/:id" element={<DeleteAddress />} />
            </Routes>
        </div>
    );
};

export default Admin;


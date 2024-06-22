// src/components/User.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddAddress from './AddressUser/AddAddress';

const User = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        }
    }, [navigate]);

    return <h2>

        <AddAddress/>
    </h2>;
};

export default User;

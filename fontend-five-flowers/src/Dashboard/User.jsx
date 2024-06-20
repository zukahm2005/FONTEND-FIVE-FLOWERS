// src/components/User.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const User = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        }
    }, [navigate]);

    return <h2>User Dashboard</h2>;
};

export default User;

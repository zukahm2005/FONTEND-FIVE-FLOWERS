// src/components/Login.jsx
import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/v1/user/login', {
                userName,
                password,
            });

            if (response.data.token) {
                const token = response.data.token;
                localStorage.setItem('token', token);
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                const roles = decodedToken.roles.split(',');

                if (roles.includes('ROLE_ADMIN')) {
                    navigate('/admin');
                } else {
                    navigate('/user');
                }
            } else {
                setError('Login failed: Invalid credentials');
            }
        } catch (error) {
            console.error('Invalid login credentials', error);
            setError('Invalid login credentials');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Login</button>
                <Link to="/register">Register</Link>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
            <Link to="/">Home</Link>
        </div>
    );
};

export default Login;

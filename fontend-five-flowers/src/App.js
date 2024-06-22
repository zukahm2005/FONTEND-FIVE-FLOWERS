import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Admin from './admin/Admin';
import Login from './components/Login';
import Register from './components/Register';
import User from './user/User';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/admin/*" element={<Admin />} />
                <Route path="/user/*" element={<User />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    );
};

export default App;

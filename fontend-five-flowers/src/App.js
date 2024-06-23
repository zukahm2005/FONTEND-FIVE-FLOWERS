import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Admin from './admin/Admin';
import Login from './user/Main/header/components/login/Login';
import Register from './user/Main/header/components/register/Register';
import User from './user/User';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/admin/*" element={<Admin />} />
                <Route path="/*" element={<User />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    );
};

export default App;

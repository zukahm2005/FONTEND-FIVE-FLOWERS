import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Admin from './admin/Admin';
import Error from './error/Error';
import User from './user/User';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/admin/*" element={<Admin />} />
                <Route path="/*" element={<User />} />
            </Routes>
        </Router>
    );
};

export default App;

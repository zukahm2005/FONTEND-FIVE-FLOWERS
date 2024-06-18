import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      axios.post('http://localhost:8080/auth/logout', {}, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
      .then(response => {
        console.log('User logged out', response);
        localStorage.removeItem('user'); // Xóa thông tin người dùng khỏi localStorage
        alert('Logout successful'); // Hiển thị thông báo
        navigate('/login'); // Điều hướng đến trang đăng nhập
      })
      .catch(error => {
        console.error('There was an error logging out!', error);
        if (error.response && error.response.status === 401) {
          alert('Unauthorized request. Please login again.');
          localStorage.removeItem('user');
          navigate('/login');
        }
      });
    } else {
      navigate('/login'); // Nếu không có thông tin người dùng, điều hướng đến trang đăng nhập
    }
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
}

export default Logout;

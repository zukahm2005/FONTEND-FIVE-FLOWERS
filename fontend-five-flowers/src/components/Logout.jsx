import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    axios.post('http://localhost:8080/auth/logout', {}, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}` // Nếu bạn dùng token, gửi token theo request
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
    });
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
}

export default Logout;

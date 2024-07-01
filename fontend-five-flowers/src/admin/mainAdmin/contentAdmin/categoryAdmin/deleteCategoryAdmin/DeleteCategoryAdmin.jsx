import React, { useState } from 'react';
import axios from 'axios';
import './DeleteCategoryAdmin.scss';

const DeleteCategoryAdmin = () => {
    const [categoryId, setCategoryId] = useState('');
    const [message, setMessage] = useState('');

    const handleInputChange = (e) => {
        setCategoryId(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        axios.delete(`http://localhost:8080/api/v1/categories/delete/${categoryId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                console.log(response.data);
                setMessage('Category deleted successfully!');
                setCategoryId('');
            })
            .catch(error => {
                console.error(error);
                setMessage('Failed to delete category. Please try again.');
            });
    };

    return (
        <div className="delete-category-admin">
            <h2>Delete Category</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Category ID:</label>
                    <input
                        type="text"
                        name="categoryId"
                        value={categoryId}
                        onChange={handleInputChange}
                        placeholder="Enter the Category ID to delete"
                        required
                    />
                </div>
                <button type="submit" className="submit-button">Delete Category</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default DeleteCategoryAdmin;

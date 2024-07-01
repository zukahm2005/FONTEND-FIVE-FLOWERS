import React, { useState } from 'react';
import axios from 'axios';
import './UpdateCategoryAdmin.scss';

const UpdateCategoryAdmin = () => {
    const [category, setCategory] = useState({
        id: '',
        name: '',
        description: ''
    });

    const [message, setMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCategory({ ...category, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const categoryData = {
            name: category.name,
            description: category.description
        };
        
        axios.put(`http://localhost:8080/api/v1/categories/update/${category.id}`, categoryData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                console.log(response.data);
                setMessage('Category updated successfully!');
                setCategory({ id: '', name: '', description: '' });
            })
            .catch(error => {
                console.error(error);
                setMessage('Failed to update category. Please try again.');
            });
    };

    return (
        <div className="update-category-admin">
            <h2>Update Category</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Category ID:</label>
                    <input
                        type="text"
                        name="id"
                        value={category.id}
                        onChange={handleInputChange}
                        placeholder="Enter the Category ID to update"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={category.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Summer collection, Under $100, Staff picks"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={category.description}
                        onChange={handleInputChange}
                        placeholder="Description"
                        rows="5"
                        required
                    />
                </div>
                <button type="submit" className="submit-button">Update Category</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default UpdateCategoryAdmin;

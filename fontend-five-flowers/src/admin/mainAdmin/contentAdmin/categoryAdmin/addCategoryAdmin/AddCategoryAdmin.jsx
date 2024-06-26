import React, { useState } from 'react';
import axios from 'axios';
import './AddCategoryAdmin.scss';

const AddCategoryAdmin = () => {
    const [category, setCategory] = useState({
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
        
        axios.post('http://localhost:8080/api/v1/categories/add', categoryData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                console.log(response.data);
                setMessage('Category added successfully!');
                setCategory({ name: '', description: '' });
            })
            .catch(error => {
                console.error(error);
                setMessage('Failed to add category. Please try again.');
            });
    };

    return (
        <div className="add-category-admin">
            <h2>Add Category</h2>
            <form onSubmit={handleSubmit}>
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
                <button type="submit" className="submit-button">Add Category</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default AddCategoryAdmin;

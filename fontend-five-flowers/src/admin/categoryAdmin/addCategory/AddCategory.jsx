import React, { useState } from 'react';
import axios from 'axios';

const AddCategory = () => {
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
        axios.post('http://localhost:8080/api/v1/categories/add', category, {
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
        <div>
            <h2>Add New Category</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={category.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={category.description}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit">Add Category</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AddCategory;

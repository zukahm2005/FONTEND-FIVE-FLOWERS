import axios from 'axios';
import React, { useState } from 'react';

const AddBrand = () => {
    const [brand, setBrand] = useState({
        name: '',
        description: ''
    });

    const [message, setMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBrand({ ...brand, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/api/v1/brands/add', brand, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                console.log(response.data);
                setMessage('Brand added successfully!');
                setBrand({ name: '', description: '' });
            })
            .catch(error => {
                console.error(error);
                setMessage('Failed to add brand. Please try again.');
            });
    };

    return (
        <div>
            <h2>Add New Brand</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={brand.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={brand.description}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit">Add Brand</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AddBrand;

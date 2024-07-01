import React, { useState } from 'react';
import axios from 'axios';
import './UpdateBrandAdmin.scss';

const UpdateBrandAdmin = () => {
    const [brand, setBrand] = useState({
        id: '',
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
        const brandData = {
            name: brand.name,
            description: brand.description
        };
        
        axios.put(`http://localhost:8080/api/v1/brands/update/${brand.id}`, brandData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                setMessage('Brand updated successfully!');
                setBrand({ id: '', name: '', description: '' });
            })
            .catch(error => {
                console.error(error);
                setMessage('Failed to update brand. Please try again.');
            });
    };

    return (
        <div className="update-brand-admin">
            <h2>Update Brand</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Brand ID:</label>
                    <input
                        type="text"
                        name="id"
                        value={brand.id}
                        onChange={handleInputChange}
                        placeholder="Enter the Brand ID to update"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={brand.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Apple, Samsung"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={brand.description}
                        onChange={handleInputChange}
                        placeholder="Description"
                        rows="5"
                        required
                    />
                </div>
                <button type="submit" className="submit-button">Update Brand</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default UpdateBrandAdmin;

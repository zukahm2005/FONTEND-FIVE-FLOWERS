import React, { useState } from 'react';
import axios from 'axios';
import './DeleteBrandAdmin.scss';

const DeleteBrandAdmin = () => {
    const [brandId, setBrandId] = useState('');
    const [message, setMessage] = useState('');

    const handleInputChange = (e) => {
        setBrandId(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        axios.delete(`http://localhost:8080/api/v1/brands/delete/${brandId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                setMessage('Brand deleted successfully!');
                setBrandId('');
            })
            .catch(error => {
                console.error(error);
                setMessage('Failed to delete brand. Please try again.');
            });
    };

    return (
        <div className="delete-brand-admin">
            <h2>Delete Brand</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Brand ID:</label>
                    <input
                        type="text"
                        name="brandId"
                        value={brandId}
                        onChange={handleInputChange}
                        placeholder="Enter the Brand ID to delete"
                        required
                    />
                </div>
                <button type="submit" className="submit-button">Delete Brand</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default DeleteBrandAdmin;

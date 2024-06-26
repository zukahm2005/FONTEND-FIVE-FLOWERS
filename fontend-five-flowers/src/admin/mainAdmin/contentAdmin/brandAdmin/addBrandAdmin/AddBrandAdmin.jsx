import React, { useState } from 'react';
import axios from 'axios';
import './AddBrandAdmin.scss';

const AddBrandAdmin = () => {
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
        const brandData = {
            name: brand.name,
            description: brand.description
        };
        
        axios.post('http://localhost:8080/api/v1/brands/add', brandData, {
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
        <div className="add-brand-admin">
            <h2>Add Brand</h2>
            <form onSubmit={handleSubmit}>
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
                <button type="submit" className="submit-button">Add Brand</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default AddBrandAdmin;

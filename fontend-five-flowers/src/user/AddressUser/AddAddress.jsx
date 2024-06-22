import axios from 'axios';
import React, { useState } from 'react';

const AddAddress = () => {
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleAddAddress = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            setError('You need to be logged in to add an address');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/v1/addresses/add', {
                addressLine1,
                addressLine2,
                city,
                state,
                country,
                postalCode,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setSuccess('Address added successfully');
            setError('');
        } catch (error) {
            console.error('Error adding address', error);
            setError('Error adding address');
            setSuccess('');
        }
    };

    return (
        <div>
            <h2>Add Address</h2>
            <form onSubmit={handleAddAddress}>
                <div>
                    <label>Address Line 1:</label>
                    <input
                        type="text"
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                    />
                </div>
                <div>
                    <label>Address Line 2:</label>
                    <input
                        type="text"
                        value={addressLine2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                    />
                </div>
                <div>
                    <label>City:</label>
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </div>
                <div>
                    <label>State:</label>
                    <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                    />
                </div>
                <div>
                    <label>Country:</label>
                    <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    />
                </div>
                <div>
                    <label>Postal Code:</label>
                    <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                    />
                </div>
                <button type="submit">Add Address</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
            </form>
        </div>
    );
};

export default AddAddress;

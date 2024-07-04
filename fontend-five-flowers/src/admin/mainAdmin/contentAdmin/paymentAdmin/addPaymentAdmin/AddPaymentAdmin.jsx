import axios from 'axios';
import React, { useState } from 'react';
    
const AddPaymentMethod = () => {
    const [paymentMethod, setPaymentMethod] = useState('');
    const [message, setMessage] = useState('');

    const handleInputChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const paymentData = {
            paymentMethod
        };

        axios.post('http://localhost:8080/api/v1/payments/add', paymentData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log(response.data);
                setMessage('Payment method added successfully!');
                setPaymentMethod('');
            })
            .catch(error => {
                console.error(error);
                setMessage('Failed to add payment method. Please try again.');
            });
    };

    return (
        <div className="add-payment-method">
            <h2>Add Payment Method</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Payment Method:</label>
                    <input
                        type="text"
                        name="paymentMethod"
                        value={paymentMethod}
                        onChange={handleInputChange}
                        placeholder="e.g. PayPal, Banking, Cash"
                        required
                    />
                </div>
                <button type="submit" className="submit-button">Add Payment Method</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default AddPaymentMethod;

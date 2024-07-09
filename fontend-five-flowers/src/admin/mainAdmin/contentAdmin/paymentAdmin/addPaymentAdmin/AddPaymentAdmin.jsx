import axios from "axios";
import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./AddPaymentAdmin.scss";

const AddPaymentAdmin = () => {
  const [payment, setPayment] = useState({
    paymentMethod: "",
    paymentDate: new Date().toISOString().slice(0, 16),
  });
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPayment({ ...payment, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:8080/api/v1/payments/add",
        payment,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage("Payment added successfully");
    } catch (error) {
      console.error(error);
      setMessage("Failed to add payment. Please try again.");
    }
  };

  return (
    <div className="add-payment-container">
      <div className="layout-payment-container">
        <div className="header-payment-add-container">
          <Link to="/admin/payments">
            <FaArrowLeft />
          </Link>
          <p>Add Payment</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="bottom-payment-add-container">
            <div className="left-payment-main">
              <div className="title-container-payment">
                <label htmlFor="paymentMethod">
                  <p>Payment Method:</p>
                </label>
                <input
                  type="text"
                  name="paymentMethod"
                  placeholder="Payment Method"
                  value={payment.paymentMethod}
                  onChange={handleInputChange}
                />
              </div>
              <div className="date-container-payment">
                <label>
                  <p>Payment Date:</p>
                </label>
                <input
                  type="datetime-local"
                  name="paymentDate"
                  value={payment.paymentDate}
                  onChange={handleInputChange}
                  readOnly
                />
              </div>
              <div className="info-button-container">
                <button type="submit">
                  <p>Save</p>
                </button>
              </div>
            </div>
          </div>
          {message && <p>{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddPaymentAdmin;

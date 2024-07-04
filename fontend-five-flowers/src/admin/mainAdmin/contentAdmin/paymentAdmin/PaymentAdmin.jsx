import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import AddPaymentAdmin from "./addPaymentAdmin/AddPaymentAdmin";
import GetAllPayment from "./getAllPayment/GetAllPayment";
import "./paymentAdmin.scss";

const PaymentAdmin = () => {
  return (
    <div className="payment-admin-container">
      <h1>Payment Admin</h1>
      <Link to="add">add payment</Link>
      <Routes>
        <Route index element={<GetAllPayment />} />
        <Route path="add" element={<AddPaymentAdmin />} />
      </Routes>
    </div>
  );
};

export default PaymentAdmin;
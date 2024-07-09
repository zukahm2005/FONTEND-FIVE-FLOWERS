import React from "react";
import { Routes, Route } from "react-router-dom";
import GetAllPaymentAdmin from "./getAllPayment/GetAllPaymentAdmin";
import AddPaymentAdmin from "./addPaymentAdmin/AddPaymentAdmin";

const PaymentAdmin = () => {
  return (
    <div className="payment-admin-main-container">
      <Routes>
        <Route index element={<GetAllPaymentAdmin />} />
        <Route path="add" element={<AddPaymentAdmin />} />
      </Routes>
    </div>
  );
};

export default PaymentAdmin;

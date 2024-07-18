import React from "react";
import { Route, Routes } from "react-router-dom";
import GetAllAddress from "./getAllAddressAdmin/GetAllAddressAdmin";
import UpdateAddress from "./updateAddressAdmin/UpdateAddressAdmin";
import UserDetail from "./getUserDetail/GetUserDetail";
import './AddressAdmin.scss';
import CartProvider from "../../../../user/Main/header/components/cart/cartContext/CartProvider";

const AddressAdmin = () => {
  return (
    <CartProvider>
      <div className="address-container">
        <h1>Address Admin</h1>
        <Routes>
          <Route index element={<GetAllAddress />} />
          <Route path="update-address/:id" element={<UpdateAddress />} />
          <Route path="customer/:id" element={<UserDetail />} /> {/* Đường dẫn để hiển thị thông tin chi tiết của người dùng */}
        </Routes>
      </div>
    </CartProvider>
  );
};

export default AddressAdmin;

import React from "react";
import { Route, Routes } from "react-router-dom";
import GetAllAddress from "./getAllAddressAdmin/GetAllAddressAdmin";
import UpdateAddress from "./updateAddressAdmin/UpdateAddressAdmin";

const AddressAdmin = () => {
  return (
    <div>
      <h1>Address Admin</h1>
      <Routes>
        <Route index element={<GetAllAddress />} />
        <Route path="update-address/:id" element={<UpdateAddress />} />
      </Routes>
    </div>
  );
};

export default AddressAdmin;

import React from "react";
import { Route, Routes } from "react-router-dom";
import OrderListAdmin from "./getAllOrderAdmin/OrderListAdmin";
import OrderDetails from "./getAllOrderAdmin/orderListAdminDetails/OrderListAdminDetails";

const OrderAdmin = () => {
  return (
    <div>
      <Routes>
        <Route index element={<OrderListAdmin />} />
        <Route path=":id" element={<OrderDetails />} /> {/* Đảm bảo rằng route này đúng */}
      </Routes>
    </div>
  );
};

export default OrderAdmin;

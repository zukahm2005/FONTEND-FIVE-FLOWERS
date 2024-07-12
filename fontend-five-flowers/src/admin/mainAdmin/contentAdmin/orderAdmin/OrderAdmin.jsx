import React from "react";
import { Route, Routes } from "react-router-dom";
import OrderListAdmin from "./getAllOrderAdmin/OrderListAdmin";
import AddOrder from "./getAllOrderAdmin/addOrder/AddOrder";
import OrderDetails from "./getAllOrderAdmin/orderListAdminDetails/OrderListAdminDetails";
import EditOrderDetails from "./getAllOrderAdmin/orderListAdminDetails/editOrderDetails/EditOrderDetails";

const OrderAdmin = () => {
  return (
    <Routes>
      <Route index element={<OrderListAdmin />} />
      <Route path=":id" element={<OrderDetails />} />
      <Route path="edit/:id" element={<EditOrderDetails />} />
      <Route path="add" element={<AddOrder />} />
    </Routes>
  );
};

export default OrderAdmin;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./orderListAdmin.scss";

const OrderListAdmin = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/api/v1/orders/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data.content); // Assuming paginated response
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      }
    };

    fetchOrders();
  }, []);

  const viewOrderDetails = (orderId) => {
    if (!orderId) {
      console.error('Order ID is undefined');
      return;
    }
    console.log('Navigating to order details with ID:', orderId); // Debug log
    navigate(`/admin/orders/${orderId}`);
  };

  return (
    <div className="order-list-admin-container">
      <h1>Danh sách đơn hàng</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Người đặt</th>
            <th>Tổng giá</th>
            <th>Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderId}>
              <td>{order.orderId}</td>
              <td>{order.user ? order.user.userName : "null"}</td>
              <td>{order.price}</td>
              <td>
                <button onClick={() => viewOrderDetails(order.orderId)}>Xem chi tiết</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderListAdmin;

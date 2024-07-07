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
        const response = await axios.get(
          "http://localhost:8080/api/v1/orders/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrders(response.data.content); // Assuming the response.data is the orders array
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const viewOrderDetails = (orderId) => {
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
            <th>Địa chỉ</th>
            <th>Phương thức thanh toán</th>
            <th>Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{order.user ? order.user.userName : "null"}</td>
                <td>{order.price}</td>
                <td>
                  {order.address
                    ? `${order.address.firstName} ${order.address.lastName}, ${order.address.address}, ${order.address.city}, ${order.address.country}, ${order.address.postalCode}`
                    : "No address"}
                </td>
                <td>{order.payment ? order.payment.paymentMethod : "No payment method"}</td>
                <td>
                  <button onClick={() => viewOrderDetails(order.orderId)}>
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">Không có đơn hàng nào</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderListAdmin;

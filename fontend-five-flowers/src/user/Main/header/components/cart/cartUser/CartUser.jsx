import { Collapse, DatePicker, Select } from "antd";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../../cart/cartContext/CartProvider";
import "./cartUser.scss";
import CartUserDetails from "./cartUserDetails/CartUserDetails";

const { Option } = Select;
const { Panel } = Collapse;
const { RangePicker } = DatePicker;

const CartUser = () => {
  const { isLoggedIn } = useContext(CartContext);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!isLoggedIn) return;
      try {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        const response = await axios.get(
          `http://localhost:8080/api/v1/orders/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrders(response.data);
        setFilteredOrders(response.data);
      } catch (error) {
        console.error("Error fetching user orders:", error);
      }
    };

    const fetchPaymentMethods = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/payments/all");
        setPaymentMethods(response.data);
      } catch (error) {
        console.error("Error fetching payment methods:", error);
      }
    };

    fetchUserOrders();
    fetchPaymentMethods();
  }, [isLoggedIn]);

  const formatTimeAgo = (date) => moment(date).fromNow();

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    applyFilters(value, dateRange);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    applyFilters(statusFilter, dates);
  };

  const handlePaymentMethodChange = (value) => {
    setSelectedPaymentMethod(value);
  };

  const applyFilters = (status, dates) => {
    let filtered = [...orders];
    if (status) {
      filtered = filtered.filter((order) => order.status === status);
    }
    if (dates && dates.length === 2) {
      const [start, end] = dates;
      filtered = filtered.filter((order) => {
        const orderDate = moment(order.createdAt);
        return orderDate.isBetween(start, end, "days", "[]");
      });
    }
    setFilteredOrders(filtered);
  };

  const getStatusClassName = (status) => {
    switch (status) {
      case "Pending Payment":
        return "status-pending-payment";
      case "Paid":
        return "status-paid";
      case "Packaging":
        return "status-packaging";
      case "Shipping":
        return "status-shipping";
      case "Delivered":
        return "status-delivered";
      case "Cancelled":
        return "status-cancelled";
      case "Refunded":
        return "status-refunded";
      default:
        return "";
    }
  };

  return (
    <div className="cart-user-container">
      <div className="cart-user-header-container">
        <div className="title-cart-user">
          <p>Orders</p>
        </div>
        <div className="filters-cart-user">
          <Select
            defaultValue="Status: All"
            style={{ width: 200 }}
            onChange={handleStatusFilterChange}
          >
            <Option value="" className="all">Status: All</Option>
            <Option value="Pending Payment" className="pending-payment">Pending Payment</Option>
            <Option value="Paid" className="paid">Paid</Option>
            <Option value="Packaging" className="packaging">Packaging</Option>
            <Option value="Shipping" className="shipping">Shipping</Option>
            <Option value="Delivered" className="delivered">Delivered</Option>
            <Option value="Cancelled" className="cancelled">Cancelled</Option>
            <Option value="Refunded" className="refunded">Refunded</Option>
          </Select>
          <RangePicker onChange={handleDateRangeChange} />
          <Select
            defaultValue="Select Payment Method"
            style={{ width: 200 }}
            onChange={handlePaymentMethodChange}
          >
            {paymentMethods.map((method) => (
              <Option key={method.paymentId} value={method.paymentId}>
                {method.paymentMethod}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      <table className="orders-table">
        <tbody>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => (
              <tr key={order.orderId}>
                <td colSpan="6">
                  <Collapse accordion>
                    <Panel
                      header={
                        <div className="order-summary">
                          <span>{index + 1}</span>
                          <span>Total: ₹{order.price}</span>
                          <span>
                            {order.address
                              ? `${order.address.address}, ${order.address.city}, ${order.address.country}`
                              : "No address"}
                          </span>
                          <span>
                            {order.payment
                              ? order.payment.paymentMethod
                              : "No payment method"}
                          </span>
                          <span>{formatTimeAgo(order.createdAt)}</span>
                          <span className={getStatusClassName(order.status)}>
                            <strong>{order.status}</strong>
                          </span>
                        </div>
                      }
                      key={order.orderId}
                    >
                      <CartUserDetails order={order} />
                    </Panel>
                  </Collapse>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No orders</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CartUser;

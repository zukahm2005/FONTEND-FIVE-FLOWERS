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

    fetchUserOrders();
  }, [isLoggedIn]);

  const formatTimeAgo = (date) => {
    return moment(date).fromNow();
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    applyFilters(value, dateRange);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    applyFilters(statusFilter, dates);
  };

  const applyFilters = (status, dates) => {
    let filtered = [...orders];
    if (status) {
      filtered = filtered.filter(order => order.status === status);
    }
    if (dates && dates.length === 2) {
      const [start, end] = dates;
      filtered = filtered.filter(order => {
        const orderDate = moment(order.createdAt);
        return orderDate.isBetween(start, end, 'days', '[]');
      });
    }
    setFilteredOrders(filtered);
  };

  const getStatusClassName = (status) => {
    switch (status) {
      case "Pending":
        return "status-pending";
      case "Completed":
        return "status-completed";
      case "Canceled":
        return "status-canceled";
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
            <Option value="">Status: All</Option>
            <Option value="Pending">Pending</Option>
            <Option value="Completed">Completed</Option>
            <Option value="Canceled">Canceled</Option>
          </Select>
          <RangePicker 
            onChange={handleDateRangeChange} 
          />
        </div>
      </div>

      <Collapse accordion>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order, index) => (
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
                    {order.payment ? order.payment.paymentMethod : "No payment method"}
                  </span>
                  <span>{formatTimeAgo(order.createdAt)}</span>
                  <span className={getStatusClassName(order.status)}>{order.status}</span>
                </div>
              }
              key={order.orderId}
            >
              <CartUserDetails order={order} />
            </Panel>
          ))
        ) : (
          <Panel header="No orders" key="0"></Panel>
        )}
      </Collapse>
    </div>
  );
};

export default CartUser;

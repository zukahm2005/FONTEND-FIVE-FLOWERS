import { DatePicker, Select, Table, Tag } from "antd";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../../cart/cartContext/CartProvider";
import "./cartUser.scss";
import CartUserDetails from "./cartUserDetails/CartUserDetails";

const { Option } = Select;
const { RangePicker } = DatePicker;

const CartUser = () => {
  const { isLoggedIn } = useContext(CartContext);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [sortOrder, setSortOrder] = useState("status");

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
      applyFiltersAndSort(response.data, sortOrder, dateRange, statusFilter);
    } catch (error) {
      console.error("Error fetching user orders:", error);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, [isLoggedIn]);

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    applyFiltersAndSort(orders, sortOrder, dateRange, value);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    applyFiltersAndSort(orders, sortOrder, dates, statusFilter);
  };

  const handleSortOrderChange = (value) => {
    setSortOrder(value);
    applyFiltersAndSort(orders, value, dateRange, statusFilter);
  };

  const applyFiltersAndSort = (ordersList, sortOrder, dateRange, statusFilter) => {
    let filteredOrders = [...ordersList];

    if (dateRange && dateRange.length === 2) {
      const [start, end] = dateRange;
      const startDate = new Date(start).setHours(0, 0, 0, 0);
      const endDate = new Date(end).setHours(23, 59, 59, 999);
      filteredOrders = filteredOrders.filter((order) => {
        const orderDateArray = order.createdAt;
        const orderDate = new Date(
          Date.UTC(
            orderDateArray[0],
            orderDateArray[1] - 1,
            orderDateArray[2],
            orderDateArray[3],
            orderDateArray[4],
            orderDateArray[5]
          )
        );
        return orderDate >= startDate && orderDate <= endDate;
      });
    }

    if (statusFilter) {
      filteredOrders = filteredOrders.filter((order) => order.status === statusFilter);
    }

    switch (sortOrder) {
      case "newest":
        filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        filteredOrders.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "price-low":
        filteredOrders.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filteredOrders.sort((a, b) => b.price - a.price);
        break;
      case "status":
        // Implement status sorting logic if needed
        break;
      default:
        break;
    }
    setFilteredOrders(filteredOrders);
  };

  const getStatusTag = (status) => {
    let color;
    switch (status) {
      case "Pending":
        color = "orange";
        break;
      case "Paid":
        color = "green";
        break;
      case "Packaging":
        color = "blue";
        break;
      case "Shipping":
        color = "purple";
        break;
      case "Delivered":
        color = "cyan";
        break;
      case "Cancelled":
        color = "red";
        break;
      case "Refunded":
        color = "magenta";
        break;
      default:
        color = "default";
    }
    return <Tag color={color}>{status}</Tag>;
  };

  const formatDate = (dateArray) => {
    if (!Array.isArray(dateArray) || dateArray.length !== 6) {
      return "N/A"; // Default value when data is invalid
    }
    const [year, month, day, hours, minutes, seconds] = dateArray;
    const date = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds)); // Note month starts from 0 in JavaScript
    if (isNaN(date)) {
      return "N/A"; // Default value when data is invalid
    }
    const formattedDate = date.toISOString().slice(0, 19).replace("T", " ");
    return formattedDate;
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Total",
      dataIndex: "price",
      key: "price",
      render: (price) => `₹${price}`,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (address) => (address ? `${address.address}` : "No address"),
    },
    {
      title: "Payment Method",
      dataIndex: "payment",
      key: "payment",
      render: (payment) => (payment ? payment.paymentMethod : "No payment method"),
    },
    {
      title: "Order Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => formatDate(createdAt),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
  ];

  return (
    <div className="cart-user-container">
      <div className="cart-user-header-container">
        <div className="title-cart-user">
          <p>Orders</p>
        </div>
        <div className="filters-cart-user">
          <Select
            style={{ width: 200 }}
            onChange={handleSortOrderChange}
            defaultValue="status"
            placeholder="Sort by"
          >
            <Option value="newest">Newest</Option>
            <Option value="oldest">Oldest</Option>
            <Option value="price-low">Price, low to high</Option>
            <Option value="price-high">Price, high to low</Option>
            <Option value="status">Status</Option>
          </Select>
          <RangePicker onChange={handleDateRangeChange} />
          <Select
            style={{ width: 200 }}
            onChange={handleStatusFilterChange}
            defaultValue=""
            placeholder="Filter by Status"
          >
            <Option value="">All</Option>
            <Option value="Pending">Pending</Option>
            <Option value="Paid">Paid</Option>
            <Option value="Packaging">Packaging</Option>
            <Option value="Shipping">Shipping</Option>
            <Option value="Delivered">Delivered</Option>
            <Option value="Cancelled">Cancelled</Option>
            <Option value="Refunded">Refunded</Option>
          </Select>
        </div>
      </div>

      <Table
        dataSource={filteredOrders}
        columns={columns}
        rowKey="orderId"
        expandable={{
          expandedRowRender: (order) => <CartUserDetails order={order} />,
        }}
      />
    </div>
  );
};

export default CartUser;

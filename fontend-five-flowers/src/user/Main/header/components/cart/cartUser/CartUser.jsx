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
  const [sortOrder, setSortOrder] = useState("");

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
        console.log(response.data); // Kiểm tra dữ liệu trả về từ API
        setOrders(response.data);
        setFilteredOrders(response.data);
      } catch (error) {
        console.error("Error fetching user orders:", error);
      }
    };

    fetchUserOrders();
  }, [isLoggedIn]);

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    applyFilters(value, dateRange, sortOrder);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    applyFilters(statusFilter, dates, sortOrder);
  };

  const handleSortOrderChange = (value) => {
    setSortOrder(value);
    applyFilters(statusFilter, dateRange, value);
  };

  const applyFilters = (status, dates, sort) => {
    let filtered = [...orders];
    if (status) {
      filtered = filtered.filter((order) => order.status === status);
    }
    if (dates && dates.length === 2) {
      const [start, end] = dates;
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= start && orderDate <= end;
      });
    }
    if (sort) {
      filtered = filtered.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        if (sort === "oldest") {
          return dateA - dateB;
        } else if (sort === "newest") {
          return dateB - dateA;
        }
        return 0;
      });
    }
    setFilteredOrders(filtered);
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
      return "N/A"; // Giá trị mặc định khi dữ liệu không hợp lệ
    }
    const [year, month, day, hours, minutes, seconds] = dateArray;
    const date = new Date(year, month - 1, day, hours, minutes, seconds); // Chú ý tháng bắt đầu từ 0 trong JavaScript
    if (isNaN(date)) {
      return "N/A"; // Giá trị mặc định khi dữ liệu không hợp lệ
    }
    const formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');
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
      render: (address) =>
        address ? `${address.address}` : "No address",
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
            defaultValue="Status: All"
            style={{ width: 200 }}
            onChange={handleStatusFilterChange}
          >
            <Option value="">Status: All</Option>
            <Option value="Pending">Pending</Option>
            <Option value="Paid">Paid</Option>
            <Option value="Packaging">Packaging</Option>
            <Option value="Shipping">Shipping</Option>
            <Option value="Delivered">Delivered</Option>
            <Option value="Cancelled">Cancelled</Option>
            <Option value="Refunded">Refunded</Option>
          </Select>
          <Select
            defaultValue="Sort: None"
            style={{ width: 200 }}
            onChange={handleSortOrderChange}
          >
            <Option value="">Sort: None</Option>
            <Option value="newest">Newest to Oldest</Option>
            <Option value="oldest">Oldest to Newest</Option>
          </Select>
          <RangePicker onChange={handleDateRangeChange} showTime />
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

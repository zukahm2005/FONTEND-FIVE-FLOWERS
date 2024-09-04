import { DatePicker, Select, Table, Tag } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { jwtDecode } from "jwt-decode";
import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../../cart/cartContext/CartProvider";
import "./cartUser.scss";
import CartUserDetails from "./cartUserDetails/CartUserDetails";

dayjs.extend(utc);
dayjs.extend(timezone);

const { Option } = Select;
const { RangePicker } = DatePicker;

const CartUser = () => {
  const { isLoggedIn } = useContext(CartContext);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [sortOrder, setSortOrder] = useState("status");
  const [orderCountsByStatus, setOrderCountsByStatus] = useState({});

  const calculateOrderCountsByStatus = (ordersList) => {
    const counts = ordersList.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});
    setOrderCountsByStatus(counts);
  };

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
      calculateOrderCountsByStatus(response.data);
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
    if (dates && dates.length === 2) {
      const start = dates[0].toDate();
      const end = dates[1].toDate();
      setDateRange([start, end]);
      applyFiltersAndSort(orders, sortOrder, [start, end], statusFilter);
    } else {
      setDateRange([]);
      applyFiltersAndSort(orders, sortOrder, [], statusFilter);
    }
  };

  const handleSortOrderChange = (value) => {
    setSortOrder(value);
    applyFiltersAndSort(orders, value, dateRange, statusFilter);
  };

  const statusPriority = {
    Pending: 1,
    Packaging: 2,
    Shipping: 3,
    Paid: 4,
    Delivered: 5,
    Cancelled: 6,
    Refunded: 7,
    Returned: 8,
  };

  const applyFiltersAndSort = (ordersList, sortOrder, dateRange, statusFilter) => {
    let filteredOrders = [...ordersList];

    if (dateRange && dateRange.length === 2) {
      const [start, end] = dateRange;
      const startDate = dayjs(start).startOf("day").tz("Asia/Ho_Chi_Minh", true);
      const endDate = dayjs(end).endOf("day").tz("Asia/Ho_Chi_Minh", true);
      filteredOrders = filteredOrders.filter((order) => {
        const orderDateArray = order.createdAt;
        const orderDate = dayjs.utc(
          new Date(
            Date.UTC(
              orderDateArray[0],
              orderDateArray[1] - 1,
              orderDateArray[2],
              orderDateArray[3],
              orderDateArray[4],
              orderDateArray[5]
            )
          )
        ).tz("Asia/Ho_Chi_Minh", true);
        return orderDate.isAfter(startDate) && orderDate.isBefore(endDate);
      });
    }

    if (statusFilter) {
      filteredOrders = filteredOrders.filter((order) => order.status === statusFilter);
    }

    switch (sortOrder) {
      case "newest":
        filteredOrders.sort((a, b) => {
          const dateA = dayjs
            .utc(new Date(Date.UTC(...a.createdAt)))
            .tz("Asia/Ho_Chi_Minh", true);
          const dateB = dayjs
            .utc(new Date(Date.UTC(...b.createdAt)))
            .tz("Asia/Ho_Chi_Minh", true);
          return dateB - dateA;
        });
        break;
      case "oldest":
        filteredOrders.sort((a, b) => {
          const dateA = dayjs
            .utc(new Date(Date.UTC(...a.createdAt)))
            .tz("Asia/Ho_Chi_Minh", true);
          const dateB = dayjs
            .utc(new Date(Date.UTC(...b.createdAt)))
            .tz("Asia/Ho_Chi_Minh", true);
          return dateA - dateB;
        });
        break;
      case "price-low":
        filteredOrders.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filteredOrders.sort((a, b) => b.price - a.price);
        break;
      case "status":
        filteredOrders.sort((a, b) => statusPriority[a.status] - statusPriority[b.status]);
        break;
      default:
        break;
    }

    setFilteredOrders(filteredOrders);
  };

  const formatDate = (dateArray) => {
    if (!Array.isArray(dateArray) || dateArray.length !== 6) {
      return "N/A"; 
    }
    const [year, month, day, hours, minutes, seconds] = dateArray;
    const date = dayjs
      .utc(new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds)))
      .tz("Asia/Ho_Chi_Minh", true);
    if (!date.isValid()) {
      return "N/A"; 
    }
    return date.format("YYYY-MM-DD HH:mm:ss");
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
      render: (price) => `$${price}`,
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
      render: (payment) =>
        payment ? payment.paymentMethod : "No payment method",
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
      case "Returned":
        color = "black";
        break;
      default:
        color = "default";
    }
    return <Tag color={color}>{status}</Tag>;
  };

  return (
    <div className="cart-user-container">
      <div className="cart-user-header-container">
        <div className="title-cart-user">
          <p>Orders</p>
        </div>
        <div className="filters-cart-user">
          <Select
            style={{ width: 140 }}
            onChange={handleStatusFilterChange}
            defaultValue=""
            placeholder="Filter by Status"
          >
            <Option value="">All</Option>
            <Option value="Pending">Pending ({orderCountsByStatus.Pending || 0})</Option>
            <Option value="Paid">Paid ({orderCountsByStatus.Paid || 0})</Option>
            <Option value="Packaging">Packaging ({orderCountsByStatus.Packaging || 0})</Option>
            <Option value="Shipping">Shipping ({orderCountsByStatus.Shipping || 0})</Option>
            <Option value="Delivered">Delivered ({orderCountsByStatus.Delivered || 0})</Option>
            <Option value="Cancelled">Cancelled ({orderCountsByStatus.Cancelled || 0})</Option>
            <Option value="Refunded">Refunded ({orderCountsByStatus.Refunded || 0})</Option>
            <Option value="Returned">Returned ({orderCountsByStatus.Returned || 0})</Option>
          </Select>

          <Select
            style={{ width: 140 }}
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

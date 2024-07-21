import { DatePicker, Select, Table, Tag, Input, Button } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./UserDetail.scss"; // Tệp CSS tùy chỉnh của bạn
import CartUserDetails from "../../../../../user/Main/header/components/cart/cartUser/cartUserDetails/CartUserDetails";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const { Option } = Select;
const { RangePicker } = DatePicker;

const GetUserDetails = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [sortOrder, setSortOrder] = useState("status");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const { id } = useParams(); // Lấy id từ URL

  const fetchUserOrders = async (page = 1, pageSize = 10) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.get(
        `http://localhost:8080/api/v1/orders/user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: page - 1,
            size: pageSize,
          },
        }
      );
      const orders = response.data;
      console.log("Fetched orders:", orders); // Thêm log này để kiểm tra dữ liệu phản hồi

      setOrders(orders);
      setPagination({
        current: page,
        pageSize: pageSize,
        total: orders.length,
      });
      applyFiltersAndSort(orders, sortOrder, dateRange, statusFilter);
    } catch (error) {
      console.error("Error fetching user orders:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUserOrders(pagination.current, pagination.pageSize);
    }
  }, [pagination.current, pagination.pageSize, id]);

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

  const handleTableChange = (pagination) => {
    setPagination(pagination);
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

  const applyFiltersAndSort = (
    ordersList,
    sortOrder,
    dateRange,
    statusFilter
  ) => {
    let filteredOrders = [...ordersList];

    if (dateRange && dateRange.length === 2) {
      const [start, end] = dateRange;
      const startDate = new Date(start).setHours(0, 0, 0, 0);
      const endDate = new Date(end).setHours(23, 59, 59, 999);
      filteredOrders = filteredOrders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }

    if (statusFilter) {
      filteredOrders = filteredOrders.filter(
        (order) => order.status === statusFilter
      );
    }

    switch (sortOrder) {
      case "newest":
        filteredOrders.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case "oldest":
        filteredOrders.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        break;
      case "price-low":
        filteredOrders.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filteredOrders.sort((a, b) => b.price - a.price);
        break;
      case "status":
        filteredOrders.sort(
          (a, b) => statusPriority[a.status] - statusPriority[b.status]
        );
        break;
      default:
        break;
    }
    console.log("Filtered and sorted orders:", filteredOrders); // Thêm log này để kiểm tra dữ liệu sau khi lọc và sắp xếp
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
      case "Returned":
        color = "black";
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
    const date = new Date(
      Date.UTC(year, month - 1, day, hours, minutes, seconds)
    ); // Chú ý tháng bắt đầu từ 0 trong JavaScript
    if (isNaN(date)) {
      return "N/A"; // Giá trị mặc định khi dữ liệu không hợp lệ
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

  const itemRender = (current, type, originalElement) => {
    if (type === "prev") {
      return (
        <p className="custom-pagination-button">
          <FaArrowLeft />
        </p>
      );
    }
    if (type === "next") {
      return (
        <p className="custom-pagination-button">
          <FaArrowRight />
        </p>
      );
    }
    if (type === "page") {
      return <p className="custom-pagination-button">{current}</p>;
    }
    return originalElement;
  };

  return (
    <div className="user-details-container">
      <div className="user-details-header-container">
        <div className="title-user-details">
          <p>User Details</p>
        </div>
        <div className="filters-user-details">
          <p>
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
          </p>
          <p>
            <RangePicker onChange={handleDateRangeChange} />
          </p>
          <p>
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
              <Option value="Returned">Returned</Option>
            </Select>
          </p>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredOrders}
        loading={false}
        pagination={{
          ...pagination,
          itemRender: itemRender,
        }}
        onChange={handleTableChange}
        rowKey="orderId"
        expandable={{
          expandedRowRender: (order) => <CartUserDetails order={order} />,
        }}
      />
    </div>
  );
};

export default GetUserDetails;

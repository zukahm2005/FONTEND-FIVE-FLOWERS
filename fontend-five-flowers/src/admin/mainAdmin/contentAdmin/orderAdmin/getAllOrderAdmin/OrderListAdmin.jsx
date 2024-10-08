import { Button, DatePicker, Input, Select, Table } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import "./orderListAdmin.scss";

dayjs.extend(utc);
dayjs.extend(timezone);

const { Option } = Select;
const { RangePicker } = DatePicker;

const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "gold";
    case "Paid":
      return "green";
    case "Packaging":
      return "blue";
    case "Shipping":
      return "cyan";
    case "Delivered":
      return "lime";
    case "Cancelled":
      return "red";
    case "Refunded":
      return "purple";
    case "Returned":
      return "black";
    default:
      return "default";
  }
};

const StyledSelect = styled(Select)`
  width: 110px;
  .ant-select-selection-item {
    color: ${(props) => getStatusColor(props.status)} !important;
  }
  .ant-select-item-option-content {
    color: ${(props) => getStatusColor(props.status)} !important;
  }
`;

const OrderListAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest"); 
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [dateRange, setDateRange] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isTodayFilter, setIsTodayFilter] = useState(false); 
  const [orderCountsByStatus, setOrderCountsByStatus] = useState({});

  const navigate = useNavigate();

  // Hàm tính toán số lượng đơn hàng theo trạng thái
  const calculateOrderCountsByStatus = (ordersList) => {
    const counts = ordersList.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});
    setOrderCountsByStatus(counts);
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8080/api/v1/orders/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            size: 1000,
          },
        }
      );
      setOrders(response.data.content);
      calculateOrderCountsByStatus(response.data.content);  // Tính số lượng đơn hàng theo trạng thái
      setPagination({
        current: 1,
        pageSize: 10,
        total: response.data.totalElements,
      });
      applyFiltersAndSort(
        response.data.content,
        "newest",
        dateRange,
        statusFilter,
        searchTerm
      );
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const viewOrderDetails = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
    applyFiltersAndSort(orders, value, dateRange, statusFilter, searchTerm);
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

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    applyFiltersAndSort(orders, sortOrder, dateRange, value, searchTerm);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFiltersAndSort(orders, sortOrder, dateRange, statusFilter, value);
  };

  const handleTodayFilter = () => {
    setIsTodayFilter((prev) => !prev);
    if (!isTodayFilter) {
      const todayStart = dayjs().startOf("day").toDate();
      const todayEnd = dayjs().endOf("day").toDate();
      setDateRange([todayStart, todayEnd]);
      applyFiltersAndSort(orders, sortOrder, [todayStart, todayEnd], statusFilter, searchTerm);
    } else {
      setDateRange([]);
      applyFiltersAndSort(orders, sortOrder, [], statusFilter, searchTerm);
    }
  };

  const applyFiltersAndSort = (
    ordersList,
    sortOrder,
    dateRange,
    statusFilter,
    searchTerm
  ) => {
    let filteredOrders = [...ordersList];

    if (dateRange && dateRange.length === 2) {
      const [start, end] = dateRange;
      const startDate = dayjs(start).startOf('day').tz('Asia/Ho_Chi_Minh', true);
      const endDate = dayjs(end).endOf('day').tz('Asia/Ho_Chi_Minh', true);

      filteredOrders = filteredOrders.filter((order) => {
        const orderDateArray = order.createdAt;
        const orderDate = dayjs.utc(
          new Date(Date.UTC(orderDateArray[0], orderDateArray[1] - 1, orderDateArray[2], orderDateArray[3], orderDateArray[4], orderDateArray[5]))
        ).tz('Asia/Ho_Chi_Minh', true);
        return orderDate.isAfter(startDate) && orderDate.isBefore(endDate);
      });
    }

    if (statusFilter) {
      filteredOrders = filteredOrders.filter(
        (order) => order.status === statusFilter
      );
    }

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filteredOrders = filteredOrders.filter(
        (order) =>
          order.user?.userName.toLowerCase().includes(lowerCaseSearchTerm) ||
          (order.user?.firstName &&
            order.user.firstName.toLowerCase().includes(lowerCaseSearchTerm)) ||
          (order.user?.lastName &&
            order.user.lastName.toLowerCase().includes(lowerCaseSearchTerm)) ||
          (order.address?.address &&
            order.address.address.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }

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

    filteredOrders.sort((a, b) => {
      const statusComparison = statusPriority[a.status] - statusPriority[b.status];
      if (statusComparison !== 0) {
        return statusComparison;
      }

      switch (sortOrder) {
        case "newest":
          const dateA = dayjs.utc(new Date(Date.UTC(...a.createdAt))).tz('Asia/Ho_Chi_Minh', true);
          const dateB = dayjs.utc(new Date(Date.UTC(...b.createdAt))).tz('Asia/Ho_Chi_Minh', true);
          return dateB - dateA;

        case "oldest":
          const dateAOldest = dayjs.utc(new Date(Date.UTC(...a.createdAt))).tz('Asia/Ho_Chi_Minh', true);
          const dateBOldest = dayjs.utc(new Date(Date.UTC(...b.createdAt))).tz('Asia/Ho_Chi_Minh', true);
          return dateAOldest - dateBOldest;

        case "price-low":
          return a.price - b.price;

        case "price-high":
          return b.price - a.price;

        default:
          return 0;
      }
    });

    setFilteredOrders(filteredOrders);
  };

  const formatDate = (dateArray) => {
    if (!Array.isArray(dateArray) || dateArray.length !== 6) {
      return "N/A";
    }
    const [year, month, day, hours, minutes, seconds] = dateArray;
    const date = dayjs.utc(
      new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds))
    ).tz('Asia/Ho_Chi_Minh', true);
    if (!date.isValid()) {
      return "N/A";
    }
    return date.format('YYYY-MM-DD HH:mm:ss');
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/api/v1/orders/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const renderStatusSelect = (status, record) => {
    const handleClick = (e) => {
      e.stopPropagation();
    };

    if (
      status === "Delivered" ||
      status === "Cancelled" ||
      status === "Refunded" ||
      status === "Returned"
    ) {
      return (
        <StyledSelect
          status={status}
          value={status}
          disabled
          onClick={handleClick}
          size="small"
        >
          <Option value="Pending">Pending</Option>
          <Option value="Paid">Paid</Option>
          <Option value="Packaging">Packaging</Option>
          <Option value="Shipping">Shipping</Option>
          <Option value="Delivered">Delivered</Option>
          <Option value="Returned">Returned</Option>
          <Option value="Cancelled">Cancelled</Option>
          <Option value="Refunded">Refunded</Option>
        </StyledSelect>
      );
    }

    return (
      <StyledSelect
        status={status}
        value={status}
        onChange={(value) => updateOrderStatus(record.orderId, value)}
        onClick={handleClick}
        size="small"
      >
        <Option value="Pending">Pending</Option>
        <Option value="Paid">Paid</Option>
        <Option value="Packaging">Packaging</Option>
        <Option value="Shipping">Shipping</Option>
        <Option value="Delivered">Delivered</Option>
        <Option value="Returned">Returned</Option>
        <Option value="Cancelled">Cancelled</Option>
        <Option value="Refunded">Refunded</Option>
      </StyledSelect>
    );
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "orderId",
      key: "orderId",
      render: (text) => <span style={{ fontSize: "12px" }}>{text}</span>,
    },
    {
      title: "User",
      dataIndex: ["user", "userName"],
      key: "user",
      render: (text) => <span style={{ fontSize: "12px" }}>{text}</span>,
    },
    {
      title: "First Name",
      key: "firstName",
      render: (text, record) => {
        return (
          <span style={{ fontSize: "12px" }}>
            {record.user?.firstName || record.address?.firstName || "null"}
          </span>
        );
      },
    },
    {
      title: "Last Name",
      key: "lastName",
      render: (text, record) => {
        return (
          <span style={{ fontSize: "12px" }}>
            {record.user?.lastName || record.address?.lastName || "null"}
          </span>
        );
      },
    },
    {
      title: "Total Price",
      dataIndex: "price",
      key: "price",
      render: (text) => <span style={{ fontSize: "12px" }}>${text}</span>,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (address) => (
        <span style={{ fontSize: "12px" }}>
          {address ? `${address.address}` : "No address"}
        </span>
      ),
    },
    {
      title: "Order Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => (
        <span style={{ fontSize: "12px" }}>{formatDate(createdAt)}</span>
      ),
    },
    {
      title: "Payment Method",
      dataIndex: ["payment", "paymentMethod"],
      key: "paymentMethod",
      render: (text) => (
        <span style={{ fontSize: "12px" }}>{text || "No payment method"}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => renderStatusSelect(status, record),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (updatedAt) => (
        <span style={{ fontSize: "12px" }}>{formatDate(updatedAt)}</span>
      ),
    },
  ];

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const itemRender = (_, type, originalElement) => {
    if (type === "prev") {
      return (
        <div className="custom-pagination-button">
          <FaArrowLeft />
        </div>
      );
    }
    if (type === "next") {
      return (
        <div className="custom-pagination-button">
          <FaArrowRight />
        </div>
      );
    }
    if (type === "page") {
      return (
        <div className="custom-pagination-button">
          {originalElement.props.children}
        </div>
      );
    }
    return originalElement;
  };

  return (
    <motion.div
      className="orders-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="header-orders-container">
        <div className="title-orders-container">
          <p>Orders</p>
        </div>
        <div className="menu-orders-container">
          <div className="sort-orders-menu">
            <Select
              style={{ width: 120 }}
              onChange={handleSortChange}
              defaultValue="newest" 
              placeholder="Sort by"
              size="small"
            >
              <Option value="newest">Newest</Option>
              <Option value="oldest">Oldest</Option>
              <Option value="price-low">Price, low to high</Option>
              <Option value="price-high">Price, high to low</Option>
              <Option value="status">Status</Option>
            </Select>
            <Button onClick={handleTodayFilter} size="small">
              {isTodayFilter ? "Remove Today Filter" : "Today"}
            </Button>
            <RangePicker
              style={{ width: 150 }}
              onChange={handleDateRangeChange}
              size="small"
            />
            <Select
              style={{ width: 120 }}
              onChange={handleStatusFilterChange}
              defaultValue=""
              placeholder="Filter by Status"
              size="small"
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
            <Input
              placeholder="Search something"
              value={searchTerm}
              onChange={handleSearchChange}
              style={{ width: 130 }}
              size="small"
            />
            <div className="button-create-orderadmin">
              <Link to="add">
                <p>Create order</p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredOrders}
        pagination={{ ...pagination, showSizeChanger: false, itemRender }}
        onChange={handleTableChange}
        rowKey="orderId"
        onRow={(record) => ({
          onClick: () => viewOrderDetails(record.orderId),
        })}
        rowClassName="clickable-row"
        size="small"
      />
    </motion.div>
  );
};

export default OrderListAdmin;

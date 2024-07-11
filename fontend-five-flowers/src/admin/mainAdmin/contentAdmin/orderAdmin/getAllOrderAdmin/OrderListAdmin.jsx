import { Select, Table, Tag } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./orderListAdmin.scss";

const { Option } = Select;

const OrderListAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [sortOrder, setSortOrder] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const navigate = useNavigate();

  const fetchOrders = async (page = 1, pageSize = 10) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8080/api/v1/orders/all",
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
      setOrders(response.data.content);
      setFilteredOrders(response.data.content);
      setPagination({
        current: page,
        pageSize: pageSize,
        total: response.data.totalElements,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);

  const viewOrderDetails = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
    applySort(value);
  };

  const applySort = (sortOrder) => {
    let sortedOrders = [...orders];
    switch (sortOrder) {
      case "newest":
        sortedOrders.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case "oldest":
        sortedOrders.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        break;
      case "price-low":
        sortedOrders.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sortedOrders.sort((a, b) => b.price - a.price);
        break;
      case "status-pending":
      case "status-paid":
      case "status-packaging":
      case "status-shipping":
      case "status-delivered":
      case "status-cancelled":
      case "status-refunded":
        sortedOrders = sortedOrders.filter(
          (order) => order.status.toLowerCase() === sortOrder.split("-")[1]
        );
        break;
      default:
        break;
    }
    setFilteredOrders(sortedOrders);
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
      title: "ID",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "User",
      dataIndex: ["user", "userName"],
      key: "user",
    },
    {
      title: "First Name",
      key: "firstName",
      render: (text, record) => {
        return record.user?.firstName || record.address?.firstName || "null";
      },
    },
    {
      title: "Last Name",
      key: "lastName",
      render: (text, record) => {
        return record.user?.lastName || record.address?.lastName || "null";
      },
    },
    {
      title: "Total Price",
      dataIndex: "price",
      key: "price",
      render: (text) => `₹${text}`,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (address) =>
        address
          ? `${address.address}, ${address.postalCode}`
          : "No address",
    },
    {
      title: "Postcode",
      dataIndex: ["address", "postalCode"],
      key: "postalCode",
    },
    {
      title: "Order Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => formatDate(createdAt),
    },
    {
      title: "Payment Method",
      dataIndex: ["payment", "paymentMethod"],
      key: "paymentMethod",
      render: (text) => text || "No payment method",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color;
        switch (status) {
          case "Pending":
            color = "gold";
            break;
          case "Paid":
            color = "green";
            break;
          case "Packaging":
            color = "blue";
            break;
          case "Shipping":
            color = "cyan";
            break;
          case "Delivered":
            color = "lime";
            break;
          case "Cancelled":
            color = "red";
            break;
          case "Refunded":
            color = "purple";
            break;
          default:
            color = "default";
        }
        return (
          <Tag
            color={color}
            onClick={(e) => e.stopPropagation()} // prevent event propagation
          >
            {status}
          </Tag>
        );
      },
    },
  ];

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  return (
    <div className="orders-container">
      <div className="header-orders-container">
        <div className="title-orders-container">
          <p>Orders</p>
        </div>
        <div className="menu-orders-container">
          <div className="sort-orders-menu">
            <Select
              style={{ width: 200 }}
              onChange={handleSortChange}
              placeholder="Sort by"
            >
              <Option value="newest">Newest</Option>
              <Option value="oldest">Oldest</Option>
              <Option value="price-low">Price, low to high</Option>
              <Option value="price-high">Price, high to low</Option>
              <Option value="status-pending">Pending Payment</Option>
              <Option value="status-paid">Paid</Option>
              <Option value="status-packaging">Packaging</Option>
              <Option value="status-shipping">Shipping</Option>
              <Option value="status-delivered">Delivered</Option>
              <Option value="status-cancelled">Cancelled</Option>
              <Option value="status-refunded">Refunded</Option>
            </Select>
          </div>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredOrders}
        pagination={{ ...pagination, showSizeChanger: false }}
        onChange={handleTableChange}
        rowKey="orderId"
        onRow={(record) => ({
          onClick: () => viewOrderDetails(record.orderId), // navigate to order details on row click
        })}
        rowClassName="clickable-row"
      />
    </div>
  );
};

export default OrderListAdmin;

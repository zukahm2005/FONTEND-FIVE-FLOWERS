import { DatePicker, Select, Table, Tag } from "antd";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../../../../../user/Main/header/components/cart/cartContext/CartProvider";
import "./UserDetail.scss";
import CartUserDetails from "../../../../../user/Main/header/components/cart/cartUser/cartUserDetails/CartUserDetails";
const { Option } = Select;
const { RangePicker } = DatePicker;

const GetUserDetails = () => {
  const { isLoggedIn } = useContext(CartContext);
  const [userDetails, setUserDetails] = useState([]);
  const [filteredDetails, setFilteredDetails] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [sortOrder, setSortOrder] = useState("status");

  const fetchUserDetails = async () => {
    if (!isLoggedIn) return;
    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      const response = await axios.get(
        `http://localhost:8080/api/v1/users/details/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserDetails(response.data);
      applyFiltersAndSort(response.data, sortOrder, dateRange, statusFilter);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserDetails();
    }
  }, [isLoggedIn]);

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    applyFiltersAndSort(userDetails, sortOrder, dateRange, value);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    applyFiltersAndSort(userDetails, sortOrder, dates, statusFilter);
  };

  const handleSortOrderChange = (value) => {
    setSortOrder(value);
    applyFiltersAndSort(userDetails, value, dateRange, statusFilter);
  };

  const statusPriority = {
    Active: 1,
    Inactive: 2,
    Banned: 3,
    Suspended: 4,
  };

  const applyFiltersAndSort = (
    detailsList,
    sortOrder,
    dateRange,
    statusFilter
  ) => {
    let filteredDetails = [...detailsList];

    if (dateRange && dateRange.length === 2) {
      const [start, end] = dateRange;
      const startDate = new Date(start).setHours(0, 0, 0, 0);
      const endDate = new Date(end).setHours(23, 59, 59, 999);
      filteredDetails = filteredDetails.filter((detail) => {
        const detailDateArray = detail.createdAt;
        const detailDate = new Date(
          Date.UTC(
            detailDateArray[0],
            detailDateArray[1] - 1,
            detailDateArray[2],
            detailDateArray[3],
            detailDateArray[4],
            detailDateArray[5]
          )
        );
        return detailDate >= startDate && detailDate <= endDate;
      });
    }

    if (statusFilter) {
      filteredDetails = filteredDetails.filter(
        (detail) => detail.status === statusFilter
      );
    }

    switch (sortOrder) {
      case "newest":
        filteredDetails.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case "oldest":
        filteredDetails.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        break;
      case "status":
        filteredDetails.sort(
          (a, b) => statusPriority[a.status] - statusPriority[b.status]
        );
        break;
      default:
        break;
    }
    setFilteredDetails(filteredDetails);
  };

  const getStatusTag = (status) => {
    let color;
    switch (status) {
      case "Active":
        color = "green";
        break;
      case "Inactive":
        color = "gray";
        break;
      case "Banned":
        color = "red";
        break;
      case "Suspended":
        color = "orange";
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
    const date = new Date(
      Date.UTC(year, month - 1, day, hours, minutes, seconds)
    ); // Note month starts from 0 in JavaScript
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
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Join Date",
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
    <div className="user-details-container">
      <div className="user-details-header-container">
        <div className="title-user-details">
          <p>User Details</p>
        </div>
        <div className="filters-user-details">
          <Select
            style={{ width: 200 }}
            onChange={handleSortOrderChange}
            defaultValue="status"
            placeholder="Sort by"
          >
            <Option value="newest">Newest</Option>
            <Option value="oldest">Oldest</Option>
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
            <Option value="Active">Active</Option>
            <Option value="Inactive">Inactive</Option>
            <Option value="Banned">Banned</Option>
            <Option value="Suspended">Suspended</Option>
          </Select>
        </div>
      </div>

      <Table
        dataSource={filteredDetails}
        columns={columns}
        rowKey="userId"
        expandable={{
          expandedRowRender: (detail) => <CartUserDetails detail={detail} />,
        }}
      />
    </div>
  );
};

export default GetUserDetails;
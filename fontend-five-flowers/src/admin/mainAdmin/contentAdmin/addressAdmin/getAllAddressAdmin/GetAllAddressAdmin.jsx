import { Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import './GetAllAddressAdmin.scss';

const GetAllAddressAdmin = () => {
  const [addresses, setAddresses] = useState([]);
  const [filteredAddresses, setFilteredAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filter, setFilter] = useState({
    sort: "all",
    search: "",
  });

  const navigate = useNavigate();

  const fetchAddresses = async (page = 1, pageSize = 10) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("You need to be logged in to view addresses");
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/admin/getAllUsers",
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
      const allUsers = response.data.content || response.data; // Điều chỉnh nếu có phân trang hoặc không
      const userAddresses = allUsers.filter(user => user.roles.includes('ROLE_USER')); // Lọc những người dùng có roles là ROLE_USER
      console.log(userAddresses); // Log data để kiểm tra
      setAddresses(userAddresses);
      setPagination({
        current: page,
        pageSize: pageSize,
        total: userAddresses.length,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching addresses", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);

  useEffect(() => {
    handleFilterAndSort();
  }, [filter, addresses]);

  const handleFilterAndSort = () => {
    let filtered = [...addresses];

    // Xử lý tìm kiếm
    if (filter.search) {
      filtered = filtered.filter((address) =>
        address.userName.toLowerCase().includes(filter.search.toLowerCase())
      );
    }

    // Xử lý sắp xếp
    switch (filter.sort) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "a-to-z":
        filtered.sort((a, b) => a.userName.localeCompare(b.userName));
        break;
      case "z-to-a":
        filtered.sort((a, b) => b.userName.localeCompare(a.userName));
        break;
      default:
        break;
    }

    setFilteredAddresses(filtered);
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
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
      title: "ID",
      dataIndex: "id",
      key: "id",
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
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => formatDate(text), // Sử dụng formatDate để hiển thị ngày giờ
    }
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
    <div className="getalladdress-admin">
      <div className="getalladdress-header">
        <h2>All Addresses</h2>
        <div className="menu-user-container">
          <div className="sort-menu">
            <select
              className="sort-select"
              value={filter.sort}
              onChange={(e) => {
                console.log("Sort filter changed:", e.target.value);
                setFilter({ ...filter, sort: e.target.value });
              }}
            >
              <option value="all">All</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="a-to-z">A to Z</option>
              <option value="z-to-a">Z to A</option>
            </select>
          </div>
          <div className="search-proadmin-container">
            <input
              type="text"
              placeholder="Search address..."
              value={filter.search}
              onChange={(e) => {
                setFilter({ ...filter, search: e.target.value });
              }}
            />
          </div>
        </div>
      </div>
      <div className="bottom-proadmin-container">
        <Table
          columns={columns}
          dataSource={filteredAddresses}
          loading={loading}
          pagination={{ ...pagination, itemRender }}
          onChange={handleTableChange}
          rowKey="id"
          onRow={(record) => {
            return {
              onClick: () => {
                navigate(`/admin/address/customer/${record.id}`); // Điều hướng đến UserDetail với ID người dùng
              },
            };
          }}
        />
      </div>
    </div>
  );
};

export default GetAllAddressAdmin;

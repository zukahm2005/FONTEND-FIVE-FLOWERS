import { Modal, Space, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
        "http://localhost:8080/api/v1/addresses/all",
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
      setAddresses(response.data.content || response.data); // Adjust if using pagination or not
      setPagination({
        current: page,
        pageSize: pageSize,
        total: response.data.totalElements || response.data.length,
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
    handleSearch();
  }, [searchTerm, addresses]);

  const handleSearch = () => {
    let filtered = [...addresses];

    if (searchTerm) {
      filtered = filtered.filter((address) =>
        address.user &&
        address.user.userName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAddresses(filtered);
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this address?",
      content: "This action cannot be undone",
      onOk: () => handleDelete(id),
      onCancel: () => {},
    });
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("You need to be logged in to delete address");
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8080/api/v1/addresses/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Address deleted successfully");
      setError("");
      fetchAddresses(pagination.current, pagination.pageSize); // Refresh the addresses list after deletion
    } catch (error) {
      console.error("Error deleting address", error);
      setError("Error deleting address");
      setSuccess("");
    }
  };

  const columns = [
    {
      title: "User",
      dataIndex: ["user", "userName"],
      key: "user",
      render: (text) => (text ? text : "No user"),
    },
    {
      title: "Phone",
      dataIndex: ["user", "phone"],
      key: "phone",
      render: (text) => (text ? text : "No phone"),
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "email",
      render: (text) => (text ? text : "No email"),
    },
    {
      title: "Address",
      key: "address",
      render: (text, record) => (
        <div className="address-horizontal">
          <p>{record.addressLine1}</p>
          <p>{record.addressLine2}</p>
          <p>{record.city}, {record.state}</p>
          <p>{record.postalCode}</p>
          <p>{record.country}</p>
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Link to={`/admin/update-address/${record.addressId}`}>
            <MdEdit />
          </Link>
          <div onClick={() => confirmDelete(record.addressId)}>
            <MdDelete style={{ cursor: "pointer" }} />
          </div>
        </Space>
      ),
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
    <div className="getalladdress-admin">
      <div className="getalladdress-header">
        <h2>All Customers</h2>
        <input
          type="text"
          placeholder="Search by user name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="bottom-proadmin-container">
        <Table
          columns={columns}
          dataSource={filteredAddresses}
          loading={loading}
          pagination={{ ...pagination, itemRender }}
          onChange={handleTableChange}
          rowKey="addressId"
        />
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
};

export default GetAllAddressAdmin;

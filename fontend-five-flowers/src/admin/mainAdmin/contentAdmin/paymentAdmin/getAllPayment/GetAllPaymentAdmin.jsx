import { Modal, Space, Table } from "antd";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import "./GetAllPaymentAdmin.scss";

const GetAllPaymentAdmin = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
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
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/v1/payments/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      console.log("Response data:", response.data); // Log dữ liệu phản hồi
      setPayments(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.data.length,
      }));
      setLoading(false);
    } catch (error) {
      console.error("There was an error fetching the payments!", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    handleFilterAndSort();
  }, [filter, payments, pagination.current, pagination.pageSize]);

  const handleFilterAndSort = () => {
    let filtered = [...payments];

    // Xử lý bộ lọc tìm kiếm
    if (filter.search) {
      filtered = filtered.filter((payment) =>
        payment.paymentMethod.toLowerCase().includes(filter.search.toLowerCase())
      );
    }

    // Xử lý sắp xếp
    switch (filter.sort) {
      case "newest":
        filtered.sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.paymentDate) - new Date(b.paymentDate));
        break;
      default:
        break;
    }

    // Xử lý phân trang
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    console.log("Filtered Payments:", filtered.slice(start, end)); // Log dữ liệu đã lọc
    setFilteredPayments(filtered.slice(start, end));
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleReadMore = (payment) => {
    setSelectedPayment(payment);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedPayment(null);
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this payment?",
      content: "This action cannot be undone",
      onOk: () => handleDelete(id),
      onCancel: () => {},
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/payments/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      fetchPayments();
    } catch (error) {
      console.error("There was an error deleting the payment!", error);
    }
  };

  const formatDate = (dateString) => {
    return moment(dateString).format("YYYY-MM-DD HH:mm:ss");
  };

  const columns = [
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Payment Date",
      dataIndex: "paymentDate",
      key: "paymentDate",
      render: (text) => formatDate(text),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Link to={`edit/${record.paymentId}`}>
            <MdEdit />
          </Link>
          <div onClick={() => confirmDelete(record.paymentId)}>
            <MdDelete style={{ cursor: "pointer" }} />
          </div>
        </Space>
      ),
    },
  ];

  const itemRender = (current, type, originalElement) => {
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
      return <div className="custom-pagination-button">{current}</div>;
    }
    return originalElement;
  };

  return (
    <div className="page-payment-admin-full-width-container">
      <div className="header-payment-admin-box">
        <div className="title-paymentadmin">
          <p>Payments</p>
        </div>
        <div className="menu-paymentadmin-container">
          <div className="sort-menu">
            <select
              className="sort-select"
              value={filter.sort}
              onChange={(e) => {
                setFilter({ ...filter, sort: e.target.value });
              }}
            >
              <option value="all">All</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
          <div className="search-paymentadmin-container">
            <input
              type="text"
              placeholder="Search payments..."
              value={filter.search}
              onChange={(e) => {
                setFilter({ ...filter, search: e.target.value });
              }}
            />
          </div>
          <div className="button-create-paymentadmin">
            <Link to="add">
              <p>Add Payment</p>
            </Link>
          </div>
        </div>
      </div>
      <div className="bottom-paymentadmin-container">
        <Table
          columns={columns}
          dataSource={filteredPayments}
          loading={loading}
          pagination={{ ...pagination, itemRender }}
          onChange={handleTableChange}
          rowKey="paymentId"
        />
      </div>
      <Modal
        title={selectedPayment?.paymentMethod}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {selectedPayment && formatDate(selectedPayment.paymentDate)}
          </motion.div>
        </AnimatePresence>
      </Modal>
    </div>
  );
};

export default GetAllPaymentAdmin;

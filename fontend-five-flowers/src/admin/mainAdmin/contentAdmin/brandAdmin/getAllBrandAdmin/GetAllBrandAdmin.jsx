import { Modal, Space, Table } from "antd";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import "./GetAllBrandAdmin.scss";

const GetAllBrandAdmin = () => {
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filter, setFilter] = useState({
    search: "",
  });
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const fetchBrands = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/brands/all",
        {
          params: {
            page: page - 1,
            size: pageSize,
          },
        }
      );
      setBrands(response.data.content);
      setPagination({
        current: page,
        pageSize: pageSize,
        total: response.data.totalElements,
      });
      setLoading(false);
    } catch (error) {
      console.error("There was an error fetching the brands!", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);

  useEffect(() => {
    handleFilterAndSort();
  }, [filter, brands]);

  const handleFilterAndSort = () => {
    let filtered = [...brands];

    // Handle search filter
    if (filter.search) {
      filtered = filtered.filter((brand) =>
        brand.name.toLowerCase().includes(filter.search.toLowerCase())
      );
    }

    setFilteredBrands(filtered);
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleReadMore = (brand) => {
    setSelectedBrand(brand);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedBrand(null);
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this brand?",
      content: "This action cannot be undone",
      onOk: () => handleDelete(id),
      onCancel: () => {},
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/brands/delete/${id}`);
      fetchBrands(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error("There was an error deleting the brand!", error);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text, record) => (
        <div>
          {text.split(" ").slice(0, 20).join(" ")}
          {text.split(" ").length > 20 && (
            <p
              type="link"
              onClick={() => handleReadMore(record)}
              className="read-more"
            >
              ...Read more
            </p>
          )}
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Link to={`edit/${record.brandId}`}>
            <MdEdit />
          </Link>
          <div onClick={() => confirmDelete(record.brandId)}>
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
    <div className="page-brand-admin-full-width-container">
      <div className="header-brand-admin-box">
        <div className="title-brand-admin">
          <p>Brands</p>
        </div>
        <div className="menu-brand-admin-container">
          <div className="search-brand-admin-container">
            <input
              type="text"
              placeholder="Search brands..."
              value={filter.search}
              onChange={(e) => {
                setFilter({ ...filter, search: e.target.value });
              }}
            />
          </div>
          <div className="button-create-brand-admin">
            <Link to="add">
              <p>Create Brand</p>
            </Link>
          </div>
        </div>
      </div>
      <div className="bottom-brand-admin-container">
        <Table
          columns={columns}
          dataSource={filteredBrands}
          loading={loading}
          pagination={{ ...pagination, itemRender }}
          onChange={handleTableChange}
          rowKey="brandId"
        />
      </div>
      <Modal
        title={selectedBrand?.name}
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
            {selectedBrand?.description}
          </motion.div>
        </AnimatePresence>
      </Modal>
    </div>
  );
};

export default GetAllBrandAdmin;

import { Modal, Space, Table } from "antd";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import "./GetAllCategoryAdmin.scss";

const GetAllCategoryAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filter, setFilter] = useState({
    search: "",
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const fetchCategories = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/categories/all",
        {
          params: {
            page: page - 1,
            size: pageSize,
          },
        }
      );
      setCategories(response.data.content);
      setPagination({
        current: page,
        pageSize: pageSize,
        total: response.data.totalElements,
      });
      setLoading(false);
    } catch (error) {
      console.error("There was an error fetching the categories!", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);

  useEffect(() => {
    handleFilterAndSort();
  }, [filter, categories]);

  const handleFilterAndSort = () => {
    let filtered = [...categories];

    // Handle search filter
    if (filter.search) {
      filtered = filtered.filter((category) =>
        category.name.toLowerCase().includes(filter.search.toLowerCase())
      );
    }

    setFilteredCategories(filtered);
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleReadMore = (category) => {
    setSelectedCategory(category);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedCategory(null);
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this category?",
      content: "This action cannot be undone",
      onOk: () => handleDelete(id),
      onCancel: () => {},
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/categories/delete/${id}`);
      fetchCategories(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error("There was an error deleting the category!", error);
    }
  };

  const stripHtml = (html) => {
    let doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
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
          {stripHtml(text).split(" ").slice(0, 20).join(" ")}
          {stripHtml(text).split(" ").length > 20 && (
            <span
              type="link"
              onClick={() => handleReadMore(record)}
              className="read-more"
            >
              ...Read more
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Link to={`edit/${record.categoryId}`}>
            <MdEdit />
          </Link>
          <div onClick={() => confirmDelete(record.categoryId)}>
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
    <div className="page-category-admin-full-width-container">
      <div className="header-category-admin-box">
        <div className="title-category-admin">
          <p>Categories</p>
        </div>
        <div className="menu-category-admin-container">
          <div className="search-category-admin-container">
            <input
              type="text"
              placeholder="Search categories..."
              value={filter.search}
              onChange={(e) => {
                setFilter({ ...filter, search: e.target.value });
              }}
            />
          </div>
          <div className="button-create-category-admin">
            <Link to="add">
              <p>Create Category</p>
            </Link>
          </div>
        </div>
      </div>
      <div className="bottom-category-admin-container">
        <Table
          columns={columns}
          dataSource={filteredCategories}
          loading={loading}
          pagination={{ ...pagination, itemRender }}
          onChange={handleTableChange}
          rowKey="categoryId"
        />
      </div>
      <Modal
        title={selectedCategory?.name}
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
            {selectedCategory?.description}
          </motion.div>
        </AnimatePresence>
      </Modal>
    </div>
  );
};

export default GetAllCategoryAdmin;

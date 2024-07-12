import { Modal, Space, Table, Tag } from "antd";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import "./getAllProductAdmin.scss";

const GetAllProductAdmin = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const fetchProducts = async (page = 1, pageSize = 10) => {
    setLoading(true);
    console.log("Fetching products with params:", { page, pageSize });
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/products/all",
        {
          params: {
            page: page - 1,
            size: pageSize,
          },
        }
      );
      console.log("Response:", response.data);
      setProducts(response.data.content);
      setPagination({
        current: page,
        pageSize: pageSize,
        total: response.data.totalElements,
      });
      setLoading(false);
    } catch (error) {
      console.error("There was an error fetching the products!", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);

  useEffect(() => {
    handleFilterAndSort();
  }, [filter, products]);

  const handleFilterAndSort = () => {
    let filtered = [...products];

    if (filter.search) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(filter.search.toLowerCase())
      );
    }

    switch (filter.sort) {
      case "highest-price":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "lowest-price":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleReadMore = (product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this product?",
      content: "This action cannot be undone",
      className: "delete-confirm-modal",
      onOk: () => handleDelete(id),
      onCancel: () => {},
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/products/delete/${id}`);
      fetchProducts(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error("There was an error deleting the product!", error);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Image",
      dataIndex: "productImages",
      key: "productImages",
      render: (productImages, record) => (
        <Space size="middle">
          {productImages && productImages[0] && (
            <div className="image1-container">
              <img
                src={`http://localhost:8080/api/v1/images/${productImages[0].imageUrl}`}
                alt={record.name}
                style={{ width: 50, height: 50 }}
                className="main-image"
              />
              {record.isOnSale && <span className="sale-badge">Sale</span>}
            </div>
          )}
        </Space>
      ),
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
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => `₹${text}`,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Status",
      key: "status",
      render: (text, record) => (
        <Tag color={record.quantity > 0 ? "green" : "red"}>
          {record.quantity > 0 ? "In Stock" : "Out of Stock"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Link to={`/admin/product/edit/${record.productId}`}>
            <MdEdit />
          </Link>
          <div onClick={() => confirmDelete(record.productId)}>
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
    <div className="page-product-admin-full-width-container">
      <div className="header-product-admin-box">
        <div className="title-proadmin">
          <p>Products</p>
        </div>
        <div className="menu-proadmin-container">
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
              <option value="highest-price">Highest Price</option>
              <option value="lowest-price">Lowest Price</option>
            </select>
          </div>
          <div className="search-proadmin-container">
            <input
              type="text"
              placeholder="Search products..."
              value={filter.search}
              onChange={(e) => {
                setFilter({ ...filter, search: e.target.value });
              }}
            />
          </div>
          <div className="button-create-proadmin">
            <Link to="add">
              <p>Create product</p>
            </Link>
          </div>
        </div>
      </div>
      <div className="bottom-proadmin-container">
        <Table
          columns={columns}
          dataSource={filteredProducts}
          loading={loading}
          pagination={{ ...pagination, itemRender }}
          onChange={handleTableChange}
          rowKey="productId"
        />
      </div>
      <Modal
        title={selectedProduct?.name}
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
            <div
              dangerouslySetInnerHTML={{ __html: selectedProduct?.description }}
            />
          </motion.div>
        </AnimatePresence>
      </Modal>
    </div>
  );
};

export default GetAllProductAdmin;

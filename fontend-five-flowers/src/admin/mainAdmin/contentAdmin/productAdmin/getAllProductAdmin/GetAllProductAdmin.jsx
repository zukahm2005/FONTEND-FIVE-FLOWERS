import { Modal, Popover, Space, Table, Tag } from "antd";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import ReactHtmlParser from 'react-html-parser';
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
      const fetchedProducts = response.data.content.map(product => {
        const createdAtDate = new Date(
          Date.UTC(
            product.createdAt[0],
            product.createdAt[1] - 1,
            product.createdAt[2],
            product.createdAt[3],
            product.createdAt[4],
            product.createdAt[5]
          )
        );
        return {
          ...product,
          createdAt: createdAtDate
        };
      });
      setProducts(fetchedProducts);
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
        filtered.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case "oldest":
        filtered.sort((a, b) => a.createdAt - b.createdAt);
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
      console.log(`Deleting product with id: ${id}`);
      const response = await axios.put(`http://localhost:8080/api/v1/products/delete/${id}`);
      console.log('Delete response:', response);
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
      width: 250,
      render: (text) => <span style={{ fontSize: '12px' }}>{text}</span>
    },
    {
      title: "Image",
      dataIndex: "productImages",
      key: "productImages",
      render: (productImages, record) => (
        <Space size="middle">
          {productImages && productImages[0] && (
            <Popover
              content={<img src={`http://localhost:8080/api/v1/images/${productImages[0].imageUrl}`} alt={record.name} style={{ width: 200, height: 200 }} />}
              title={record.name}
            >
              <div className="image1-container">
                <img
                  src={`http://localhost:8080/api/v1/images/${productImages[0].imageUrl}`}
                  alt={record.name}
                  style={{ width: 60, height: 60 }}
                  className="main-image"
                />
                {record.isOnSale && <span className="sale-badge">Sale</span>}
              </div>
            </Popover>
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
          <span style={{ fontSize: '12px' }}>{ReactHtmlParser(text.split(" ").slice(0, 10).join(" "))}</span>
          {text.split(" ").length > 10 && (
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
      render: (text) => <span style={{ fontSize: '12px' }}>${text}</span>
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (text) => <span style={{ fontSize: '12px' }}>{text}</span>
    },
    {
      title: "Status",
      key: "status",
      render: (text, record) => (
        <Tag color={record.quantity > 0 ? "green" : "red"} style={{ fontSize: '12px' }}>
          {record.quantity > 0 ? "In Stock" : "Out of Stock"}
        </Tag>
      ),
    },
    {
      title: "Deleted",
      key: "isDeleted",
      render: (text, record) => (
        <Tag color={record.isDeleted ? "red" : "green"} style={{ fontSize: '12px' }}>
          {record.isDeleted ? "Deleted" : "Active"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Link to={`/admin/product/edit/${record.productId}`}>
            <MdEdit style={{ fontSize: '16px' }} />
          </Link>
          <div onClick={() => confirmDelete(record.productId)}>
            <MdDelete style={{ cursor: "pointer", fontSize: '16px' }} />
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
            <Link to="/admin/product/add">
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
          size="small"
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

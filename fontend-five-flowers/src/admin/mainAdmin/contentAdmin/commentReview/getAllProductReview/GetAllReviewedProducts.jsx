import { Modal, Space, Table } from "antd";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./getAllReviewedProducts.scss";

const GetAllReviewedProducts = () => {
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
  const navigate = useNavigate();

  const fetchProducts = async (page = 1, pageSize = 10) => {
    setLoading(true);
    const token = localStorage.getItem("token"); // Lấy token từ localStorage
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/reviews/reviewed-products",
        {
          params: {
            page: page - 1,
            size: pageSize,
          },
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào headers
          },
        }
      );
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

    // Handle search filter
    if (filter.search) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(filter.search.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleRowClick = (product) => {
    navigate(`/admin/comment/${product.productId}`);
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
        <div onClick={() => handleRowClick(record)}>
          {text.split(" ").slice(0, 20).join(" ")}
          {text.split(" ").length > 20 && (
            <p
              type="link"
              onClick={() => handleRowClick(record)}
              className="read-more"
            >
              ...Read more
            </p>
          )}
        </div>
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
          <p>Reviewed Products</p>
        </div>
        <div className="menu-custommer-container">
          <div className="search-custommeradmin-container">
            <input
              type="text"
              placeholder="Search products..."
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
          dataSource={filteredProducts}
          loading={loading}
          pagination={{ ...pagination, itemRender }}
          onChange={handleTableChange}
          rowKey="productId"
          onRow={(record) => ({
            onClick: () => handleRowClick(record), // Khi nhấn vào dòng sản phẩm sẽ chuyển đến trang chi tiết đánh giá
          })}
        />
      </div>
    </div>
  );
};

export default GetAllReviewedProducts;

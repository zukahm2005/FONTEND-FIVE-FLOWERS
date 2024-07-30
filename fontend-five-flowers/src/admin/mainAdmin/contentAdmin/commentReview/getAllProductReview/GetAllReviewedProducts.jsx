import { Space, Table, Rate, Modal } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import "./getAllReviewedProducts.scss";

const GetAllReviewedProducts = () => {
  const [reviews, setReviews] = useState([]);
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

  const fetchReviews = async (page = 1, pageSize = 10) => {
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

      const allReviews = [];
      for (const product of response.data.content) {
        const commentsResponse = await axios.get(
          `http://localhost:8080/api/v1/reviews/product/${product.productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Thêm token vào headers
            },
          }
        );
        const comments = commentsResponse.data || [];
        comments.forEach(comment => {
          allReviews.push({
            ...comment,
            productName: product.name,
            productImage: product.productImages.length > 0 ? product.productImages[0].imageUrl : null,
          });
        });
      }

      setReviews(allReviews);
      setPagination({
        current: page,
        pageSize: pageSize,
        total: allReviews.length,
      });
      setLoading(false);
    } catch (error) {
      console.error("There was an error fetching the reviews!", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);

  useEffect(() => {
    handleFilterAndSort();
  }, [filter, reviews]);

  useEffect(() => {
    fetchReviews(pagination.current, pagination.pageSize);
  }, []); // Ensure data is fetched again when component is remounted

  const handleFilterAndSort = () => {
    let filtered = [...reviews];

    // Handle search filter
    if (filter.search) {
      filtered = filtered.filter((review) =>
        review.productName.toLowerCase().includes(filter.search.toLowerCase())
      );
    }

    setReviews(filtered);
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleDeleteReview = async (id) => {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage
    try {
      await axios.delete(`http://localhost:8080/api/v1/reviews/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào headers
        },
      });
      fetchReviews(pagination.current, pagination.pageSize); // Refresh data after deletion
    } catch (error) {
      console.error("There was an error deleting the review!", error);
    }
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this review?",
      content: "This action cannot be undone",
      onOk: () => handleDeleteReview(id),
    });
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Product Image",
      dataIndex: "productImage",
      key: "productImage",
      render: (imageUrl) => (
        <Space size="middle">
          {imageUrl && (
            <div className="image1-container">
              <img
                src={`http://localhost:8080/api/v1/images/${imageUrl}`}
                alt="Product"
                style={{ width: 50, height: 50 }}
                className="main-image"
              />
            </div>
          )}
        </Space>
      ),
    },
    {
      title: "User",
      dataIndex: ["user", "userName"],
      key: "userName",
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => <Rate disabled defaultValue={rating} />,
    },
    {
      title: "Delete Status",
      key: "delete",
      render: (text, record) => (
        <Space size="middle">
          <MdDelete
            className="delete-icon"
            onClick={() => confirmDelete(record.reviewId)}
          />
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
                handleFilterAndSort();
              }}
            />
          </div>
        </div>
      </div>
      <div className="bottom-proadmin-container">
        <Table
          columns={columns}
          dataSource={reviews}
          loading={loading}
          pagination={{ ...pagination, itemRender }}
          onChange={handleTableChange}
          rowKey="reviewId"
        />
      </div>
    </div>
  );
};

export default GetAllReviewedProducts;

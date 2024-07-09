import { Modal, Space, Table, Rate } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useParams } from "react-router-dom";
import "./GetAllCommentReview.scss";

const GetAllCommentReview = () => {
  const { productId } = useParams();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedReview, setSelectedReview] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchReviews = async (id, page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/reviews/product/${id}`,
        {
          params: {
            page: page - 1,
            size: pageSize,
          }
        }
      );
      setReviews(response.data.content || response.data);
      setPagination({
        current: page,
        pageSize: pageSize,
        total: response.data.totalElements || response.data.length,
      });
      setLoading(false);
    } catch (error) {
      console.error("There was an error fetching the reviews!", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId && !isNaN(productId)) {
      fetchReviews(productId, pagination.current, pagination.pageSize);
    } else {
      setLoading(false); // Ngừng loading nếu productId không hợp lệ
    }
  }, [productId, pagination.current, pagination.pageSize]);

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleReadMore = (review) => {
    setSelectedReview(review);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedReview(null);
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this review?",
      content: "This action cannot be undone",
      onOk: () => handleDelete(id),
      onCancel: () => {},
    });
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage
    try {
      await axios.delete(`http://localhost:8080/api/v1/reviews/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào headers
        },
      });
      fetchReviews(productId, pagination.current, pagination.pageSize);
    } catch (error) {
      console.error("There was an error deleting the review!", error);
    }
  };

  const columns = [
    {
      title: "User",
      dataIndex: ["user", "userName"],
      key: "userName",
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => <Rate disabled defaultValue={rating} />,
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
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
          <div onClick={() => confirmDelete(record.reviewId)}>
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
    <div className="page-comment-review-full-width-container">
      <div className="header-comment-review-box">
        <div className="title-comment-review">
          <p>Comment Reviews</p>
        </div>
      </div>
      <div className="bottom-comment-review-container">
        <Table
          columns={columns}
          dataSource={reviews}
          loading={loading}
          pagination={{ ...pagination, itemRender }}
          onChange={handleTableChange}
          rowKey="reviewId"
        />
      </div>
      <Modal
        title={selectedReview?.user?.userName}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <p>{selectedReview?.comment}</p>
        <p><strong>Rating:</strong> <Rate disabled defaultValue={selectedReview?.rating} /></p>
        <p><strong>User:</strong> {selectedReview?.user?.userName}</p>
      </Modal>
    </div>
  );
};

export default GetAllCommentReview;

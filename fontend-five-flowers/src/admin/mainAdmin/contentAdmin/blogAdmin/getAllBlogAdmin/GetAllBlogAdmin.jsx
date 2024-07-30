import { Modal, Space, Table } from "antd";
import axios from "axios";
import { MdDelete, MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./getAllBlogAdmin.scss";

const GetAllBlogAdmin = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const navigate = useNavigate();

  const fetchBlogs = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/blogs/all",
        {
          params: {
            page: page - 1,
            size: pageSize,
          },
        }
      );
      setBlogs(response.data.content);
      setPagination({
        current: page,
        pageSize: pageSize,
        total: response.data.totalElements,
      });
      setLoading(false);
    } catch (error) {
      console.error("There was an error fetching the blogs!", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this blog?",
      content: "This action cannot be undone",
      className: "delete-confirm-modal",
      onOk: () => handleDelete(id),
      onCancel: () => {},
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/blogs/delete/${id}`);
      fetchBlogs(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error("There was an error deleting the blog!", error);
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (imageUrl) => (
        <Space size="middle">
          {imageUrl && (
            <div className="image-container">
              <img
                src={imageUrl}
                alt="Blog"
                style={{ width: 50, height: 50 }}
                className="main-image"
              />
            </div>
          )}
        </Space>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <MdEdit
            onClick={() => navigate(`/admin/blog/edit/${record.blogId}`)}
            style={{ cursor: "pointer" }}
          />
          <MdDelete
            onClick={() => confirmDelete(record.blogId)}
            style={{ cursor: "pointer" }}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="page-blog-admin-full-width-container">
      <div className="header-blog-admin-box">
        <div className="title-blogadmin">
          <p>Blogs</p>
        </div>
        <div className="menu-blogadmin-container">
          <button onClick={() => navigate('/admin/blog/add')}>Create Blog Post</button> //sửa
        </div>
      </div>
      <div className="bottom-blogadmin-container">
        <Table
          columns={columns}
          dataSource={blogs}
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          rowKey="blogId"
        />
      </div>
    </div>
  );
};

export default GetAllBlogAdmin;

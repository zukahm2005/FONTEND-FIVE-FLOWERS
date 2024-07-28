import { Drawer, Modal, Pagination, Space, Table, Tag } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import CreateAdmin from "../createAdmin/CreateAdmin";
import "./getAllAdmin.scss";

const GetAllAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    fetchAdmins(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);

  const fetchAdmins = async (page, pageSize) => {
    setLoading(true);
    const token = localStorage.getItem("token"); // Lấy token từ localStorage hoặc context
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/admin/getAllAdmins",
        {
          params: {
            page: page - 1,
            size: pageSize,
            sortBy: "id",
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAdmins(response.data.content);
      setPagination({
        ...pagination,
        total: response.data.totalElements,
      });
      setLoading(false);
    } catch (error) {
      console.error("There was an error fetching the admins!", error);
      setLoading(false);
    }
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this admin?",
      content: "This action cannot be undone",
      onOk: () => handleDelete(id),
      onCancel: () => {},
    });
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage hoặc context
    try {
      await axios.delete(
        `http://localhost:8080/api/v1/admin/deleteUser/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchAdmins(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error("There was an error deleting the admin!", error);
    }
  };

  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
      current: pagination.current,
    });
  };

  const columns = [
    {
      title: "AdminName",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Roles",
      key: "roles",
      render: (_, record) => <Tag color="blue">{record.roles}</Tag>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <div onClick={() => confirmDelete(record.id)}>
            <MdDelete style={{ cursor: "pointer" }} />
          </div>
        </Space>
      ),
    },
  ];

  const itemRender = (_, type, originalElement) => {
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
      return <div className="custom-pagination-button">{_}</div>;
    }
    return originalElement;
  };

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  return (
    <div className="list-manage-admin-container">
      <div className="header-manage-admin-container">
        <div className="title-header-admin">
          <p>Manage Admins</p>
        </div>
        <div className="components-manage-admin-container">
          <div className="add-manage-admin-container" onClick={showDrawer}>
            <p>Create Admin</p>
          </div>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={admins}
        loading={loading}
        rowKey="id"
        pagination={false}
      />
      <div className="pagination-container">
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={(page, pageSize) =>
            handleTableChange({ current: page, pageSize })
          }
          itemRender={itemRender}
        />
      </div>
      <Drawer
        title="Create Admin"
        width={300}
        onClose={closeDrawer}
        visible={drawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <CreateAdmin />
      </Drawer>
    </div>
  );
};

export default GetAllAdmin;

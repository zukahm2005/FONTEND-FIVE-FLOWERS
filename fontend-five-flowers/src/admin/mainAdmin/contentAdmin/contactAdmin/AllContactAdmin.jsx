import { Space, Table, Pagination } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "./allContactAdmin.scss";

const AllContactAdmin = () => {
  const [contacts, setContacts] = useState([]);  // Đảm bảo sử dụng đúng biến contacts
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    if (pagination.current && pagination.pageSize) {
      fetchContacts(pagination.current, pagination.pageSize);
    }
  }, [pagination.current, pagination.pageSize]);

  const fetchContacts = async (page, pageSize) => {
    setLoading(true);
    try {
      const response = await axios.get("/api/v1/contact/allcontact", {
        params: {
          page: page - 1,
          size: pageSize,
        },
      });
      console.log("Full Data from API: ", response.data);  // Log toàn bộ dữ liệu
  
      // Kiểm tra nếu response.data là một mảng (trong trường hợp API trả về trực tiếp mảng các đối tượng liên hệ)
      if (Array.isArray(response.data)) {
        setContacts(response.data);  // Gán trực tiếp response.data vào state contacts
        console.log("Updated contacts: ", response.data); // Log sau khi setContacts
      } else {
        console.error("Invalid data format or content is not an array");
      }
      
      // Giả sử tổng số phần tử trả về là độ dài của mảng (bạn có thể thay đổi logic này nếu cần)
      setPagination({
        ...pagination,
        total: response.data.length,
      });
      
      setLoading(false);
    } catch (error) {
      console.error("There was an error fetching the contacts!", error);
      setLoading(false);
    }
  };
  
  

  // Log giá trị của contacts trước khi render bảng
  console.log("Contacts state: ", contacts);  // Sử dụng contacts thay vì contact

  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
      current: pagination.current,
    });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
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

  return (
    <div className="page-contact-admin-full-width-container">
      <div className="header-contact-admin-box">
        <div className="title-contactadmin">
          <p>Contacts</p>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={contacts}  // Sử dụng contacts thay vì contact
        rowKey="id"  // Sử dụng id làm rowKey
        loading={loading}
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
    </div>
  );
};

export default AllContactAdmin;

import { Button, Checkbox, Input, Modal, Select, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import "./editOrderDetails.scss";

const { Option } = Select;

const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "gold";
    case "Paid":
      return "green";
    case "Packaging":
      return "blue";
    case "Shipping":
      return "cyan";
    case "Delivered":
      return "lime";
    case "Cancelled":
      return "red";
    case "Refunded":
      return "purple";
    default:
      return "default";
  }
};

const StyledSelect = styled(Select)`
  width: 110px !important;
  .ant-select-selection-item {
    color: ${(props) => getStatusColor(props.status)} !important;
  }
`;

const EditOrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [searchProduct, setSearchProduct] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8080/api/v1/orders/get/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrder(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const handleSearch = async (value, page = 1, pageSize = 5) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/api/v1/products/search?query=${value}&page=${page - 1}&size=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSearchResults(response.data.content);
      setPagination({ current: page, pageSize: pageSize, total: response.data.totalElements });
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  const updateStatus = async (orderDetailId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/api/v1/order-details/${orderDetailId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(`Updated status of orderDetailId ${orderDetailId} to ${newStatus}`);
      setOrder((prevOrder) => ({
        ...prevOrder,
        orderDetails: prevOrder.orderDetails.map((detail) =>
          detail.orderDetailId === orderDetailId
            ? { ...detail, status: newStatus }
            : detail
        ),
      }));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleUpdateOrder = async () => {
  try {
    const token = localStorage.getItem("token");
    const updatedOrder = {
      ...order,
      orderDetails: order.orderDetails.map(detail => ({
        orderDetailId: detail.orderDetailId,
        product: { productId: detail.product.productId },
        quantity: detail.quantity,
        price: detail.price,
        status: detail.status,
      }))
    };

    const response = await axios.put(
      `http://localhost:8080/api/v1/orders/update/${id}`,
      updatedOrder,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Order updated successfully:", response.data);
  } catch (error) {
    console.error("Error updating order:", error);
  }
};

  

  const handleRemoveOrderDetail = async (orderDetailId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:8080/api/v1/order-details/delete/${orderDetailId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(`Deleted orderDetailId ${orderDetailId}`);
      setOrder((prevOrder) => ({
        ...prevOrder,
        orderDetails: prevOrder.orderDetails.filter(
          (detail) => detail.orderDetailId !== orderDetailId
        ),
      }));
    } catch (error) {
      console.error("Error deleting order detail:", error);
    }
  };

  const handleAddProduct = () => {
    if (selectedProducts.length > 0) {
      const newOrderDetails = selectedProducts.map((product) => ({
        orderDetailId: Math.floor(Date.now() / 1000), // Use timestamp for orderDetailId
        product: product,
        quantity: 1,
        price: product.price,
        status: "Pending",
      }));

      setOrder((prevOrder) => ({
        ...prevOrder,
        orderDetails: [...prevOrder.orderDetails, ...newOrderDetails],
      }));
      setIsModalVisible(false);
    }
  };

  const calculateTotalPrice = () => {
    return order.orderDetails.reduce(
      (total, detail) => total + detail.price * detail.quantity,
      0
    );
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Brand",
      dataIndex: ["brand", "name"],
      key: "brand",
      render: (text) => text || "N/A",
    },
    {
      title: "Category",
      dataIndex: ["category", "name"],
      key: "category",
      render: (text) => text || "N/A",
    },
    {
      title: "Image",
      dataIndex: ["productImages"],
      key: "productImages",
      render: (productImages) => (
        <img src={`http://localhost:8080/api/v1/images/${productImages[0]?.imageUrl}`} alt="Product" style={{ width: 50, height: 50 }} />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Checkbox
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedProducts([...selectedProducts, record]);
            } else {
              setSelectedProducts(selectedProducts.filter((product) => product.id !== record.id));
            }
          }}
        />
      ),
    },
  ];

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit-order-container">
      <div className="arrow-id-order">
        <div className="arrow-order" onClick={() => navigate(-1)}>
          <p>
            <FaArrowLeft />
          </p>
        </div>
        <div className="id-order">
          <p>Edit order</p>
        </div>
      </div>

      <div className="info-edit-order-container">
        <div className="search-product-to-edit-container">
          <div className="title-edit-product">
            <p>Add product</p>
          </div>
          <div className="input-edit-product">
            <Input.Search
              placeholder="Search product to add"
              onSearch={(value) => handleSearch(value, pagination.current, pagination.pageSize)}
              enterButton
            />
          </div>
        </div>
        {order.orderDetails.map((detail) => (
          <div key={detail.orderDetailId} className="edit-product">
            <div className="product-info">
              <div className="image-ordtails">
                <img
                  src={`http://localhost:8080/api/v1/images/${detail.product.productImages[0].imageUrl}`}
                  alt={detail.product.name}
                  className="product-image"
                />
              </div>
              <div className="product-details">
                <div className="name-info-ordetails">
                  <h3>{detail.product.name}</h3>
                </div>
                <div className="color-info-ordtails">
                  <p>Color: {detail.product.color}</p>
                </div>
                <div className="category-brand-info-ordetails">
                  <p>
                    {detail.product.brand ? detail.product.brand.name : "N/A"} /{" "}
                    {detail.product.category
                      ? detail.product.category.name
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="price-info-ordtails">
                <p>
                  ₹{detail.price} x {detail.quantity}
                </p>
              </div>
              <div className="status-ordtails">
                <StyledSelect
                  status={detail.status}
                  value={detail.status}
                  onChange={(value) =>
                    updateStatus(detail.orderDetailId, value)
                  }
                >
                  <Option value="Pending">Pending</Option>
                  <Option value="Paid">Paid</Option>
                  <Option value="Packaging">Packaging</Option>
                  <Option value="Shipping">Shipping</Option>
                  <Option value="Delivered">Delivered</Option>
                  <Option value="Cancelled">Cancelled</Option>
                  <Option value="Refunded">Refunded</Option>
                </StyledSelect>
              </div>
              <div className="product-price">
                <p>₹{detail.price * detail.quantity}</p>
              </div>
              <div className="remove-detail">
                <div onClick={() => handleRemoveOrderDetail(detail.orderDetailId)}>
                  <p>X</p>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="total-price-ordtails">
          <div className="price-title">
            <h3>Total Price</h3>
          </div>
          <div className="price-title">
            <h3> ₹{calculateTotalPrice()}</h3>
          </div>
        </div>
        <Button type="primary" onClick={handleUpdateOrder}>
          Update Order
        </Button>
      </div>

      <Modal
        title="Select Product"
        visible={isModalVisible}
        onOk={handleAddProduct}
        onCancel={() => setIsModalVisible(false)}
      >
        <Table
          dataSource={searchResults}
          columns={columns}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page, pageSize) => handleSearch(searchProduct, page, pageSize),
          }}
          rowKey="id"
        />
      </Modal>
    </div>
  );
};

export default EditOrderDetails;

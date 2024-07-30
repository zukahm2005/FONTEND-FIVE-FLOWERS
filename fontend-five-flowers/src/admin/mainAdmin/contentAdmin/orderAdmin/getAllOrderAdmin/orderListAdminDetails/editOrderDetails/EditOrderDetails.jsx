import {
  Button,
  Checkbox,
  Input,
  InputNumber,
  Modal,
  Select,
  Table,
  notification,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaPen } from "react-icons/fa";
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
    return (
      <div className="custom-pagination-button">
        {originalElement.props.children}
      </div>
    );
  }
  return originalElement;
};

const EditOrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [searchProduct, setSearchProduct] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [editableQuantityId, setEditableQuantityId] = useState(null);
  const navigate = useNavigate();
  const shippingCost = 5; // Định nghĩa phí vận chuyển cố định

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
        `http://localhost:8080/api/v1/products/search?query=${value}&page=${
          page - 1
        }&size=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSearchResults(response.data.content);
      setPagination({
        current: page,
        pageSize: pageSize,
        total: response.data.totalElements,
      });
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
      console.log(
        `Updated status of orderDetailId ${orderDetailId} to ${newStatus}`
      );
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
        orderDetails: order.orderDetails.map((detail) => ({
          orderDetailId: detail.orderDetailId,
          product: { productId: detail.product.productId },
          quantity: detail.quantity,
          price: detail.price,
          status: detail.status,
        })),
      };

      await axios.put(
        `http://localhost:8080/api/v1/orders/update/${id}`,
        updatedOrder,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      notification.success({
        message: "Order Updated",
        description: "The order has been updated successfully.",
      });

      navigate(-1); // Go back to the previous page
    } catch (error) {
      console.error("Error updating order:", error);
      notification.error({
        message: "Update Failed",
        description: "There was an error updating the order. Please try again.",
      });
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
    const subtotal = order.orderDetails.reduce(
      (total, detail) => total + detail.product.price * detail.quantity,
      0
    );
    return subtotal + shippingCost;
  };

  const handleQuantityChange = (orderDetailId, newQuantity) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      orderDetails: prevOrder.orderDetails.map((detail) =>
        detail.orderDetailId === orderDetailId
          ? { ...detail, quantity: newQuantity }
          : detail
      ),
    }));
  };

  const renderStatusText = (status) => {
    return <span style={{ color: getStatusColor(status) }}>{status}</span>;
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
        <img
          src={`http://localhost:8080/api/v1/images/${productImages[0]?.imageUrl}`}
          alt="Product"
          style={{ width: 50, height: 50 }}
        />
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
              setSelectedProducts(
                selectedProducts.filter((product) => product.id !== record.id)
              );
            }
          }}
        />
      ),
    },
  ];

  if (!order) {
    return <div>Loading...</div>;
  }

  const subtotal = order.orderDetails.reduce(
    (total, detail) => total + detail.product.price * detail.quantity,
    0
  );

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
              onSearch={(value) =>
                handleSearch(value, pagination.current, pagination.pageSize)
              }
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
                  ${detail.product.price} x
                  {editableQuantityId === detail.orderDetailId ? (
                    <InputNumber
                      min={1}
                      value={detail.quantity}
                      onChange={(value) =>
                        handleQuantityChange(detail.orderDetailId, value)
                      }
                      onBlur={() => setEditableQuantityId(null)}
                    />
                  ) : (
                    <>
                      {detail.quantity}{" "}
                      <FaPen
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          setEditableQuantityId(detail.orderDetailId)
                        }
                      />
                    </>
                  )}
                </p>
              </div>
              <div className="status-ordtails">
                {renderStatusText(detail.status)}
              </div>
              <div className="product-price">
                <p>${detail.product.price * detail.quantity}</p>
              </div>
              <div className="remove-detail">
                <div
                  onClick={() => handleRemoveOrderDetail(detail.orderDetailId)}
                >
                  <p>X</p>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="total-price-ordtails">
          <div className="container-title-price-edit-order">
            <div className="price-title-edit-order">
              <p>Subtotal</p>
            </div>
            <div className="price-title-edit-order">
              <p>Shipping</p>
            </div>
            <div className="price-total-edit-order">
              <p>Total</p>
            </div>
          </div>
          <div className="container-price-edit-order">
            <div className="price-title-edit-order">
              <p> ${subtotal}</p>
            </div>
            <div className="price-title-edit-order">
              <p> ${shippingCost}</p>
            </div>
            <div className="price-total-edit-order">
              <p> ${subtotal + shippingCost}</p>
            </div>
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
        footer={null}
      >
        <Table
          dataSource={searchResults}
          columns={columns}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            itemRender,
            onChange: (page, pageSize) =>
              handleSearch(searchProduct, page, pageSize),
          }}
          rowKey="id"
        />
        <div className="modal-footer">
          <div className="cancel-button" onClick={() => setIsModalVisible(false)}>
            <p>Cancel</p>
          </div>
          <div className="ok-button" onClick={handleAddProduct}>
            <p>OK</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EditOrderDetails;

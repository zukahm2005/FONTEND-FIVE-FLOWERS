import { Input, InputNumber, Modal, Select } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaPen } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import "./orderListAdminDetails.scss";

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

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [editableQuantityId, setEditableQuantityId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editableFields, setEditableFields] = useState({});
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
        setEditableFields({
          firstName: response.data.address.firstName,
          lastName: response.data.address.lastName,
          email: response.data.user.email,
          phone: response.data.address.phone,
          address: response.data.address.address,
          city: response.data.address.city,
          postalCode: response.data.address.postalCode,
        });
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const handleEdit = () => {
    navigate(`/admin/orders/edit/${id}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDateTime = (dateArray) => {
    if (!Array.isArray(dateArray) || dateArray.length !== 6) {
      return "N/A";
    }
    const [year, month, day, hours, minutes, seconds] = dateArray;
    const date = new Date(
      Date.UTC(year, month - 1, day, hours, minutes, seconds)
    );
    if (isNaN(date)) {
      return "N/A";
    }
    const formattedDate = date
      .toLocaleString("sv-SE", { timeZone: "UTC" })
      .replace("T", " ");
    return formattedDate;
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

  const handleFieldChange = (field, value) => {
    setEditableFields((prevFields) => ({
      ...prevFields,
      [field]: value,
    }));
  };

  const showEditModal = () => {
    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/api/v1/addresses/update/${order.address.addressId}`,
        {
          ...editableFields,
          user: { id: order.user.id },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrder((prevOrder) => ({
        ...prevOrder,
        address: { ...prevOrder.address, ...editableFields },
      }));
      setModalVisible(false);
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div className="ordtails-page-container">
      <div className="ordtails-page-box">
        <div className="page-box-header-row">
          <div className="arrow-id-order">
            <div className="arrow-order" onClick={() => navigate(-1)}>
              <p>
                <FaArrowLeft />
              </p>
            </div>
            <div className="id-order">
              <p>Order id: {order.orderId}</p>
            </div>
          </div>
          <div className="button-edit-print">
            <div className="button" onClick={handleEdit}>
              <p>Edit</p>
            </div>
            <div className="button" onClick={handlePrint}>
              <p>Print</p>
            </div>
          </div>
        </div>
        <div className="below-page-box">
          <div className="time-order">
            <p>Placed at: {formatDateTime(order.createdAt)}</p>
          </div>
        </div>
      </div>
      <div className="ordtails-layout-container">
        <div className="left-box-layout">
          <div className="block-stack-ordtails">
            <div className="info-ordtails-container">
              {order.orderDetails.map((detail) => (
                <div key={detail.orderDetailId} className="product">
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
                          {detail.product.brand
                            ? detail.product.brand.name
                            : "N/A"}{" "}
                          /
                          {detail.product.category
                            ? detail.product.category.name
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="price-info-ordtails">
                      <p>
                        ₹{detail.price} x{" "}
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
                            {detail.quantity}
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
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="total-price-ordtails">
            <div className="price-title">
              <h3>Total Price</h3>
            </div>
            <div className="price-title">
              <h3> ₹{order.price}</h3>
            </div>
          </div>
        </div>
        <div className="right-box-layout">
          <div className="info-user-ordtails-container">
            <div className="customer-ordtails">
              <div className="title-cus">
                <div className="title">
                  <p>Customer</p>{" "}
                </div>

                <div className="editable-field">
                  <FaPen
                    style={{ cursor: "pointer", marginLeft: "10px" }}
                    onClick={showEditModal}
                  />
                </div>
              </div>

              <div className="name-cus">
                <div className="editable-field">
                  <p>
                    <span>User: </span>
                    {order.user.userName}
                  </p>
                </div>
                <div className="editable-field">
                  <p>
                    <span>Email: </span>
                    {editableFields.email}
                  </p>
                </div>
                <div className="editable-field">
                  <p>
                    <span>First Name: </span>
                    {editableFields.firstName}
                  </p>
                </div>
                <div className="editable-field">
                  <p>
                    <span>Last Name: </span>
                    {editableFields.lastName}
                  </p>
                </div>
                <div className="editable-field">
                  <p>
                    <span>Phone: </span>
                    {editableFields.phone}
                  </p>
                </div>
              </div>
            </div>
            <div className="shipping-ordtails">
              <div className="title-ship">
                <p>Shipping address</p>
              </div>
              <div className="editable-field">
                <p>
                  {`${editableFields.address}, ${editableFields.city}, ${editableFields.postalCode}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Edit Information"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSave}
      >
        <div>
          <label>Email:</label>
          <Input
            value={editableFields.email}
            onChange={(e) => handleFieldChange("email", e.target.value)}
          />
        </div>
        <div>
          <label>First Name:</label>
          <Input
            value={editableFields.firstName}
            onChange={(e) => handleFieldChange("firstName", e.target.value)}
          />
        </div>
        <div>
          <label>Last Name:</label>
          <Input
            value={editableFields.lastName}
            onChange={(e) => handleFieldChange("lastName", e.target.value)}
          />
        </div>
        <div>
          <label>Phone:</label>
          <Input
            value={editableFields.phone}
            onChange={(e) => handleFieldChange("phone", e.target.value)}
          />
        </div>
        <div>
          <label>Address:</label>
          <Input
            value={editableFields.address}
            onChange={(e) => handleFieldChange("address", e.target.value)}
          />
        </div>
        <div>
          <label>City:</label>
          <Input
            value={editableFields.city}
            onChange={(e) => handleFieldChange("city", e.target.value)}
          />
        </div>
        <div>
          <label>Postal Code:</label>
          <Input
            value={editableFields.postalCode}
            onChange={(e) => handleFieldChange("postalCode", e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default OrderDetails;

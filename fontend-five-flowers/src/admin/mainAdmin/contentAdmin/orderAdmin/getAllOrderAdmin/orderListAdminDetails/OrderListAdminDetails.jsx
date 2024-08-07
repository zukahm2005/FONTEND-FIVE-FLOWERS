import { Input, InputNumber, Modal, Select } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaPen } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import "./orderListAdminDetails.scss";
import PrintableOrder from "./printOrder/PrintableOrder";

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
    case "Returned":
      return "gray";
    default:
      return "default";
  }
};

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
        console.log(response.data); // Log the response data to verify it
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
    const printContent = document.getElementById("printable-order").innerHTML;
    const printWindow = window.open("", "", "height=600,width=800");
  
    // Sao chép tất cả các liên kết đến các tệp CSS
    const styles = Array.from(document.querySelectorAll("link[rel='stylesheet'], style")).map((style) => style.outerHTML).join("");
  
    // Thêm CSS cho việc in
    const printStyles = `
      <style>
        body {
          background: none !important;
          -webkit-print-color-adjust: exact; /* For Chrome */
          color-adjust: exact; /* For Firefox and Edge */
        }
        @page {
          margin: 0;
        }
        @media print {
          body {
            margin: 1.6cm;
          }
        }
      </style>
    `;
  
    printWindow.document.write('<html><head><title>Print Order</title>');
    printWindow.document.write(styles); // Chèn các kiểu CSS vào tài liệu mới
    printWindow.document.write(printStyles); // Chèn các kiểu in vào tài liệu mới
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
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

  const calculateOrderStatus = (orderDetails) => {
    const statusPriority = {
      Pending: 1,
      Packaging: 2,
      Shipping: 3,
      Paid: 4,
      Delivered: 5,
      Cancelled: 6,
      Refunded: 7,
      Returned: 8,
    };

    if (orderDetails.some((detail) => detail.status === "Pending")) {
      return "Pending";
    }

    if (orderDetails.every((detail) => detail.status === "Cancelled")) {
      return "Cancelled";
    }

    let highestPriorityStatus = "Delivered";
    for (let detail of orderDetails) {
      if (
        statusPriority[detail.status] < statusPriority[highestPriorityStatus]
      ) {
        highestPriorityStatus = detail.status;
      }
    }

    return highestPriorityStatus;
  };

  const isOrderEditable = (status) => {
    const nonEditableStatuses = [
      "Delivered",
      "Cancelled",
      "Refunded",
      "Returned",
    ];
    return !nonEditableStatuses.includes(status);
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

  const renderStatusText = (status) => {
    return <span style={{ color: getStatusColor(status) }}>{status}</span>;
  };

  const orderEditable = isOrderEditable(order.status);
  const subtotal = order.orderDetails.reduce(
    (acc, detail) => acc + detail.product.price * detail.quantity,
    0
  );
  const totalPrice = subtotal + order.shippingCost;
  const saveOrderChanges = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/api/v1/orders/update/${id}`,
        order,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error saving order changes:", error);
    }
  };
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
            {orderEditable && (
              <>
                <div className="button" onClick={handleEdit}>
                  <p>Edit</p>
                </div>
                <div className="button" onClick={handlePrint}>
                  <p>Print</p>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="below-page-box">
          <div className="time-order">
            <p> Placed at: {formatDateTime(order.createdAt)}</p>{" "}
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
                        <p>{detail.product.name}</p>
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
                        ${detail.product.price} x{" "}
                        {orderEditable &&
                        editableQuantityId === detail.orderDetailId ? (
                          <InputNumber
                            min={1}
                            value={detail.quantity}
                            onChange={(value) =>
                              handleQuantityChange(detail.orderDetailId, value)
                            }
                            onBlur={saveOrderChanges}
                          />
                        ) : (
                          <>
                            {detail.quantity}
                            {orderEditable && (
                              <FaPen
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  setEditableQuantityId(detail.orderDetailId)
                                }
                              />
                            )}
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
                  </div>
                </div>
              ))}
            </div>
            <div className="total-price-order-details-admin">
              <div className="sub-price-ordtails">
                <div className="price-title-sub">
                  <p>Subtotal</p>
                </div>
                <div className="price-title-sub">
                  <p>${subtotal}</p>
                </div>
              </div>
              <div className="sub-price-ordtails">
                <div className="price-title-sub">
                  <p>Shipping</p>
                </div>
                <div className="price-title-sub">
                  <p>${order.shippingCost}</p>
                </div>
              </div>
              <div className="total-price-ordtails">
                <div className="price-title">
                  <p>Total</p>
                </div>
                <div className="price-title">
                  <p>${totalPrice}</p>
                </div>
              </div>
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
                {orderEditable && (
                  <div>
                    <p>
                      <FaPen
                        style={{ cursor: "pointer", marginLeft: "10px" }}
                        onClick={showEditModal}
                        className="icon-pencil"
                      />
                    </p>
                  </div>
                )}
              </div>
              <div className="info-container-cus-details">
                <div className="name-cus-container">
                  <div className="name-user">
                    <p>{order.user.userName}</p>
                  </div>
                  <p>1 order</p>
                </div>
                <div className="contact-info-cus">
                  <div className="title-contact-info-cus">
                    <p>Contact information</p>
                  </div>
                  <div className="email-info-cus">
                    <p>{editableFields.email}</p>
                  </div>
                  <div className="phone-info-cus">
                    <p>{editableFields.phone}</p>
                  </div>
                  <div className="first-name-cus">
                    <p>
                      {editableFields.firstName} {editableFields.lastName}
                    </p>
                  </div>
                </div>
                <div className="shipping-address-cus">
                  <div className="title-shipping-cus">
                    <p>Shipping address</p>
                  </div>
                  <div className="info-address-shipping">
                    <p>{`${editableFields.address}, ${editableFields.city}`}</p>
                  </div>
                </div>
                <div className="billing-address-cus">
                  <div className="billing-title">
                    <p>Billing address</p>
                  </div>
                  <div className="content-billing">
                    <p> Same as shipping address</p>
                  </div>
                </div>
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
            disabled={!orderEditable}
          />
        </div>
        <div>
          <label>First Name:</label>
          <Input
            value={editableFields.firstName}
            onChange={(e) => handleFieldChange("firstName", e.target.value)}
            disabled={!orderEditable}
          />
        </div>
        <div>
          <label>Last Name:</label>
          <Input
            value={editableFields.lastName}
            onChange={(e) => handleFieldChange("lastName", e.target.value)}
            disabled={!orderEditable}
          />
        </div>
        <div>
          <label>Phone:</label>
          <Input
            value={editableFields.phone}
            onChange={(e) => handleFieldChange("phone", e.target.value)}
            disabled={!orderEditable}
          />
        </div>
        <div>
          <label>Address:</label>
          <Input
            value={editableFields.address}
            onChange={(e) => handleFieldChange("address", e.target.value)}
            disabled={!orderEditable}
          />
        </div>
        <div>
          <label>City:</label>
          <Input
            value={editableFields.city}
            onChange={(e) => handleFieldChange("city", e.target.value)}
            disabled={!orderEditable}
          />
        </div>
        <div>
          <label>Postal Code:</label>
          <Input
            value={editableFields.postalCode}
            onChange={(e) => handleFieldChange("postalCode", e.target.value)}
            disabled={!orderEditable}
          />
        </div>
      </Modal>
      <div id="printable-order" style={{ display: 'none' }}>
        <PrintableOrder
          order={order}
          email={editableFields.email}
          orderDate={formatDateTime(order.createdAt)}
          total={totalPrice}
          subtotal={subtotal}  // Ensure subtotal is passed correctly
          paymentMethod={order.payment.paymentMethod}
        />
      </div>
    </div>
  );
};

export default OrderDetails;
    
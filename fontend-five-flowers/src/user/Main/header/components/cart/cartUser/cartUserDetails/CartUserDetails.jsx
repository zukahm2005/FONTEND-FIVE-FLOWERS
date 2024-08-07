import { Button, message, Modal, Table, Tag } from "antd";
import axios from "axios";
import React, { useState } from "react";
import "./cartUserDetails.scss";

const CartUserDetails = ({ order, fetchUserOrders }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const totalOrderDetailsPrice = order.orderDetails.reduce(
    (total, detail) => total + detail.product.price * detail.quantity,
    0
  );

  const totalPrice = totalOrderDetailsPrice + order.shippingCost;

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

  const getStatusTag = (status) => {
    let color;
    switch (status) {
      case "Pending":
        color = "orange";
        break;
      case "Paid":
        color = "green";
        break;
      case "Packaging":
        color = "blue";
        break;
      case "Shipping":
        color = "purple";
        break;
      case "Delivered":
        color = "cyan";
        break;
      case "Cancelled":
        color = "red";
        break;
      case "Refunded":
        color = "magenta";
        break;
      case "Returned":
        color = "black";
        break;
      default:
        color = "default";
    }
    return <Tag color={color}>{status}</Tag>;
  };

  const handleCancelOrder = async () => {
    if (order.status !== "Pending") {
      message.error("Order can only be cancelled if it is pending.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8080/api/v1/orders/${order.orderId}/status`,
        { status: "Cancelled" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.status === 200) {
        message.success("Order cancelled successfully.");
        window.location.reload(); // Reload page after successful cancellation
      } else {
        message.error("Failed to cancel order.");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      if (error.response) {
        message.error(error.response.data.message || "Failed to cancel order.");
      } else {
        message.error("Failed to cancel order.");
      }
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    handleCancelOrder();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Image",
      dataIndex: "product",
      key: "product",
      render: (product) =>
        product.productImages && product.productImages.length > 0 ? (
          <img
            src={`http://localhost:8080/api/v1/images/${product.productImages[0].imageUrl}`}
            alt={product.name}
            width="50"
            height="50"
          />
        ) : (
          "No Image"
        ),
    },
    {
      title: "Name",
      dataIndex: "product",
      key: "productName",
      render: (product) => product.name,
    },
    {
      title: "Price",
      dataIndex: "product",
      key: "productPrice",
      render: (product) => `$${parseInt(product.price)}`, // Hiển thị giá gốc
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity) => `x ${quantity}`,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (text, record) =>
        `$${parseInt(record.product.price * record.quantity)}`, // Tính tổng
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
  ];

  return (
    <div className="cart-user-details">
      <Table
        dataSource={order.orderDetails.sort(
          (a, b) => statusPriority[a.status] - statusPriority[b.status]
        )}
        columns={columns}
        rowKey="orderDetailId"
        pagination={false}
      />
      <div className="order-summary">
        <div className="summary-total-order">
          <div className="title-summary-total">
            <p>Total:</p>
          </div>
          <div className="price-total-summary-total">
            <p>${totalPrice}</p>
          </div>
        </div>
        <div className="button-cancel-order">
          {order.status === "Pending" && (
            <>
              <Button type="danger" onClick={showModal}>
                <p>Cancel</p>
              </Button>
              <Modal
                title="Confirm Cancellation"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                <p>Are you sure you want to cancel this order?</p>
              </Modal>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartUserDetails;

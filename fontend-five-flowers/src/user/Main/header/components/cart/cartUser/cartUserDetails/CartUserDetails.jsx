import { Table, Tag } from "antd";
import React from "react";
import "./cartUserDetails.scss";

const CartUserDetails = ({ order }) => {
  const totalOrderDetailsPrice = order.orderDetails.reduce(
    (total, detail) => total + detail.product.price * detail.quantity,
    0
  );

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
      render: (product) => `$${parseInt(product.price)}`,
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
        `$${parseInt(record.product.price * record.quantity)}`,
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
        <p>
          <strong>Total:</strong> ₹{parseInt(totalOrderDetailsPrice + 2)}
        </p>
      </div>
    </div>
  );
};

export default CartUserDetails;

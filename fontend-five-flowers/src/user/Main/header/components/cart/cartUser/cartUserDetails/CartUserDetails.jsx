import React from "react";
import "./cartUserDetails.scss";

const CartUserDetails = ({ order }) => {
  const totalOrderDetailsPrice = order.orderDetails.reduce(
    (total, detail) => total + detail.product.price * detail.quantity,
    0
  );

  return (
    <div className="cart-user-details">
      <table className="order-details-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {order.orderDetails.map((detail, index) => (
            <tr key={detail.orderDetailId}>
              <td>{index + 1}</td>
              <td>
                {detail.product.productImages &&
                detail.product.productImages.length > 0 ? (
                  <img
                    src={`http://localhost:8080/api/v1/images/${detail.product.productImages[0].imageUrl}`}
                    alt={detail.product.name}
                    width="50"
                    height="50"
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td>{detail.product.name}</td>
              <td>₹{parseInt(detail.product.price)}</td> {/* Hiển thị giá gốc */}
              <td>x {detail.quantity}</td>
              <td>₹{parseInt(detail.product.price * detail.quantity)}</td>
              <td className={getStatusClassName(detail.status)}>
                <strong>{detail.status}</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="order-summary">
        <p>
          <strong> Total:</strong> ₹{parseInt(totalOrderDetailsPrice + 2)}
        </p>
      </div>
    </div>
  );
};

const getStatusClassName = (status) => {
  switch (status) {
    case "Pending":
      return "status-pending";
    case "Completed":
      return "status-completed";
    case "Canceled":
      return "status-canceled";
    default:
      return "";
  }
};

export default CartUserDetails;

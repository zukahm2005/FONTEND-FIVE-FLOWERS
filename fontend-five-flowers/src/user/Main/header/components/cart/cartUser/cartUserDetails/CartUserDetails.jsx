import React from "react";
import "./cartUserDetails.scss";

const CartUserDetails = ({ order }) => {
  const totalOrderDetailsPrice = order.orderDetails.reduce(
    (total, detail) => total + detail.price * detail.quantity,
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
              <td>₹{parseInt(detail.price)}</td>
              <td>x {detail.quantity}</td>
              <td>₹{parseInt(detail.price * detail.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="order-summary">
        <p>Total: ₹{parseInt(totalOrderDetailsPrice + 2)}</p>
      </div>
    </div>
  );
};

export default CartUserDetails;

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { CartContext } from "../../cart/cartContext/CartProvider";
import "./cartUser.scss";
import { jwtDecode } from "jwt-decode";
const CartUser = () => {
  const { isLoggedIn } = useContext(CartContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!isLoggedIn) return;
      try {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        const response = await axios.get(
          `http://localhost:8080/api/v1/orders/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching user orders:", error);
      }
    };

    fetchUserOrders();
  }, [isLoggedIn]);

  return (
    <div className="cart-user-container">
      <h3>Orders</h3>
      {orders.length ? (
        <ul>
          {orders.map((order) => (
            <li key={order.orderId} className="cart-item">
              <h4>Order ID: {order.orderId}</h4>
              {order.orderDetails.map((item) => (
                <div key={item.orderDetailId} className="order-detail">
                  {item.product.productImages[0]?.imageUrl && (
                    <img
                      src={`http://localhost:8080/api/v1/images/${item.product.productImages[0].imageUrl}`}
                      alt={item.product.name}
                      className="product-image"
                    />
                  )}
                  <div className="product-details">
                    <p>Product: {item.product.name}</p>
                    <p>Description: {item.product.description}</p>
                    <p>Brand: {item.product.brand.name}</p>
                    <p>Category: {item.product.category.name}</p>
                    <p>Color: {item.product.color}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ${item.price}</p>
                  </div>
                </div>
              ))}
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders found</p>
      )}
    </div>
  );
};

export default CartUser;

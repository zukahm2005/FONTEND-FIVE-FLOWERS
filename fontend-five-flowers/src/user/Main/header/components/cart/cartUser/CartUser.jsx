import React, { useContext, useEffect } from "react";
import { CartContext } from "../../cart/cartContext/CartProvider";
import "./cartUser.scss"; // Create a CSS file to style the component

const CartUser = () => {
  const { cart, isLoggedIn } = useContext(CartContext);

  useEffect(() => {
    console.log("Cart updated:", cart);
  }, [cart]);

  return (
    <div className="cart-user-container">
      <h3>Orders</h3>
      {cart.length ? (
        <ul>
          {cart.map((item) => (
            <li key={item.productId} className="cart-item">
              {item.productImages && item.productImages.length > 0 && (
                <img
                  src={`http://localhost:8080/api/v1/images/${item.productImages[0].imageUrl}`} // Assuming productImages has an imageUrl attribute
                  alt={item.name}
                  className="product-image"
                />
              )}
              <div className="product-details">
                <p>Product: {item.name}</p>
                <p>Description: {item.description}</p>
                <p>Brand: {item.brand.name}</p>
                <p>Category: {item.category.name}</p>
                <p>Color: {item.color}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Total Price: ${item.totalPrice}</p>
              </div>
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

import React, { useContext } from "react";
import { CartContext } from "./cartContext/CartProvider";

const Cart = () => {
  const { cart, handleCheckout } = useContext(CartContext);

  return (
    <div>
      <h1>Cart</h1>
      {cart.length > 0 ? (
        <div>
          {cart.map((item, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <img
                src={`http://localhost:8080/api/v1/images/${item.productImages[0]?.imageUrl}`}
                alt={item.name}
                style={{ width: "100px", height: "100px", marginRight: "10px" }}
              />
              <div>
                <p>{item.name}</p>
                <p>Price: Rs. {item.price}</p>
              </div>
            </div>
          ))}
          <button onClick={handleCheckout}>Checkout</button>
        </div>
      ) : (
        <p>Your cart is empty</p>
      )}
    </div>
  );
};

export default Cart;

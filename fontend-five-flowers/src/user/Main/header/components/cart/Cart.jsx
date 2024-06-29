import { motion } from "framer-motion";
import React, { useContext } from "react";
import "./cart.scss";
import { CartContext } from "./cartContext/CartProvider";

const Cart = () => {
  const { cart, updateQuantity, handleCheckout, totalPrice, removeFromCart } =
    useContext(CartContext);

  const handleQuantityChange = (productId, quantity) => {
    if (quantity > 0) {
      updateQuantity(productId, quantity);
    }
  };

  return (
    <div className="cart-container">
      <div className="title-cart-container">
        <p>Your Cart</p>
      </div>
      <div className="container-main-show-cart">
        {cart.length > 0 ? (
          <div>
            {cart.map((item, index) => (
              <div className="content-main-cart-container" key={index}>
                <motion.div
                  className="details-content-cart-container"
                >
                  <motion.div
                    className="delete-button"
                    initial={{ right: "-30px" }}
                    whileHover={{ right: "10px" }}
                    onClick={() => removeFromCart(item.productId)}
                  >
                    X
                  </motion.div>
                  <div className="top-content-cart">
                    <div className="image-cart-container">
                      {item.productImages[0]?.imageUrl && (
                        <img
                          src={`http://localhost:8080/api/v1/images/${item.productImages[0].imageUrl}`}
                          alt={item.name}
                        />
                      )}
                    </div>
                    <div className="details-content-cart">
                      <div className="name-content-cart">
                        <p>{item.name}</p>
                      </div>
                      <div className="desc-content-cart">
                        <div className="desc-brand-content-cart">
                          <p>{item.brand?.name}</p>
                        </div>
                        <div className="space-desc-content-cart">
                          <p>/</p>
                        </div>
                        <div className="desc-category-content-cart">
                          <p>{item.category?.name}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="cacul-container-content-cart">
                    <div className="total-each-product-cart">
                      <p>Rs. {item.totalPrice}</p>
                    </div>
                    <div className="cacul-cart">
                      <div className="cacul-quantity-content-cart">
                        <p
                          onClick={() =>
                            handleQuantityChange(
                              item.productId,
                              item.quantity - 1
                            )
                          }
                        >
                          -
                        </p>
                      </div>
                      <div className="quantity-content-cart">
                        <p>{item.quantity}</p>
                      </div>
                      <div className="cacul-quantity-content-cart">
                        <p
                          onClick={() =>
                            handleQuantityChange(
                              item.productId,
                              item.quantity + 1
                            )
                          }
                        >
                          +
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        ) : (
          <p>Your cart is empty</p>
        )}
      </div>

      <div className="total-price-container-cart">
        <div className="total-price-cart">
          <div className="title-price-cart">
            <p>Total Price</p>
          </div>
          <div className="total-money-cart">
            <p>Rs. {totalPrice}</p>
          </div>
        </div>
      </div>
      <div className="button-checkout-cart">
        <button onClick={handleCheckout}>
          <p>VIEW CART</p>
        </button>
      </div>
    </div>
  );
};

export default Cart;

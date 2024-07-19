import { notification } from 'antd';
import axios from 'axios';
import { motion } from 'framer-motion';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import "./cart.scss";
import { CartContext } from "./cartContext/CartProvider";

const Cart = () => {
  const { cart, updateQuantity, totalPrice, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleQuantityChange = async (productId, quantity) => {
    const product = cart.find((item) => item.productId === productId);
    const response = await axios.get(`http://localhost:8080/api/v1/products/get/${product.productId}`);
    const availableQuantity = response.data.quantity;

    if (quantity > 0 && quantity <= availableQuantity) {
      updateQuantity(productId, quantity);
    } else if (quantity > availableQuantity) {
      notification.error({
        message: "Out of Stock",
        description: `Only ${availableQuantity} items left in stock.`,
      });
    }
  };

  const handleViewCart = () => {
    navigate("/shopping-cart", { state: { cart } });
  };

  const handleNavigateToProductDetails = (productId) => {
    navigate(`/product/${productId}`);
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
              <motion.div
                className="content-main-cart-container"
                key={index}
                whileHover="hover"
              >
                <motion.div className="details-content-cart-container">
                  <div className="top-content-cart">
                    <motion.div
                      className="button-delete-cart"
                      variants={{
                        hover: { x: 10 },
                      }}
                      onClick={() => removeFromCart(item.productId)}
                    >
                      <p>X</p>
                    </motion.div>
                    <div className="image-cart-container" onClick={() => handleNavigateToProductDetails(item.productId)}>
                      {item.productImages && item.productImages[0] && item.productImages[0].imageUrl ? (
                        <img
                          src={`http://localhost:8080/api/v1/images/${item.productImages[0].imageUrl}`}
                          alt={item.name}
                        />
                      ) : (
                        <img
                          src="path_to_default_image" // Bạn nên cung cấp đường dẫn tới ảnh mặc định ở đây
                          alt="default"
                        />
                      )}
                    </div>
                    <div className="details-content-cart">
                      <div className="name-content-cart" onClick={() => handleNavigateToProductDetails(item.productId)}>
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
                      <p>₹{item.totalPrice}</p>
                    </div>
                    <div className="cacul-cart">
                      <div
                        className="cacul-quantity-content-cart"
                        onClick={() =>
                          handleQuantityChange(item.productId, item.quantity - 1)
                        }
                      >
                        <p>-</p>
                      </div>
                      <div className="quantity-content-cart">
                        <p>{item.quantity}</p>
                      </div>
                      <div
                        className="cacul-quantity-content-cart"
                        onClick={() =>
                          handleQuantityChange(item.productId, item.quantity + 1)
                        }
                      >
                        <p>+</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
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
            <p>₹{totalPrice}</p>
          </div>
        </div>
      </div>
      <div className="button-checkout-cart">
        <button onClick={handleViewCart}>
          <p>VIEW CART</p>
        </button>
      </div>
    </div>
  );
};

export default Cart;

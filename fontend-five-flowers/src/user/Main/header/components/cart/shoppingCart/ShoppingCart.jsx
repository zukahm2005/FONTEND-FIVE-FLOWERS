import { notification } from "antd";
import axios from "axios";
import React, { useContext, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../cartContext/CartProvider";
import "./shoppingCart.scss";

const ShoppingCart = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalPrice,
    setCart,
  } = useContext(CartContext);
  const navigate = useNavigate();
  const shippingCost = 5; // Định nghĩa phí vận chuyển cố định

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCart(cartItems);
  }, [setCart]);

  const handleQuantityChange = async (productId, quantity) => {
    const product = cart.find((item) => item.productId === productId);
    const response = await axios.get(
      `http://localhost:8080/api/v1/products/get/${product.productId}`
    );
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

  const handleNavigateToProductDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleProceedToCheckout = () => {
    navigate("/checkout", { state: { cart, totalPrice } });
  };

  return (
    <div className="shopping-cart-container">
      <div className="top-shopping-container">
        <div className="name-top-shopping-container">
          <h1>YOUR SHOPPING CART</h1>
        </div>
        <div className="name-bottom-shopping-container">
          <div className="home-name-bsc">
            <Link to="/">
              <p>Home</p>
            </Link>
          </div>
          <span className="breadcrumb__sep">
            <p>/</p>
          </span>
          <p>Your Shopping Cart</p>
        </div>
      </div>
      <div className="background-bot-shopping-cart-container">
        <div className="shopping-cart-session-main">
          {cart.length > 0 ? (
            <div className="shopping-cart-items">
              <div className="shopping-cart-header">
                <p>Products</p>
              </div>
              {cart.map((item, index) => (
                <div className="shopping-cart-row" key={index}>
                  <div
                    className="shopping-cart-image"
                    onClick={() =>
                      handleNavigateToProductDetails(item.productId)
                    }
                  >
                    {item.imageUrl && (
                      <img
                        src={`http://localhost:8080/api/v1/images/${item.imageUrl}`}
                        alt={item.name}
                      />
                    )}
                  </div>
                  <div className="shopping-cart-info">
                    <div
                      className="name-shcart"
                      onClick={() =>
                        handleNavigateToProductDetails(item.productId)
                      }
                    >
                      <p>{item.name}</p>
                    </div>
                    <div className="category-shcart">
                      <p>
                        {item.category} / {item.brand}
                      </p>
                    </div>
                    <div className="price-shcart">
                      <p>${item.price}</p> {/* Hiển thị giá sản phẩm */}
                    </div>
                    <div className="quantity-controls">
                      <div
                        className="button-quantity"
                        onClick={() =>
                          handleQuantityChange(
                            item.productId,
                            item.quantity - 1
                          )
                        }
                      >
                        <p>-</p>
                      </div>
                      <span>{item.quantity}</span>
                      <div
                        className="button-quantity"
                        onClick={() =>
                          handleQuantityChange(
                            item.productId,
                            item.quantity + 1
                          )
                        }
                      >
                        <p>+</p>
                      </div>
                    </div>
                    <div className="price-shcart">
                      <p>Total: ${item.totalPrice}</p>{" "}
                      {/* Hiển thị tổng giá sản phẩm */}
                    </div>
                    <div className="delete-button-shopping-cart">
                      <button onClick={() => removeFromCart(item.productId)}>
                        <p>X</p>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <Link to="/shop">
                {" "}
                <div className="continue-shopping">
                  {" "}
                  <div className="arrow-back-continue-shopping">
                    <p>
                      <FaArrowLeft />
                    </p>
                  </div>
                  <div className="text-back-continue-shopping">
                    <p>CONTINUE TO SHOPPING</p>
                  </div>{" "}
                </div>
              </Link>
            </div>
          ) : (
            <p>Your cart is empty</p>
          )}
          <div className="total-price-container-cart">
            <div className="total-price-cart">
              <div className="info-price-total-container-shopping-cart">
                <div className="container-title-price-shopping-cart">
                  <div className="subtotal-shopping-cart">
                    <p>Subtotal: </p>
                  </div>
                  <div className="shipping-shopping-cart">
                    <p>Shipping: </p>
                  </div>
                  <div className="title-price-shopping-cart">
                    <p>Total: </p>
                  </div>
                </div>
                <div className="container-price-cart">
                  <div className="sub-price-shopping-cart">
                    <p>${subtotal}</p>
                  </div>
                  <div className="shipping-price-shopping-cart">
                    <p>${shippingCost}</p>
                  </div>
                  <div className="total-money-shopping-cart">
                    <p>${totalPrice}</p>
                  </div>
                </div>
              </div>

              <div className="text-total-cart">
                <i>
                  Shipping, taxes, and discounts will be calculated at checkout.
                </i>
              </div>
              <div className="button-checkout">
                <button onClick={handleProceedToCheckout}>
                  <p>PROCEED TO CHECKOUT</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;

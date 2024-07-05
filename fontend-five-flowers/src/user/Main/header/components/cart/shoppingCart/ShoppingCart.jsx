import { notification } from "antd";
import axios from "axios";
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../cartContext/CartProvider";
import "./shoppingCart.scss";

const ShoppingCart = () => {
  const { cart, updateQuantity, removeFromCart, totalPrice } = useContext(CartContext);
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
                  <div className="shopping-cart-image" onClick={() => handleNavigateToProductDetails(item.productId)}>
                    {item.productImages[0]?.imageUrl && (
                      <img
                        src={`http://localhost:8080/api/v1/images/${item.productImages[0].imageUrl}`}
                        alt={item.name}
                      />
                    )}
                  </div>
                  <div className="shopping-cart-info">
                    <div className="name-shcart" onClick={() => handleNavigateToProductDetails(item.productId)}>
                      <p>{item.name}</p>
                    </div>
                    <div className="category-shcart">
                      <p>
                        {item.category.name} / {item.brand.name}
                      </p>
                    </div>
                    <div className="price-shcart">
                      <p>Rs. {item.price}</p>
                    </div>
                    <div className="quantity-controls">
                      <div
                        className="button-quantity"
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                      >
                        <p>-</p>
                      </div>
                      <span>{item.quantity}</span>
                      <div
                        className="button-quantity"
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                      >
                        <p>+</p>
                      </div>
                    </div>
                    <div className="price-shcart">
                      <p>Total: Rs. {item.totalPrice}</p>
                    </div>
                    <div className="delete-button-shopping-cart">
                      <button onClick={() => removeFromCart(item.productId)}>
                        <p>X</p>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="continue-shopping">
                <button>
                  <Link to="/shop">
                    <p>CONTINUE TO SHOPPING</p>
                  </Link>
                </button>
              </div>
            </div>
          ) : (
            <p>Your cart is empty</p>
          )}
          <div className="total-price-container-cart">
            <div className="total-price-cart">
              <div className="title-price-cart">
                <p>Order Summary</p>
              </div>
              <div className="total-money-cart">
                <p>Subtotal : Rs. {totalPrice}</p>
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

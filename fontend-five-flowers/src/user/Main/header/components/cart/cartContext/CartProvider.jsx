import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { notification } from 'antd';

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const productInCart = prevCart.find((item) => item.productId === product.productId);
      if (productInCart) {
        return prevCart.map((item) =>
          item.productId === product.productId ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.price } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1, totalPrice: product.price }];
      }
    });
  };

  const updateQuantity = (productId, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId ? { ...item, quantity, totalPrice: quantity * item.price } : item
      )
    );
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      notification.error({
        message: 'Login Required',
        description: 'Please log in to proceed with checkout.',
      });
      return;
    }

    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userId = decodedToken.userId;

      const orderDetails = cart.map((product) => ({
        product: { productId: product.productId },
        quantity: product.quantity,
        price: product.price,
      }));

      await axios.post("http://localhost:8080/api/v1/orders/add", {
        user: { id: userId },
        orderDetails: orderDetails,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      notification.success({
        message: 'Order Placed',
        description: 'Your order has been placed successfully!',
      });
      setCart([]);
    } catch (error) {
      console.error("Error placing order:", error);
      notification.error({
        message: 'Order Error',
        description: 'Unable to place your order. Please try again.',
      });
    }
  };

  const totalPrice = cart.reduce((total, product) => total + product.totalPrice, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, handleCheckout, isLoggedIn, setIsLoggedIn, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

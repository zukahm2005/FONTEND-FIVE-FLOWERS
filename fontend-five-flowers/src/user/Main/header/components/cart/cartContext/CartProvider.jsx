import { notification } from "antd";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Correct named import
import React, { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchCartItems();
    }
  }, []);

  const fetchCartItems = () => {
    try {
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      setCart(cartItems);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
    }
  };

  const saveCartItems = (cartItems) => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    setCart(cartItems);
  };

  const login = async (token) => {
    setIsLoggedIn(true);
    localStorage.setItem("token", token);
    fetchCartItems();
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cartItems");
    setIsLoggedIn(false);
    setCart([]);
  };

  const addToCart = async (product, quantity = 1) => {
    if (!isLoggedIn) {
      notification.error({
        message: "Login Required",
        description: "Please log in to add products to your cart.",
      });
      return;
    }

    const response = await axios.get(
      `http://localhost:8080/api/v1/products/get/${product.productId}`
    );
    const availableQuantity = response.data.quantity;

    const newCart = [...cart];
    const productInCart = newCart.find(
      (item) => item.productId === product.productId
    );
    if (productInCart) {
      if (productInCart.quantity + quantity <= availableQuantity) {
        productInCart.quantity += quantity;
        productInCart.totalPrice = productInCart.quantity * productInCart.price;
      } else {
        notification.error({
          message: "Out of Stock",
          description: `Only ${availableQuantity} items left in stock.`,
        });
        return;
      }
    } else {
      if (quantity <= availableQuantity) {
        newCart.push({
          ...product,
          quantity,
          totalPrice: quantity * product.price,
        });
      } else {
        notification.error({
          message: "Out of Stock",
          description: `Only ${availableQuantity} items left in stock.`,
        });
        return;
      }
    }

    saveCartItems(newCart);
  };

  const updateQuantity = (productId, quantity) => {
    const newCart = cart.map((item) => {
      if (item.productId === productId) {
        return { ...item, quantity, totalPrice: quantity * item.price };
      }
      return item;
    });
    saveCartItems(newCart);
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      notification.error({
        message: "Login Required",
        description: "Please log in to proceed with checkout.",
      });
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      const orderDetails = cart.map((product) => ({
        product: { productId: product.productId },
        quantity: product.quantity,
        price: product.price,
      }));

      const response = await axios.post(
        "http://localhost:8080/api/v1/orders/add",
        {
          user: { id: userId },
          orderDetails: orderDetails,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the product quantities in the database
      for (const product of cart) {
        await axios.put(
          `http://localhost:8080/api/v1/products/reduceQuantity/${product.productId}`,
          null,
          {
            params: {
              quantity: product.quantity,
            },
          }
        );
      }

      notification.success({
        message: "Order Placed",
        description: "Your order has been placed successfully!",
      });
      saveCartItems([]);
    } catch (error) {
      console.error("Error placing order:", error);
      notification.error({
        message: "Order Error",
        description: "Unable to place your order. Please try again.",
      });
    }
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter((item) => item.productId !== productId);
    saveCartItems(newCart);
  };

  const totalPrice = cart.reduce(
    (total, product) => total + product.totalPrice,
    0
  );

  const distinctProductCount = cart.length;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        handleCheckout,
        removeFromCart,
        isLoggedIn,
        setIsLoggedIn,
        setCart,
        totalPrice,
        distinctProductCount,
        logout,
        login,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

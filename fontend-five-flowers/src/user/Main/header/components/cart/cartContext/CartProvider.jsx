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
      fetchOrders(token);
    }
  }, []);

  const fetchOrders = async (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      const response = await axios.get(
        `http://localhost:8080/api/v1/orders/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const orders = response.data;
      console.log("Orders fetched:", orders); // Log orders
      const cartItems = orders.flatMap((order) =>
        order.orderDetails.map((detail) => ({
          ...detail.product,
          quantity: detail.quantity,
          totalPrice: detail.quantity * detail.price,
        }))
      );
      console.log("Cart items mapped:", cartItems); // Log cart items
      setCart(cartItems);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const login = async (token) => {
    setIsLoggedIn(true);
    localStorage.setItem("token", token);
    await fetchOrders(token); // Ensure orders are fetched before continuing
  };

  const logout = () => {
    localStorage.removeItem("token");
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

    setCart((prevCart) => {
      const productInCart = prevCart.find(
        (item) => item.productId === product.productId
      );
      if (productInCart) {
        if (productInCart.quantity + quantity <= availableQuantity) {
          return prevCart.map((item) =>
            item.productId === product.productId
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                  totalPrice: (item.quantity + quantity) * item.price,
                }
              : item
          );
        } else {
          notification.error({
            message: "Out of Stock",
            description: `Only ${availableQuantity} items left in stock.`,
          });
          return prevCart;
        }
      } else {
        if (quantity <= availableQuantity) {
          return [
            ...prevCart,
            { ...product, quantity, totalPrice: quantity * product.price },
          ];
        } else {
          notification.error({
            message: "Out of Stock",
            description: `Only ${availableQuantity} items left in stock.`,
          });
          return prevCart;
        }
      }
    });
  };

  const updateQuantity = (productId, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId
          ? { ...item, quantity, totalPrice: quantity * item.price }
          : item
      )
    );
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

      await axios.post(
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
      setCart([]);
    } catch (error) {
      console.error("Error placing order:", error);
      notification.error({
        message: "Order Error",
        description: "Unable to place your order. Please try again.",
      });
    }
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.productId !== productId)
    );
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

import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

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
    setCart((prevCart) => [...prevCart, product]);
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập để thanh toán.");
      return;
    }

    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userId = decodedToken.userId;

      const orderDetails = cart.map((product) => ({
        product: { productId: product.productId },  // Sửa lại để chắc chắn rằng có productId
        quantity: 1,
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
      alert("Đặt hàng thành công!");
      setCart([]);
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      alert("Không thể đặt hàng.");
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, handleCheckout, isLoggedIn, setIsLoggedIn }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
